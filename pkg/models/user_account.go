package models

import "github.com/google/uuid"

// UserAccount represents a user from the database
type UserAccount struct {
	ID          uuid.UUID `json:"id" db:"id"`
	EuaID       *string   `json:"euaId" db:"eua_id"`
	IdmUserName *string   `json:"idmUsername" db:"idm_username"`
	CommonName  string    `json:"commonName" db:"common_name"`
	Email       string    `json:"email" db:"email"`
	// TODO work in progress
}
