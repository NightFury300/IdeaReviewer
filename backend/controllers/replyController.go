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

func CreateReply(w http.ResponseWriter, r *http.Request) {
	var reply models.Reply

	err := json.NewDecoder(r.Body).Decode(&reply)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	if reply.Text == "" || reply.CommentID == primitive.NilObjectID {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Please Provide all the fields")
		return
	}

	var comment models.Comment
	err = config.DBCollections.Comment.FindOne(context.Background(), bson.M{"_id": reply.CommentID}).Decode(&comment)

	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Comment ID")
		return
	}

	reply.IdeaID = comment.IdeaID

	userID := r.Context().Value(middlewares.UIDKey).(primitive.ObjectID)

	reply.UserID = userID

	insertedRes, err := config.DBCollections.Reply.InsertOne(context.Background(), reply)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Create New Reply:"+err.Error())
		return
	}

	reply.ID = insertedRes.InsertedID.(primitive.ObjectID)
	utils.SendSuccessResponse(w, http.StatusCreated, reply)
}

func GetReplies(w http.ResponseWriter, r *http.Request) {
	var result []models.Reply

	commentID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Comment ID")
		return
	}

	cursor, err := config.DBCollections.Reply.Find(context.Background(), bson.M{"comment_id": commentID})
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Replies:"+err.Error())
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var reply models.Reply
		cursor.Decode(&reply)

		/*likeCount, err := GetLikeCount(reply.ID)
		if err != nil {
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Fetch Like Count:"+err.Error())
			return
		}
*/
		/*replyWithLikes := map[string]interface{}{
			"reply":     reply,
			//"likeCount": likeCount,
		}*/

		result = append(result, reply)
	}

	utils.SendSuccessResponse(w, http.StatusOK, result)
}

func DeleteReply(w http.ResponseWriter, r *http.Request) {
	replyID, err := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	if err != nil {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid Reply ID")
		return
	}

	res, err := config.DBCollections.Reply.DeleteOne(context.Background(), bson.M{"_id": replyID})
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to Delete Reply:"+err.Error())
		return
	}

	if res.DeletedCount == 0 {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Unable to delete the reply.")
		return
	}

	utils.SendSuccessResponse(w, http.StatusOK, "Reply Deleted Successfully")
}

func DeleteRepliesByCommentID(commentID primitive.ObjectID) error {
	_, err := config.DBCollections.Reply.DeleteMany(context.Background(), bson.M{"comment_id": commentID})
	return err
}

func DeleteRepliesByIdeaID(ideaID primitive.ObjectID) error {
	_, err := config.DBCollections.Reply.DeleteMany(context.Background(), bson.M{"idea_id": ideaID})
	return err
}
