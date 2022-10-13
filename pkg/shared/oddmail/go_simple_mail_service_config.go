package oddmail

import (
	"crypto/tls"
	"io/ioutil"
	"path/filepath"
	"time"

	"gopkg.in/yaml.v3"

	mail "github.com/xhit/go-simple-mail/v2"
)

// GoSimpleMailServiceConfig is a configuration structure to define the behavior of a GoSimpleMailService
type GoSimpleMailServiceConfig struct {
	Helo           string          `yaml:"helo"`
	Host           string          `yaml:"host"`
	ClientAddress  string          `yaml:"clientAddress"`
	Port           int             `yaml:"port"`
	Authentication mail.AuthType   `yaml:"authentication"`
	DefaultSender  string          `yaml:"defaultSender"`
	Username       string          `yaml:"username"`
	Password       string          `yaml:"password"`
	Encryption     mail.Encryption `yaml:"encryption"`
	ConnectTimeout time.Duration   `yaml:"connectTimeout"`
	SendTimeout    time.Duration   `yaml:"sendTimeout"`
	KeepAlive      bool            `yaml:"keepAlive"`
	TLSConfig      *tls.Config
}

// GetHelo returns the Helo configuration
func (g *GoSimpleMailServiceConfig) GetHelo() string {
	return g.Helo
}

// GetHost returns the Host configuration
func (g *GoSimpleMailServiceConfig) GetHost() string {
	return g.Host
}

// GetHostName returns the HostName configuration
func (g *GoSimpleMailServiceConfig) GetHostName() string {
	return g.Host
}

// GetClientAddress returns the ClientAddress configuration
func (g *GoSimpleMailServiceConfig) GetClientAddress() string {
	return g.ClientAddress
}

// GetPort returns Port configuration
func (g *GoSimpleMailServiceConfig) GetPort() int {
	return g.Port
}

// GetAuthentication returns the Authentication configuration
func (g *GoSimpleMailServiceConfig) GetAuthentication() mail.AuthType {
	return g.Authentication
}

// GetDefaultSender returns the DefaultSender configuration
func (g *GoSimpleMailServiceConfig) GetDefaultSender() string {
	return g.DefaultSender
}

// GetUsername returns the Username configuration
func (g *GoSimpleMailServiceConfig) GetUsername() string {
	return g.Username
}

// GetPassword returns the Password configuration
func (g *GoSimpleMailServiceConfig) GetPassword() string {
	return g.Password
}

// GetEncryption returns the Encryption configuration
func (g *GoSimpleMailServiceConfig) GetEncryption() mail.Encryption {
	return g.Encryption
}

// GetConnectTimeout returns the ConnectTimeout configuration
func (g *GoSimpleMailServiceConfig) GetConnectTimeout() time.Duration {
	return g.ConnectTimeout
}

// GetSendTimeout returns the SendTimeout configuration
func (g *GoSimpleMailServiceConfig) GetSendTimeout() time.Duration {
	return g.SendTimeout
}

// GetKeepAlive returns the KeepAlive configuration
func (g *GoSimpleMailServiceConfig) GetKeepAlive() bool {
	return g.KeepAlive
}

// GetTLSConfig returns the TLSConfig configuration
func (g *GoSimpleMailServiceConfig) GetTLSConfig() *tls.Config {
	return g.TLSConfig
}

// LoadYAML loads configuration from a YAML file
func (g *GoSimpleMailServiceConfig) LoadYAML(filePath string) error {
	yamlFile, err := ioutil.ReadFile(filepath.Clean(filePath))
	if err != nil {
		return err
	}

	var loadConfig GoSimpleMailServiceConfig
	err = yaml.Unmarshal(yamlFile, &loadConfig)
	if err != nil {
		return err
	}

	*g = loadConfig

	return nil
}
