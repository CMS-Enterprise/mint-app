package resolvers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/services"
)

type ctatNotesTestResolver struct {
	generated.ResolverRoot
	request *models.CTATRequest
}

func (r *ctatNotesTestResolver) Query() generated.QueryResolver {
	return &ctatNotesTestQueryResolver{request: r.request}
}

type ctatNotesTestQueryResolver struct {
	generated.QueryResolver
	request *models.CTATRequest
}

func (r *ctatNotesTestQueryResolver) CtatRequest(_ context.Context, _ uuid.UUID) (*models.CTATRequest, error) {
	return r.request, nil
}

func TestCTATRequestNotesFieldRequiresAssessmentRole(t *testing.T) {
	notes := "Internal CTAT progress notes"
	request := models.NewCTATRequest(uuid.New(), uuid.New())
	request.ID = uuid.New()
	request.Notes = &notes

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
		Resolvers:  &ctatNotesTestResolver{request: request},
		Directives: directives,
	}))
	server.AddTransport(transport.POST{})

	query := `query($id: UUID!) { ctatRequest(id: $id) { id notes } }`
	queryAs := func(principal *authentication.ApplicationPrincipal) *client.Response {
		t.Helper()
		wrapped := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := appcontext.WithLogger(r.Context(), zap.NewNop())
			ctx = appcontext.WithPrincipal(ctx, principal)
			server.ServeHTTP(w, r.WithContext(ctx))
		})
		response, err := client.New(wrapped).RawPost(query, client.Var("id", request.ID.String()))
		if err != nil {
			t.Fatal(err)
		}
		return response
	}

	requesterResponse := queryAs(&authentication.ApplicationPrincipal{JobCodeUSER: true})
	if !strings.Contains(string(requesterResponse.Errors), "not authorized") {
		t.Fatalf("expected notes authorization error, got %s", requesterResponse.Errors)
	}
	if strings.Contains(fmt.Sprint(requesterResponse.Data), notes) {
		t.Fatal("requester response exposed progress notes")
	}

	adminResponse := queryAs(&authentication.ApplicationPrincipal{JobCodeUSER: true, JobCodeASSESSMENT: true})
	if len(adminResponse.Errors) != 0 {
		t.Fatalf("unexpected admin query errors: %s", adminResponse.Errors)
	}
	if !strings.Contains(fmt.Sprint(adminResponse.Data), notes) {
		t.Fatalf("admin response omitted progress notes: %v", adminResponse.Data)
	}
}
