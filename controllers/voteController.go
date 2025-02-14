package controllers

import (
	"Ideahub/config"
	"Ideahub/middlewares"
	"Ideahub/models"
	"Ideahub/utils"
	"context"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateVote(w http.ResponseWriter, r *http.Request) {

	var reqBody struct {
		IdeaID   primitive.ObjectID `json:"idea_id"`
		VoteType string             `json:"vote_type"`
	}
	userID := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)
	err := json.NewDecoder(r.Body).Decode(&reqBody)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body"+err.Error())
		return
	}

	if reqBody.IdeaID == primitive.NilObjectID || (reqBody.VoteType != "-1" && reqBody.VoteType != "1") {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please a valid Idea Id and Vote Type")
		return
	}

	var existingVote models.Vote
	err = config.DBCollections.Vote.FindOne(context.Background(), bson.M{"user_id": userID, "idea_id": reqBody.IdeaID}).Decode(&existingVote)

	if err == mongo.ErrNoDocuments {
		vote := models.Vote{
			UserID:   userID,
			IdeaID:   reqBody.IdeaID,
			VoteType: reqBody.VoteType,
		}
		insertRes, insertErr := config.DBCollections.Vote.InsertOne(context.Background(), vote)
		if insertErr != nil {
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create New Vote:"+insertErr.Error())
			return
		}
		vote.ID = insertRes.InsertedID.(primitive.ObjectID)
		utils.SendSuccessResponse(w, http.StatusCreated, vote)
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Vote:"+err.Error())
		return
	} else {
		_, err := config.DBCollections.Vote.UpdateOne(context.Background(), bson.M{"_id": existingVote.ID}, bson.M{"$set": bson.M{"vote_type": reqBody.VoteType}})
		if err != nil {
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Update Vote:"+err.Error())
			return
		}
		existingVote.VoteType = reqBody.VoteType
		utils.SendSuccessResponse(w, http.StatusOK, existingVote)
		return
	}
}

func DeleteVote(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		IdeaID primitive.ObjectID `json:"idea_id"`
	}
	userID := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	if reqBody.IdeaID == primitive.NilObjectID {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide Idea ID")
		return
	}

	res, err := config.DBCollections.Vote.DeleteOne(context.Background(), bson.M{"user_id": userID, "idea_id": reqBody.IdeaID})
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Vote:"+err.Error())
		return
	}

	if res.DeletedCount == 0 {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Unable to delete the vote.")
		return
	}

	utils.SendSuccessResponse(w, http.StatusOK, "Vote Deleted Successfully")
}

func DeleteVotesByIdeaID(ideaID primitive.ObjectID) error {
	_, err := config.DBCollections.Vote.DeleteMany(context.Background(), bson.M{"idea_id": ideaID})
	return err
}

func GetVotesCount(ideaId primitive.ObjectID) (int, int, error) {
	upvoteCount := 0
	downvoteCount := 0
	cursor, err := config.DBCollections.Vote.Find(context.Background(), bson.M{"idea_id": ideaId})
	if err != nil {
		return 0, 0, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var vote models.Vote
		cursor.Decode(&vote)
		if vote.VoteType == "1" {
			upvoteCount++
		} else if vote.VoteType == "-1" {
			downvoteCount++
		}
	}
	return upvoteCount, downvoteCount, nil
}
