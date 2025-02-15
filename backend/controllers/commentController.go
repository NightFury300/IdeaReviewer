package controllers

import (
	"Ideahub/config"
	"Ideahub/middlewares"
	"Ideahub/models"
	"Ideahub/utils"
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment

	err := json.NewDecoder(r.Body).Decode(&comment)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	if comment.Text == "" || comment.IdeaID == primitive.NilObjectID {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide all the fields")
		return
	}

	userId := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)
	comment.UserID = userId

	insertRes, insertErr := config.DBCollections.Comment.InsertOne(context.Background(), comment)
	if insertErr != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create New Comment:"+insertErr.Error())
		return
	}

	comment.ID = insertRes.InsertedID.(primitive.ObjectID)
	utils.SendSuccessResponse(w, http.StatusCreated, comment)
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
	commentID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Comment ID")
		return
	}

	res, err := config.DBCollections.Comment.DeleteOne(context.Background(), bson.M{"_id": commentID})
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Comment:"+err.Error())
		return
	}

	if res.DeletedCount == 0 {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Unable to delete the comment.")
		return
	}

	err = DeleteRepliesByCommentID(commentID)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Replies:"+err.Error())
		return
	}

	utils.SendSuccessResponse(w, http.StatusOK, "Comment Deleted Successfully")
}

func FetchParentComments(ideaId primitive.ObjectID) ([]models.Comment, error) {
	var comments []models.Comment

	cursor, err := config.DBCollections.Comment.Find(context.Background(), bson.M{"idea_id": ideaId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var comment models.Comment
		cursor.Decode(&comment)
		comments = append(comments, comment)
	}

	return comments, nil
}

func DeleteCommentsByIdeaID(ideaID primitive.ObjectID) error {
	_, err := config.DBCollections.Comment.DeleteMany(context.Background(), bson.M{"idea_id": ideaID})
	return err
}
