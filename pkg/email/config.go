package email

var hostName = "mint.cms.gov"

// SetHostName sets the server's host name
func SetHostName(host string) {
	hostName = host
}

// GetHostName retrieves the server's host name
func GetHostName() string {
	return hostName
}

// DefaultSender is the default address used for sending emails
const DefaultSender string = "no-reply@mint.cms.gov"
