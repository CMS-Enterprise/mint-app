package local

import (
	"context"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
)

// NewSender returns a fake email sender
func NewSender() Sender {
	return Sender{}
}

// Sender is a mock email sender for local environments
type Sender struct {
}

// Send logs an email
func (s Sender) Send(ctx context.Context, toAddress string, ccAddress string, subject string, body string) error {
	appcontext.ZLogger(ctx).Info("Mock sending email",
		zap.String("To", toAddress),
		zap.String("CC", ccAddress),
		zap.String("Subject", subject),
		zap.String("Body", body),
	)
	return nil
}
