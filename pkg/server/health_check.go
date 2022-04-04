package server

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/shared/appcontext"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
)

// CheckEmailClient sends a email to test it is configured properly
// this method will panic on failures
func (s Server) CheckEmailClient(client email.Client) {
	s.logger.Info("Testing email client")
	err := client.SendTestEmail(appcontext.ProvideWithLogger(context.Background(), s.logger))
	if err != nil {
		s.logger.Fatal("Failed to send test email", zap.Error(err))
	}
}
