package models

// UserAccount represents a user from the database
type UserAccount struct {
	ID          string `json:"id" db:"id"`
	EuaID       string `json:"euaId" db:"eua_id"`
	IdmUsername string `json:"idmUsername" db:"idm_username"`
	Commonname  string `json:"commonName" db:"commonName"`
	Email       string `json:"email" db:"email"`
	// TODO work in progress
}
