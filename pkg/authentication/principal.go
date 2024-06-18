package authentication

import (
	"errors"
	"fmt"
)

const anonID = "ANON"

// ANON is functionally a singleton for representing
// a request without an identity
var ANON Principal = (*anonymous)(nil)

// Principal defines the expected behavior for
// an entity that is making requests of the system.
type Principal interface {
	fmt.Stringer

	// ID returns the system identifier
	// for the given Principal
	ID() string

	// AllowUSER says whether this principal
	// is authorized to operate within MINT as a regular user
	AllowUSER() bool

	// AllowASSESSMENT says whether this principal
	// is authorized to operate as part of
	// the Review Team within MINT
	AllowASSESSMENT() bool

	// AllowMAC says whether this principal
	// is authorized to operate within MINT as a MAC user
	AllowMAC() bool

	// AllowNonCMSUser says whether this principal
	// is a NON-CMS user, who should have some limited access
	AllowNonCMSUser() bool

	Account() *UserAccount

	MustAccount() (*UserAccount, error)
}

type anonymous struct{}

// String satisfies the fmt.Stringer interface
func (*anonymous) String() string {
	return "AnonymousPrincipal"
}

// ID returns an identifier that is not
// expected to exist in upstream systems
func (*anonymous) ID() string {
	return anonID
}

// AllowMINT says Anonymous users are
// not explicitly allowed to submit
// info to EASi
func (*anonymous) AllowUSER() bool {
	return false
}

// AllowADMIN says Anonymous users are
// not explicitly ruled in as ADMIN
func (*anonymous) AllowASSESSMENT() bool {
	return false
}

// AllowMAC says whether this principal
// is authorized to operate within MINT as a MAC user
func (*anonymous) AllowMAC() bool {
	return false
}

// AllowNonCMSUser says whether this principal
// is a NON-CMS user, who should have some limited access
func (*anonymous) AllowNonCMSUser() bool {
	return false
}

func (*anonymous) Account() *UserAccount {
	return nil
}

func (*anonymous) MustAccount() (*UserAccount, error) {
	return nil, errors.New("anonymous principal has no user account")
}

// ApplicationPrincipal represents information
// gleaned from the Okta JWT _after_ LaunchDarkly downgrade
// logic has been applied.
type ApplicationPrincipal struct {
	Username          string
	JobCodeUSER       bool
	JobCodeASSESSMENT bool
	JobCodeMAC        bool
	JobCodeNonCMS     bool
	UserAccount       *UserAccount
}

// String satisfies the fmt.Stringer interface
func (p *ApplicationPrincipal) String() string {
	name := p.Username
	if p.UserAccount != nil {
		name = p.UserAccount.CommonName
	}
	return fmt.Sprintf("Application Principal: %s. Name: %s", p.Username, name)
}

// ID returns the EUA ID
// for the given Principal
func (p *ApplicationPrincipal) ID() string {
	return p.Username
}

// AllowUSER says whether this principal
// is authorized to operate within MINT
func (p *ApplicationPrincipal) AllowUSER() bool {
	return p.JobCodeUSER
}

// AllowASSESSMENT says whether this principal
// is authorized to operate as part of
// the Assessment Team within MINT
func (p *ApplicationPrincipal) AllowASSESSMENT() bool {
	return p.JobCodeASSESSMENT
}

// AllowMAC says whether this principal
// is authorized to operate within MINT as a MAC user
func (p *ApplicationPrincipal) AllowMAC() bool {
	return p.JobCodeMAC
}

// AllowNonCMSUser says whether this principal
// is authorized to operate within MINT as a MAC user
func (p *ApplicationPrincipal) AllowNonCMSUser() bool {
	return p.JobCodeNonCMS
}

// Account returns the user account of the context of the user who made the request
func (p *ApplicationPrincipal) Account() *UserAccount {
	return p.UserAccount
}

// MustAccount returns the user account of the context of the user who made the request
// If the account is nil, this will instead return a nil account and an error
func (p *ApplicationPrincipal) MustAccount() (*UserAccount, error) {
	if p.UserAccount == nil {
		return nil, errors.New("application principal has no user account")
	}
	return p.UserAccount, nil
}
