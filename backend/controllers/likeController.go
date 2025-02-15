package controllers

/*
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

func ToggleLike(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		TargetID string `json:"target_id"`
	}
	var like models.Like
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body"+err.Error())
		return
	}
	like.TargetID, err = primitive.ObjectIDFromHex(reqBody.TargetID)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Target ID")
		return
	}
	like.UserID = r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)

	var existingLike models.Like
	err = config.DBCollections.Like.FindOne(context.Background(), bson.M{"user_id": like.UserID, "target_id": like.TargetID}).Decode(&existingLike)
	if err == mongo.ErrNoDocuments {
		insertRes, insertErr := config.DBCollections.Like.InsertOne(context.Background(), like)
		if insertErr != nil {
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create Like:"+insertErr.Error())
			return
		}
		like.ID = insertRes.InsertedID.(primitive.ObjectID)
		utils.SendSuccessResponse(w, http.StatusCreated, like)
		return
	} else if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Like:"+err.Error())
		return
	} else {
		_, err := config.DBCollections.Like.DeleteOne(context.Background(), bson.M{"_id": existingLike.ID})
		if err != nil {
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Like:"+err.Error())
			return
		}
		utils.SendSuccessResponse(w, http.StatusOK, "Like Removed Successfully")
		return
	}
}

func GetLikeCount(targetID primitive.ObjectID) (int, error) {
	count, err := config.DBCollections.Like.CountDocuments(context.Background(), bson.M{"target_id": targetID})
	if err != nil {
		return 0, err
	}
	return int(count), nil
}

func DeleteLikesByTargetID(targetID primitive.ObjectID) error {
	_, err := config.DBCollections.Like.DeleteMany(context.Background(), bson.M{"target_id": targetID})
	return err
}*/
