package routes

import (
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	InitUserRouter(r)
	//r.HandleFunc("/", controllers.RegisterUser).Methods("Get")
	return r
}
