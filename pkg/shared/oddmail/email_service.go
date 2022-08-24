package oddmail

// EmailService is an interface for any service capable of sending emails
type EmailService interface {
	Init(config EmailServiceConfig)
	Send(from string, toAddresses []string, ccAddresses []string, subject string, contentType string, body string)
}
