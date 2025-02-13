package controllers

import (
	"Ideahub/config"
	"Ideahub/middlewares"
	"Ideahub/models"
	"Ideahub/utils"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	if user.Email == "" || user.UserName == "" || user.Password == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide all the fields")
		return
	}

	var existingUser models.User
	err = config.DBCollections.User.FindOne(context.Background(), bson.M{"email": user.Email}).Decode(&existingUser)

	if err == nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "User with that email already exists")
		return
	} else if err != mongo.ErrNoDocuments {
		utils.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	hashPass, err := utils.HashPassword(user.Password)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Hash Password:"+err.Error())
		return
	}

	user.CreatedAt = time.Now()
	user.Password = hashPass

	res, insertErr := config.DBCollections.User.InsertOne(context.Background(), user)
	if insertErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create New User:"+insertErr.Error())
		return
	}

	insertedID := res.InsertedID.(primitive.ObjectID)
	user.ID = insertedID

	refreshToken := utils.GenerateRefreshToken(insertedID.Hex())

	_, updateErr := config.DBCollections.User.UpdateOne(
		context.Background(),
		bson.M{"_id": insertedID},
		bson.M{"$set": bson.M{"refresh_token": refreshToken}},
	)
	if updateErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to update refresh token:"+updateErr.Error())
		return
	}

	user.Password = ""
	user.RefreshToken = refreshToken

	utils.SendSuccessResponse(w, http.StatusCreated, user)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if reqBody.Email == "" || reqBody.Password == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide Email and Password")
		return
	}

	var user models.User
	err := config.DBCollections.User.FindOne(context.Background(), bson.M{"email": reqBody.Email}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid email or password")
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Database error: "+err.Error())
		return
	}

	if !utils.IsPasswordCorrect(reqBody.Password, user.Password) {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid Email or Password")
		return
	}

	accessToken := utils.GenerateAccessToken(user.ID.Hex())
	refreshToken := utils.GenerateRefreshToken(user.ID.Hex())

	update := bson.M{"$set": bson.M{"refresh_token": refreshToken}}
	_, err = config.DBCollections.User.UpdateOne(context.Background(), bson.M{"_id": user.ID}, update)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to store refresh token")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	var response struct {
		ID           string
		UserName     string
		Email        string
		AccessToken  string
		RefreshToken string
	}
	response.ID = user.ID.Hex()
	response.UserName = user.UserName
	response.Email = user.Email
	response.AccessToken = accessToken
	response.RefreshToken = refreshToken
	utils.SendSuccessResponse(w, http.StatusOK, response)
}

func LogoutUser(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middlewares.UIDKey).(string)
	if !ok {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	filter := bson.M{"_id": userId}
	update := bson.M{"$unset": bson.M{"refresh_token": ""}}

	_, err := config.DBCollections.User.UpdateByID(context.Background(), filter, update)

	if err == mongo.ErrNoDocuments {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid User")
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Error Updating the db:"+err.Error())
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
	utils.SendSuccessResponse(w, http.StatusOK, nil)
}
