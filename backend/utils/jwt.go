package utils

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey string = os.Getenv("JWT_SECRET")

func GenerateAccessToken(userID string,username string) string {
	expiryInMinutes, _ := strconv.Atoi(os.Getenv("ACCESS_TOKEN_EXPIRY_MINUTES"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"username":username,
		"exp":    time.Now().Add(time.Minute * time.Duration(expiryInMinutes)).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(secretKey))
	return tokenString
}

func GenerateRefreshToken(userID string,username string) string {
	expiryInHours, _ := strconv.Atoi(os.Getenv("REFRESH_TOKEN_EXPIRY_HOURS"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"username":username,
		"exp":    time.Now().Add(time.Hour * time.Duration(expiryInHours)).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(secretKey))
	return tokenString
}

func ValidateToken(tokenString string) (string,string, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})
	if err != nil {
		return "","", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return (claims["userID"].(string)),(claims["username"].(string)), nil
	}

	return "","", errors.New("invalid token")
}
