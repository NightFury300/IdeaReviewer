package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitIdeaRouter(r *mux.Router) {
	r.Handle("/ideas", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateIdea))).Methods("POST")
}
