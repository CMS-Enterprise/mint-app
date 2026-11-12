package resolvers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/services"
)

func (suite *ResolverSuite) TestCTATDiscussionGraphQLRequiresAllowedRole() {
	requester := *suite.testConfigs.Principal
	requester.JobCodeASSESSMENT = false
	requester.JobCodeUSER = true
	noRole := requester
	noRole.JobCodeUSER = false

	ticket := suite.createTestCTATRequest(
		requester.Account().ID,
		time.Now().Add(24*time.Hour),
		"Discussion directive test",
		[]models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI},
		models.CTATStatusNew,
	)

	directives := generated.DirectiveRoot{
		HasRole: func(ctx context.Context, _ interface{}, next graphql.Resolver, role model.Role) (interface{}, error) {
			allowed, err := services.HasRole(ctx, role)
			if err != nil || !allowed {
				return nil, fmt.Errorf("not authorized")
			}
			return next(ctx)
		},
		HasAnyRole: func(ctx context.Context, _ interface{}, next graphql.Resolver, roles []model.Role) (interface{}, error) {
			allowed, err := services.HasAnyRole(ctx, roles)
			if err != nil || !allowed {
				return nil, fmt.Errorf("not authorized")
			}
			return next(ctx)
		},
	}
	server := handler.New(generated.NewExecutableSchema(generated.Config{
		Resolvers:  &Resolver{store: suite.testConfigs.Store},
		Directives: directives,
	}))
	server.AddTransport(transport.POST{})

	postAs := func(principal *authentication.ApplicationPrincipal, operation, variable string, value interface{}) *client.Response {
		suite.T().Helper()
		wrapped := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := appcontext.WithPrincipal(suite.testConfigs.Context, principal)
			server.ServeHTTP(w, r.WithContext(ctx))
		})
		response, err := client.New(wrapped).RawPost(operation, client.Var(variable, value))
		suite.Require().NoError(err)
		return response
	}

	content := "Requester discussion visible through GraphQL"
	mutation := `mutation($input: CTATDiscussionInput!) { createDiscussion(input: $input) { id content posterRole } }`
	input := map[string]interface{}{"ticketID": ticket.ID.String(), "content": content}

	deniedMutation := postAs(&noRole, mutation, "input", input)
	suite.Contains(string(deniedMutation.Errors), "not authorized")
	suite.NotContains(fmt.Sprint(deniedMutation.Data), content)

	allowedMutation := postAs(&requester, mutation, "input", input)
	suite.Empty(allowedMutation.Errors)
	suite.Contains(fmt.Sprint(allowedMutation.Data), content)
	suite.Contains(fmt.Sprint(allowedMutation.Data), "REQUESTER")

	query := `query($ticketID: UUID!) { discussions(ticketID: $ticketID) { id content posterRole } }`
	deniedQuery := postAs(&noRole, query, "ticketID", ticket.ID.String())
	suite.Contains(string(deniedQuery.Errors), "not authorized")
	suite.NotContains(fmt.Sprint(deniedQuery.Data), content)

	allowedQuery := postAs(&requester, query, "ticketID", ticket.ID.String())
	suite.Empty(allowedQuery.Errors)
	suite.Contains(fmt.Sprint(allowedQuery.Data), content)
}
