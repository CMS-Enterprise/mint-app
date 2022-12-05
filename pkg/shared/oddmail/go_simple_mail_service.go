package oddmail

import (
	"errors"
	"fmt"

	mail "github.com/xhit/go-simple-mail/v2"
)

// GoSimpleMailService is an EmailService implementation for the GoSimpleMail library
type GoSimpleMailService struct {
	smtpServer *mail.SMTPServer
	smtpClient *mail.SMTPClient
	config     EmailServiceConfig
}

// NewGoSimpleMailService is a constructor for GoSimpleMailService
func NewGoSimpleMailService(config GoSimpleMailServiceConfig) (*GoSimpleMailService, error) {
	if !config.GetEnabled() {
		return &GoSimpleMailService{
			smtpServer: nil,
			smtpClient: nil,
			config:     &config,
		}, nil
	}

	oldServer := &mail.SMTPServer{
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
	fmt.Printf("%+v\n", oldServer)

	fmt.Println("NewGoSimpleMailService() - HOST - ", config.Host)
	fmt.Println("NewGoSimpleMailService() - PORT - ", config.Port)
	// smtpServer := &mail.SMTPServer{
	// 	Host: config.Host,
	// 	Port: config.Port,
	// }
	smtpServer := &mail.SMTPServer{
		Host: "internal-Enterpris-SMTPProd-I20YLD1GTM6L-357506541.us-east-1.elb.amazonaws.com",
		Port: 25,
	}

	smtpClient, err := smtpServer.Connect()
	if err != nil {
		return nil, err
	}

	return &GoSimpleMailService{
		smtpServer: smtpServer,
		smtpClient: smtpClient,
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
func (g GoSimpleMailService) Send(from string, toAddresses []string, ccAddresses []string, subject string, contentType string, body string) error {
	if !g.config.GetEnabled() {
		return nil
	}
	fmt.Println("Creating new message")
	email := mail.NewMSG()
	fmt.Println("Setting from", from)
	fmt.Println("Setting subject", subject)
	email.SetFrom(from).
		SetSubject(subject)

	fmt.Println("To addresses", toAddresses)
	for _, toAddress := range toAddresses {
		email.AddTo(toAddress)
	}

	fmt.Println("CC addresses", ccAddresses)
	for _, ccAddress := range ccAddresses {
		email.AddCc(ccAddress)
	}

	fmt.Println("Set email body", body)
	err := g.setEmailBody(email, contentType, body)
	fmt.Println("ERR", err)
	if err != nil {
		return err
	}

	return g.SendEmail(email)
}

// SendEmail is a GoSimpleMail specific method allowing for dispatching an email using a mail.Email object
func (g GoSimpleMailService) SendEmail(email *mail.Email) error {
	if !g.config.GetEnabled() {
		return nil
	}
	return email.Send(g.smtpClient)
}

// GetConfig returns this service's configuration
func (g GoSimpleMailService) GetConfig() EmailServiceConfig {
	return g.config
}
