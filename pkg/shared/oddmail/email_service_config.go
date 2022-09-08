package oddmail

// EmailServiceConfig is an interface for email services
type EmailServiceConfig interface {
	GetHost() string
	GetPort() int
	GetUsername() string
	GetPassword() string
	LoadYAML(filePath string) error
}
