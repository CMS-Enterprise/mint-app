package oddmail

import (
	"errors"

	mail "github.com/xhit/go-simple-mail/v2"
)

// GoSimpleMailService is an EmailService implementation for the GoSimpleMail library
type GoSimpleMailService struct {
	smtpServer *mail.SMTPServer
	config     EmailServiceConfig
}

// NewGoSimpleMailService is a constructor for GoSimpleMailService
func NewGoSimpleMailService(config GoSimpleMailServiceConfig) (*GoSimpleMailService, error) {
	if !config.GetEnabled() {
		return &GoSimpleMailService{
			smtpServer: nil,
			config:     &config,
		}, nil
	}

	smtpServer := &mail.SMTPServer{
		Authentication: config.Authentication,
		Encryption:     config.Encryption,
		Username:       config.Username,
		Password:       config.Password,
		Helo:           config.Helo,
		ConnectTimeout: config.ConnectTimeout,
		SendTimeout:    config.SendTimeout,
		Host:           config.Host,
		Port:           config.Port,
		KeepAlive:      config.KeepAlive,
		TLSConfig:      config.TLSConfig,
	}

	return &GoSimpleMailService{
		smtpServer: smtpServer,
		config:     &config,
	}, nil
}

// setEmailBody is a helper method to simplify the process of setting email contentType and body
func (g GoSimpleMailService) setEmailBody(email *mail.Email, contentType string, body string) error {
	switch contentType {
	case "text/plain":
		email.SetBody(mail.TextPlain, body)
	case "text/html":
		email.SetBody(mail.TextHTML, body)
	case "text/calendar":
		email.SetBody(mail.TextCalendar, body)
	default:
		return errors.New("cannot convert content type string to mail.contentType")
	}

	return nil
}

// Send uses the GoSimpleMailService to dispatch an email with the provided settings
func (g GoSimpleMailService) Send(
	from string,
	toAddresses []string,
	ccAddresses []string,
	subject string,
	contentType string,
	body string,
	opts ...EmailOption,
) error {
	if !g.config.GetEnabled() {
		return nil
	}
	email := mail.NewMSG()
	email.SetFrom(from).
		SetSubject(subject)

	for _, toAddress := range toAddresses {
		email.AddTo(toAddress)
	}

	for _, ccAddress := range ccAddresses {
		email.AddCc(ccAddress)
	}

	var options EmailOptions
	for _, opt := range opts {
		opt(&options)
	}

	if len(options.BccAddresses) > 0 {
		for _, bccAddress := range options.BccAddresses {
			email.AddBcc(bccAddress)
		}
	}

	err := g.setEmailBody(email, contentType, body)
	if err != nil {
		return err
	}

	return g.sendEmail(email)
}

// sendEmail is a GoSimpleMail specific method allowing for dispatching an email using a mail.Email object
func (g GoSimpleMailService) sendEmail(email *mail.Email) error {
	if !g.config.GetEnabled() {
		return nil
	}

	// Before we send the email, we need to check to see if it actually has any recipients and return early if not
	// This is because the go-simple-mail actually returns an error if there are no recipients, but we don't want to treat that as an error
	// and would rather just return early when this happens
	// TODO: It would be nice to have access to a logger/context here so we could logger.Warn() in this case
	if len(email.GetRecipients()) == 0 {
		return nil
	}

	smtpClient, err := g.smtpServer.Connect()
	if err != nil {
		return err
	}

	return email.Send(smtpClient)
}

// GetConfig returns this service's configuration
func (g GoSimpleMailService) GetConfig() EmailServiceConfig {
	return g.config
}
