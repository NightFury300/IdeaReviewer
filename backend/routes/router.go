package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

func InitRouter() *mux.Router {
	r := mux.NewRouter()

	InitUserRouter(r)
	InitIdeaRouter(r)
	InitCommentRouter(r)
	InitReplyRouter(r)
	InitVoteRouter(r)
	//InitLikeRouter(r)
	//r.HandleFunc("/", controllers.RegisterUser).Methods("Get")
	r.HandleFunc("/api/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	}).Methods(http.MethodGet, http.MethodHead)
	return r
}
