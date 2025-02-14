package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserName     string             `bson:"username" json:"name"`
	Email        string             `bson:"email" json:"email"`
	Password     string             `bson:"password,omitempty" json:"password"`
	RefreshToken string             `bson:"refresh_token" json:"refresh_token"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}

type Idea struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type Vote struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID   primitive.ObjectID `bson:"user_id" json:"user_id"`
	IdeaID   primitive.ObjectID `bson:"idea_id" json:"idea_id"`
	VoteType string             `bson:"vote_type" json:"vote_type"`
}

type Comment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	IdeaID    primitive.ObjectID `bson:"idea_id" json:"idea_id"`
	Text      string             `bson:"text" json:"text"`
	Likes     int                `bson:"likes" json:"likes"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type CommentLike struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	CommentID primitive.ObjectID `bson:"comment_id" json:"comment_id"`
}

type Reply struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	IdeaID    primitive.ObjectID `bson:"idea_id" json:"idea_id"`
	CommentID primitive.ObjectID `bson:"comment_id" json:"comment_id"`
	Text      string             `bson:"text" json:"text"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
