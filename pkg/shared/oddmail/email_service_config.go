package oddmail

// EmailServiceConfig is an interface for email services
type EmailServiceConfig interface {
	GetEnabled() bool
	GetHost() string
	GetClientAddress() string
	GetPort() int
	GetUsername() string
	GetPassword() string
	GetSendTaggedPOCEmails() bool
}
