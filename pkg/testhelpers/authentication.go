package testhelpers

import (
	"context"

	"github.com/99designs/gqlgen/client"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// NewRequesterPrincipal returns what represents an MINT user
// that is NOT empowered as a Reviewer
func NewRequesterPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REQ", JobCodeMINT: true, JobCodeADMIN: false}
}

// NewReviewerPrincipal returns what represents an MINT user
// that is empowered as a member of the ADMIN.
func NewReviewerPrincipal() authentication.Principal {
	return &authentication.EUAPrincipal{EUAID: "REV", JobCodeMINT: true, JobCodeADMIN: true}
}

// AddAuthPrincipalToGraphQLClientTest returns a function to add an auth principal to a graphql client test
func AddAuthPrincipalToGraphQLClientTest(principal authentication.EUAPrincipal) func(*client.Request) {
	return func(request *client.Request) {
		ctx := appcontext.WithPrincipal(context.Background(), &principal)
		request.HTTP = request.HTTP.WithContext(ctx)
	}
}

// AddAuthWithAllJobCodesToGraphQLClientTest adds authentication for all job codes
func AddAuthWithAllJobCodesToGraphQLClientTest(euaID string) func(*client.Request) {
	return AddAuthPrincipalToGraphQLClientTest(authentication.EUAPrincipal{
		EUAID:        euaID,
		JobCodeMINT:  true,
		JobCodeADMIN: true,
	})
}
