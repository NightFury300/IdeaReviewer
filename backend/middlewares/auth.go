package middlewares

import (
	"Ideahub/utils"
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ContextKey string

const UIDKey ContextKey = "_id"

func VerifyJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("access_token")
		if err != nil {
			utils.SendErrorResponse(w, http.StatusUnauthorized, "access_token Missing")
			return
		}

		tokenString := cookie.Value

		userID, err := utils.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid token payload", http.StatusUnauthorized)
			return
		}
		userId, _ := primitive.ObjectIDFromHex(userID)

		ctx := context.WithValue(r.Context(), UIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
