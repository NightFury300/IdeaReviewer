package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitIdeaRouter(r *mux.Router) {
	r.Handle("/ideas", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateIdea))).Methods("POST")
	r.Handle("/ideas", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetUserIdeas))).Methods("GET")
	r.Handle("/ideas/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetIdea))).Methods("GET")
	r.Handle("/ideas/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.UpdateIdea))).Methods("PUT")
	r.Handle("/ideas/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.DeleteIdea))).Methods("DELETE")
}
