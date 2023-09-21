package dbseed

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
)

// Seeder  is a struct which wraps configurations needed to seed data in the database
type Seeder struct {
	Config SeederConfig
}

func NewSeeder(config SeederConfig) *Seeder {
	return &Seeder{
		Config: config,
	}
}

// SeederConfig represents configuration a Seeder uses to seed data in the db
type SeederConfig struct {
	Store    *storage.Store
	Logger   *zap.Logger
	S3Client *upload.S3Client
	Context  context.Context
}
