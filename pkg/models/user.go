package models

// User represents a user from the database
type User struct {
	Id          string `json:"id", db:"id"`
	EuaId       string `json:"euaId", db:"eua_id"`
	IdmUsername string `json:"idmUsername", db:"idm_username"`
	Commonname  string `json:"commonName", db:"commonName"`
	Email       string `json:"email", db:"email"`
	// TODO work in progress
}
