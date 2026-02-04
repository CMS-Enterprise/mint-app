package models

import (
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type RelationCheckFunc func(logger *zap.Logger, principalID uuid.UUID, objID uuid.UUID) (bool, error)
