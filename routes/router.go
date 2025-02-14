package routes

import (
	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	InitUserRouter(r)
	InitIdeaRouter(r)
	InitCommentRouter(r)
	InitReplyRouter(r)
	InitVoteRouter(r)
	InitLikeRouter(r)
	//r.HandleFunc("/", controllers.RegisterUser).Methods("Get")
	return r
}
