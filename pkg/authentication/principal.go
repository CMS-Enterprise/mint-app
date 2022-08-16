package authentication

import "fmt"

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

// EUAPrincipal represents information
// gleaned from the Okta JWT
type EUAPrincipal struct {
	EUAID             string
	JobCodeUSER       bool
	JobCodeASSESSMENT bool
}

// String satisfies the fmt.Stringer interface
func (p *EUAPrincipal) String() string {
	return fmt.Sprintf("EUAPrincipal: %s", p.EUAID)
}

// ID returns the EUA ID
// for the given Principal
func (p *EUAPrincipal) ID() string {
	return p.EUAID
}

// AllowUSER says whether this principal
// is authorized to operate within MINT
func (p *EUAPrincipal) AllowUSER() bool {
	return p.JobCodeUSER
}

// AllowASSESSMENT says whether this principal
// is authorized to operate as part of
// the Assessment Team within MINT
func (p *EUAPrincipal) AllowASSESSMENT() bool {
	return p.JobCodeASSESSMENT
}
