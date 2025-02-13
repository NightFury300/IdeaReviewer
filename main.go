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

	port := os.Getenv("PORT")
	router := routes.InitRouter()
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
