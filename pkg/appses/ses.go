package appses

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/shared/logging"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
)

// Config is email configs used only for SES
type Config struct {
	SourceARN string
	Source    string
}

// Sender is an implementation for sending email with the SES Go SDK
// It lives in package "email" for now, but can be pulled out and imported
// if necessary for testing
type Sender struct {
	client *ses.SES
	config Config
}

// NewSender constructs a Sender
func NewSender(config Config) Sender {
	sesSession := session.Must(session.NewSession())
	client := ses.New(sesSession)
	return Sender{
		client,
		config,
	}
}

// Send sends an email
func (s Sender) Send(
	ctx context.Context,
	toAddress models.EmailAddress,
	ccAddress *models.EmailAddress,
	subject string,
	body string,
) error {
	ccAddresses := []*string{}
	if ccAddress != nil {
		ccAddresses = append(ccAddresses, aws.String(ccAddress.String()))
	}
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{
				aws.String(toAddress.String()),
			},
			CcAddresses: ccAddresses,
		},
		Message: &ses.Message{
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String(subject),
			},
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(body),
				},
			},
		},
		Source:    aws.String(s.config.Source),
		SourceArn: aws.String(s.config.SourceARN),
	}
	_, err := s.client.SendEmail(input)
	if err == nil {
		logging.ProvideLogger(ctx).Info("Sending email with SES",
			zap.String("To", toAddress.String()),
			zap.String("Subject", subject),
		)
	}
	return err
}
