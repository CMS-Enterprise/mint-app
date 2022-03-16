package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateAccessibilityRequest adds a new accessibility request in the database
func (s *Store) CreateAccessibilityRequest(ctx context.Context, request *models.AccessibilityRequest) (*models.AccessibilityRequest, error) {
	if request.ID == uuid.Nil {
		request.ID = uuid.New()
	}
	createAt := s.clock.Now()
	if request.CreatedAt == nil {
		request.CreatedAt = &createAt
	}
	if request.UpdatedAt == nil {
		request.UpdatedAt = &createAt
	}
	const createRequestSQL = `
		INSERT INTO accessibility_requests (
			id,
			name,
			intake_id,
			created_at,
			updated_at,
			eua_user_id,
			cedar_system_id
		)
		VALUES (
			:id,
			:name,
			:intake_id,
		    :created_at,
			:updated_at,
			:eua_user_id,
			:cedar_system_id
		)`
	_, err := s.db.NamedExec(
		createRequestSQL,
		request,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create accessibility request", zap.Error(err))
		return nil, err
	}
	return s.FetchAccessibilityRequestByID(ctx, request.ID)
}

// FetchAccessibilityRequestByID queries the DB for an accessibility matching the given ID
func (s *Store) FetchAccessibilityRequestByID(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	request := models.AccessibilityRequest{}

	err := s.db.Get(&request, `SELECT * FROM accessibility_requests WHERE id=$1 AND deleted_at IS NULL`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.AccessibilityRequest{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &request, nil
}

// FetchAccessibilityRequestByIDIncludingDeleted queries the DB for an accessibility matching the given ID
func (s *Store) FetchAccessibilityRequestByIDIncludingDeleted(ctx context.Context, id uuid.UUID) (*models.AccessibilityRequest, error) {
	request := models.AccessibilityRequest{}

	err := s.db.Get(&request, `SELECT * FROM accessibility_requests WHERE id=$1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.AccessibilityRequest{}}
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility request", zap.Error(err), zap.String("id", id.String()))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &request, nil
}

// FetchAccessibilityRequests queries the DB for accessibility requests.
// TODO implement cursor pagination
func (s *Store) FetchAccessibilityRequests(ctx context.Context) ([]models.AccessibilityRequest, error) {
	requests := []models.AccessibilityRequest{}

	err := s.db.Select(&requests, `SELECT * FROM accessibility_requests WHERE deleted_at IS NULL`)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return requests, nil
		}
		appcontext.ZLogger(ctx).Error("Failed to fetch accessibility requests", zap.Error(err))
		return nil, &apperrors.QueryError{
			Err:       err,
			Operation: apperrors.QueryFetch,
		}
	}

	return requests, nil
}

// DeleteAccessibilityRequest marks an accessibility request as deleted
func (s *Store) DeleteAccessibilityRequest(_ context.Context, id uuid.UUID, reason models.AccessibilityRequestDeletionReason) error {
	const archiveAccessibilityRequestSQL = `UPDATE accessibility_requests
		SET deleted_at = $1, deletion_reason = $2
		WHERE id = $3
`
	_, err := s.db.Exec(archiveAccessibilityRequestSQL, time.Now().UTC(), reason, id)
	return err
}

// CreateAccessibilityRequestAndInitialStatusRecord creates the new request and sets the status to OPEN
func (s *Store) CreateAccessibilityRequestAndInitialStatusRecord(ctx context.Context, request *models.AccessibilityRequest) (*models.AccessibilityRequest, error) {
	createdRequest, err := s.CreateAccessibilityRequest(ctx, request)
	if err != nil {
		return nil, err
	}

	_, err = s.CreateAccessibilityRequestStatusRecord(ctx, &models.AccessibilityRequestStatusRecord{
		RequestID: createdRequest.ID,
		Status:    models.AccessibilityRequestStatusOpen,
		EUAUserID: createdRequest.EUAUserID,
		CreatedAt: createdRequest.CreatedAt,
	})
	if err != nil {
		return nil, err
	}

	return createdRequest, nil
}
