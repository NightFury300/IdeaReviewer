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

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateIdea(w http.ResponseWriter, r *http.Request) {
	var idea models.Idea

	err := json.NewDecoder(r.Body).Decode(&idea)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	if idea.Title == "" || idea.Description == "" {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide all the fields")
		return
	}

	userId := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)
	idea.UserID = userId
	idea.CreatedAt = time.Now()
	idea.UpdatedAt = time.Now()

	insertRes, insertErr := config.DBCollections.Idea.InsertOne(context.Background(), idea)
	idea.ID = insertRes.InsertedID.(primitive.ObjectID)
	if insertErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create New Idea:"+insertErr.Error())
		return
	}
	utils.SendSuccessResponse(w, http.StatusCreated, idea)
}

func GetUserIdeas(w http.ResponseWriter, r *http.Request) {
	var ideas []models.Idea

	userID := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)

	cursor, err := config.DBCollections.Idea.Find(context.Background(), bson.M{"user_id": userID})
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Ideas:"+err.Error())
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var idea models.Idea
		cursor.Decode(&idea)
		ideas = append(ideas, idea)
	}

	utils.SendSuccessResponse(w, http.StatusOK, ideas)
}

func GetIdea(w http.ResponseWriter, r *http.Request) {
	var idea models.Idea

	ideaID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Idea ID")
		return
	}

	err = config.DBCollections.Idea.FindOne(context.Background(), bson.M{"_id": ideaID}).Decode(&idea)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Idea:"+err.Error())
		return
	}

	utils.SendSuccessResponse(w, http.StatusOK, idea)
}

func UpdateIdea(w http.ResponseWriter, r *http.Request) {
	var idea models.Idea

	ideaID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Idea ID")
		return
	}

	err = json.NewDecoder(r.Body).Decode(&idea)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	updateFields := bson.M{}
	if idea.Title != "" {
		updateFields["title"] = idea.Title
	}
	if idea.Description != "" {
		updateFields["description"] = idea.Description
	}
	if len(updateFields) == 0 {
		utils.SendErrorResponse(w, http.StatusBadRequest, "No fields provided for update")
		return
	}

	updateFields["updated_at"] = time.Now()

	var updatedRes models.Idea

	updateErr := config.DBCollections.Idea.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": ideaID},
		bson.M{"$set": updateFields},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&updatedRes)

	if updateErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Update Idea:"+updateErr.Error())
		return
	}
	utils.SendSuccessResponse(w, http.StatusOK, updatedRes)
}

func DeleteIdea(w http.ResponseWriter, r *http.Request) {
	ideaID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Idea ID")
		return
	}

	_, deleteErr := config.DBCollections.Idea.DeleteOne(context.Background(), bson.M{"_id": ideaID})
	if deleteErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Idea:"+deleteErr.Error())
		return
	}

	utils.SendSuccessResponse(w, http.StatusOK, "Idea Deleted Successfully")
}
