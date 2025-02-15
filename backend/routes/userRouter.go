package routes

import (
	"Ideahub/controllers"
	"Ideahub/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func InitUserRouter(r *mux.Router) {
	userRouter := r.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("/register", controllers.RegisterUser).Methods("POST")
	userRouter.HandleFunc("/login", controllers.LoginUser).Methods("POST")
	userRouter.HandleFunc("/refresh-token", controllers.RefreshToken).Methods("POST")

	//protected-routes
	userRouter.Handle("/logout", middlewares.VerifyJWT(http.HandlerFunc(controllers.LogoutUser))).Methods("POST")
}
