package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type dbCollections struct {
	User        *mongo.Collection
	Idea        *mongo.Collection
	Vote        *mongo.Collection
	Comment     *mongo.Collection
	CommentLike *mongo.Collection
	Reply       *mongo.Collection
}

// var DB *mongo.Database
var DBCollections dbCollections

func ConnectToDB() {
	uri := os.Getenv("MONGODB_URI")
	dbName := os.Getenv("DB_NAME")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Printf("Failed to Connect to DB: %v", err.Error())
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Printf("Could not Ping DB: %v", err.Error())
	}

	DBCollections = dbCollections{
		User:        client.Database(dbName).Collection("users"),
		Idea:        client.Database(dbName).Collection("ideas"),
		Vote:        client.Database(dbName).Collection("votes"),
		Comment:     client.Database(dbName).Collection("comments"),
		CommentLike: client.Database(dbName).Collection("comment_likes"),
		Reply:       client.Database(dbName).Collection("replies"),
	}
	//DB = client.Database(dbName)
	fmt.Println("Successfully Connected to DB")
}
