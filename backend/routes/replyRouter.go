package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitReplyRouter(r *mux.Router) {
	r.HandleFunc("/reply/{id}", controllers.GetReplies).Methods("GET")
	r.Handle("/reply", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateReply))).Methods("POST")
	r.Handle("/reply/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.DeleteReply))).Methods("DELETE")
}
