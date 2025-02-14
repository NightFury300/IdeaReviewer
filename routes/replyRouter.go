package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitReplyRouter(r *mux.Router) {
	r.Handle("/reply", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateReply))).Methods("POST")
	r.Handle("/reply/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.DeleteReply))).Methods("DELETE")
	r.Handle("/reply/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetReplies))).Methods("GET")
}
