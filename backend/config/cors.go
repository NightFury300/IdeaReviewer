package config

import (
	"os"

	"github.com/rs/cors"
)

func InitCors() *cors.Cors {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("FRONTEND_URL")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "Accept"},
		AllowCredentials: true,
	})
	return c
}
