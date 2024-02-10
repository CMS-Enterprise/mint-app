package oddmail

import (
	"crypto/tls"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"
)

// GoSimpleMailServiceConfig is a configuration structure to define the behavior of a GoSimpleMailService
type GoSimpleMailServiceConfig struct {
	Enabled               bool
	Helo                  string
	Host                  string
	ClientAddress         string
	Port                  int
	Authentication        mail.AuthType
	Username              string
	Password              string
	Encryption            mail.Encryption
	ConnectTimeout        time.Duration
	SendTimeout           time.Duration
	KeepAlive             bool
	TLSConfig             *tls.Config
	TaggedPOCEmailEnabled bool // this determines if a solution point of contact gets an email sent to them if they are tagged
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

// GetEnabled returns the Enabled configuration
func (g *GoSimpleMailServiceConfig) GetEnabled() bool {
	return g.Enabled
}

// GetSendTaggedPOCEmails returns the boolean configuration of if the app should send emails to tagged solution points of contacts
func (g *GoSimpleMailServiceConfig) GetSendTaggedPOCEmails() bool {
	return g.TaggedPOCEmailEnabled
}
