package testGoSimpleMailService

import (
	"crypto/tls"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func TestGoSimpleMailService_MockSend(t *testing.T) {
	emailService := setupGoSimpleMailServiceTest(t)
	fromAddress := "mint-test@cms.gov"
	toAddresses := []string{"user@test.com"}
	var ccAddresses []string
	subject := "Test Subject 2"
	contentType := "text/html"
	body := "Test Email"

	err := emailService.Send(fromAddress, toAddresses, ccAddresses, subject, contentType, body)
	assert.NoError(t, err)
}

func TestGoSimpleMailService_LoadConfigFromFile(t *testing.T) {
	config := loadTestMailServiceConfigFromFile(t)

	assert.Equal(t, "127.0.0.1", config.Host)
	assert.Equal(t, 1025, config.Port)
}

func loadTestMailServiceConfigFromFile(t *testing.T) oddmail.GoSimpleMailServiceConfig {
	var mailServiceConfig oddmail.GoSimpleMailServiceConfig

	filePath, err := filepath.Abs("../../../../config/test/emailServiceConfig.yaml")
	assert.NoError(t, err)

	err = mailServiceConfig.LoadYAML(filePath)
	assert.NoError(t, err)

	//nolint:gosec
	mailServiceConfig.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	return mailServiceConfig
}

func setupGoSimpleMailServiceTest(t *testing.T) *oddmail.GoSimpleMailService {
	//mockController := gomock.NewController(t)

	mailServiceConfig := loadTestMailServiceConfigFromFile(t)

	emailService, err := oddmail.NewGoSimpleMailService(mailServiceConfig)
	assert.NoError(t, err)

	return emailService
}
