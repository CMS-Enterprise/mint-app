package testhelpers

import (
	"context"

	"github.com/99designs/gqlgen/client"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// NewRequesterPrincipal returns what represents an MINT user
// that is NOT empowered as a Reviewer
func NewRequesterPrincipal() authentication.Principal {
	return &authentication.ApplicationPrincipal{Username: "REQ", JobCodeUSER: true, JobCodeASSESSMENT: false}
}

// NewReviewerPrincipal returns what represents an MINT user
// that is empowered as a member of the ADMIN.
func NewReviewerPrincipal() authentication.Principal {
	return &authentication.ApplicationPrincipal{Username: "REV", JobCodeUSER: true, JobCodeASSESSMENT: true}
}

// AddAuthPrincipalToGraphQLClientTest returns a function to add an auth principal to a graphql client test
func AddAuthPrincipalToGraphQLClientTest(principal authentication.ApplicationPrincipal) func(*client.Request) {
	return func(request *client.Request) {
		ctx := appcontext.WithPrincipal(context.Background(), &principal)
		request.HTTP = request.HTTP.WithContext(ctx)
	}
}

// AddAuthWithAllJobCodesToGraphQLClientTest adds authentication for all job codes
func AddAuthWithAllJobCodesToGraphQLClientTest(euaID string) func(*client.Request) {
	return AddAuthPrincipalToGraphQLClientTest(authentication.ApplicationPrincipal{
		Username:          euaID,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
	})
}
