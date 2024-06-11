package oddmail

// EmailOptions is a struct that holds optional parameters for sending an email
type EmailOptions struct {
	BccAddresses []string
}

type EmailOption func(*EmailOptions)

// WithBCC is an option that allows you to specify BCC addresses for an email
func WithBCC(bccAddresses []string) EmailOption {
	return func(opts *EmailOptions) {
		opts.BccAddresses = bccAddresses
	}
}

// EmailService is an interface for any service capable of sending emails
type EmailService interface {
	Send(from string, toAddresses []string, ccAddresses []string, subject string, contentType string, body string, opts ...EmailOption) error
	GetConfig() EmailServiceConfig
}
