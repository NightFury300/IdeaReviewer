package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitCommentRouter(r *mux.Router) {
	r.Handle("/comments", middlewares.VerifyJWT(http.HandlerFunc(controllers.CreateComment))).Methods("POST")
	r.Handle("/comments/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.DeleteComment))).Methods("DELETE")
	r.Handle("/comments/{id}", middlewares.VerifyJWT(http.HandlerFunc(controllers.GetReplies))).Methods("GET")
}
