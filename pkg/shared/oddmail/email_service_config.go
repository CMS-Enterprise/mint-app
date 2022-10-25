package oddmail

// EmailServiceConfig is an interface for email services
type EmailServiceConfig interface {
	GetHost() string
	GetClientAddress() string
	GetPort() int
	GetDefaultSender() string
	GetUsername() string
	GetPassword() string
}
