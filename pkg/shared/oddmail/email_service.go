package oddmail

// EmailService is an interface for any service capable of sending emails
type EmailService interface {
	Send(from string, toAddresses []string, ccAddresses []string, subject string, contentType string, body string) error
}
