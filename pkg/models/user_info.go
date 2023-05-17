package models

// UserInfo is the model for the details of a user from the Okta API
type UserInfo struct {
	FirstName   string
	LastName    string
	DisplayName string
	Email       string
	Username    string
}
