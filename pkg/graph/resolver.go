package graph

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/shared/storage"
	"github.com/cmsgov/mint-app/pkg/shared/upload"
	"time"

	ldclient "gopkg.in/launchdarkly/go-server-sdk.v5"

	cedarcore "github.com/cmsgov/mint-app/pkg/cedar/core"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store           *storage.Store
	service         ResolverService
	s3Client        *upload.S3Client
	emailClient     *email.Client
	ldClient        *ldclient.LDClient
	cedarCoreClient *cedarcore.Client
}

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	CreateActionUpdateStatus      func(context.Context, uuid.UUID, bool) error
	CreateActionExtendLifecycleID func(context.Context, uuid.UUID, *time.Time, *string, string, *string) error
	IssueLifecycleID              func(context.Context) error
	FetchUserInfo                 func(context.Context, string) (*models.UserInfo, error)
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	service ResolverService,
	s3Client *upload.S3Client,
	emailClient *email.Client,
	ldClient *ldclient.LDClient,
	cedarCoreClient *cedarcore.Client,
) *Resolver {
	return &Resolver{store: store, service: service, s3Client: s3Client, emailClient: emailClient, ldClient: ldClient, cedarCoreClient: cedarCoreClient}
}
