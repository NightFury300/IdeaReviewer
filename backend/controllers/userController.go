package controllers

import (
	"Ideahub/config"
	"Ideahub/middlewares"
	"Ideahub/models"
	"Ideahub/utils"
	"context"
	"encoding/json"
	"log"
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

	user.Password = ""

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
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid Email or Password")
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Database error: "+err.Error())
		return
	}

	if !utils.IsPasswordCorrect(reqBody.Password, user.Password) {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid Email or Password")
		return
	}

	accessToken := utils.GenerateAccessToken(user.ID.Hex(),user.UserName)
	refreshToken := utils.GenerateRefreshToken(user.ID.Hex(),user.UserName)

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
		SameSite: http.SameSiteNoneMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
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
	userId, ok := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)
	if !ok {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	filter := bson.M{"_id": userId}
	update := bson.M{"$set": bson.M{"refresh_token": ""}}

	_, err := config.DBCollections.User.UpdateOne(context.Background(), filter, update)
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
		SameSite: http.SameSiteNoneMode,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
	utils.SendSuccessResponse(w, http.StatusOK, nil)
}

func RefreshToken(w http.ResponseWriter, r *http.Request) {
	log.Println("Refresh Token Called")
	cookie, err := r.Cookie("refresh_token")

	if err != nil {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "refresh_token Missing")
		return
	}

	tokenString := cookie.Value

	userID,username, err := utils.ValidateToken(tokenString)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid Refresh Token")
		return
	}
	userId, err := primitive.ObjectIDFromHex(userID)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Could Not Cast user id to objectID")
		return
	}

	var user models.User
	err = config.DBCollections.User.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User does not exists")
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Could not fetch User from DB:"+err.Error())
		return
	} else if user.RefreshToken == "" {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Unauthorized Request")
		return
	} else if user.RefreshToken != tokenString {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "Refresh Token is Expired or Used")
		return
	}

	newRefreshToken := utils.GenerateRefreshToken(userID,username)
	newAccessToken := utils.GenerateAccessToken(userID,username)

	_, updateErr := config.DBCollections.User.UpdateOne(context.Background(), bson.M{"_id": userId}, bson.M{"$set": bson.M{"refresh_token": newRefreshToken}})
	if updateErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Unable to Refresh Token:"+updateErr.Error())
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
	var response struct {
		AccessToken  string
		RefreshToken string
	}
	response.AccessToken = newAccessToken
	response.RefreshToken = newRefreshToken
	utils.SendSuccessResponse(w, http.StatusOK, response)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	log.Println("PINGED")
	userID := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)

	var response struct {
		ID primitive.ObjectID `json:"_id"`
	}
	response.ID = userID
	utils.SendSuccessResponse(w, http.StatusOK, response)
}
