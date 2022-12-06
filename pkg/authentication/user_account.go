package authentication

import "github.com/google/uuid"

// UserAccount represents a user from the database
type UserAccount struct {
	ID         uuid.UUID `json:"id" db:"id"`
	Username   *string   `json:"username" db:"username"`
	IsEUAID    bool      `json:"isEUAID" db:"is_euaid"`
	CommonName string    `json:"commonName" db:"common_name"`
	Locale     string    `json:"locale" db:"locale"`
	Email      string    `json:"email" db:"email"`
	GivenName  string    `json:"given_name" db:"given_name"`
	FamilyName string    `json:"family_name" db:"family_name"`
	ZoneInfo   string    `json:"zoneinfo" db:"zone_info"`
}
