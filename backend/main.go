package main

import (
	"Ideahub/config"
	"Ideahub/routes"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	config.LoadEnv()
	config.ConnectToDB()
	corsConfig := config.InitCors()

	port := os.Getenv("PORT")
	router := routes.InitRouter()
	handler := corsConfig.Handler(router)
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
