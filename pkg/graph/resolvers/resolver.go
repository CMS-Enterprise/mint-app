package resolvers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/shared/pubsub"

	ldclient "github.com/launchdarkly/go-server-sdk/v6"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/s3"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is a resolver.
type Resolver struct {
	store                *storage.Store
	service              ResolverService
	s3Client             *s3.S3Client
	emailService         oddmail.EmailService
	emailTemplateService email.TemplateService
	addressBook          email.AddressBook
	ldClient             *ldclient.LDClient
	pubsub               pubsub.PubSub
}

// ResolverService holds service methods for use in resolvers
type ResolverService struct {
	FetchUserInfo func(context.Context, string) (*models.UserInfo, error)
	SearchByName  func(context.Context, string) ([]*models.UserInfo, error)
}

// NewResolver constructs a resolver
func NewResolver(
	store *storage.Store,
	service ResolverService,
	s3Client *s3.S3Client,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	ldClient *ldclient.LDClient,
	pubsub pubsub.PubSub,
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
	}
}
