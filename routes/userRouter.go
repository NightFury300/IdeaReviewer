package routes

import (
	"Ideahub/controllers"

	"github.com/gorilla/mux"
)

func InitUserRouter(r *mux.Router) {
	userRouter := r.PathPrefix("/user").Subrouter()
	userRouter.HandleFunc("/register", controllers.RegisterUser).Methods("POST")
	userRouter.HandleFunc("/login", controllers.LoginUser).Methods("POST")
}
