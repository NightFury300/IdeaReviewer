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

	"go.mongodb.org/mongo-driver/bson/primitive"
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
