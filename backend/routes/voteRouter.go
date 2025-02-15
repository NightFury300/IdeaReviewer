package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitVoteRouter(r *mux.Router) {
	r.Handle("/votes", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateVote))).Methods("POST")
	r.Handle("/votes", middlewares.VerifyJWT(http.HandlerFunc(controllers.DeleteVote))).Methods("DELETE")

}
