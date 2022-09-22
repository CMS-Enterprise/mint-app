package testGoSimpleMailService

import (
	"crypto/tls"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func TestGoSimpleMailService_LoadConfigFromFile(t *testing.T) {
	config := loadTestMailServiceConfigFromFile(t)

	assert.Equal(t, "127.0.0.1", config.Host)
	assert.Equal(t, 1030, config.Port)
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
