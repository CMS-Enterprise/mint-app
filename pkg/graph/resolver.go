package graph

import (
	"context"
	"time"

	"github.com/opensearch-project/opensearch-go/v2"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/shared/pubsub"

	ldclient "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"

	"github.com/google/uuid"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store                *storage.Store
	service              ResolverService
	s3Client             *upload.S3Client
	emailService         oddmail.EmailService
	emailTemplateService email.TemplateService
	addressBook          email.AddressBook
	ldClient             *ldclient.LDClient
	pubsub               pubsub.PubSub
	searchClient         *opensearch.Client
}

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	CreateActionUpdateStatus      func(context.Context, uuid.UUID, bool) error
	CreateActionExtendLifecycleID func(context.Context, uuid.UUID, *time.Time, *string, string, *string) error
	IssueLifecycleID              func(context.Context) error
	FetchUserInfo                 func(context.Context, string) (*models.UserInfo, error)
	SearchByName                  func(context.Context, string) ([]*models.UserInfo, error)
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	service ResolverService,
	s3Client *upload.S3Client,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	ldClient *ldclient.LDClient,
	pubsub pubsub.PubSub,
	osClient *opensearch.Client,
) *Resolver {
	return &Resolver{
		store:                store,
		service:              service,
		s3Client:             s3Client,
		emailService:         emailService,
		emailTemplateService: emailTemplateService,
		addressBook:          addressBook,
		ldClient:             ldClient,
		pubsub:               pubsub,
		searchClient:         osClient,
	}
}
