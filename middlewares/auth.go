package middlewares

import (
	"Ideahub/utils"
	"context"
	"net/http"
)

type ContextKey string

const UIDKey ContextKey = "_id"

func VerifyJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("access_token")
		if err != nil {
			utils.SendErrorResponse(w, http.StatusUnauthorized, "Access_Token Missing")
			return
		}

		tokenString := cookie.Value

		userID, err := utils.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid token payload", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
