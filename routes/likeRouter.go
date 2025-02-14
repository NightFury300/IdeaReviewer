package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitLikeRouter(r *mux.Router) {
	r.Handle("/likes", middlewares.VerifyJWT(http.HandlerFunc(controllers.ToggleLike))).Methods("POST")
}
