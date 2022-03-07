package storage

import (
	"context"
	"database/sql"
	"errors"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateCedarSystemBookmark creates a new cedar system bookmark object in the database
func (s *Store) CreateCedarSystemBookmark(ctx context.Context, cedarSystemBookmark *models.CedarSystemBookmark) (*models.CedarSystemBookmark, error) {
	euaUserID := appcontext.Principal(ctx).ID()
	createAt := s.clock.Now().UTC()

	cedarSystemBookmark.CreatedAt = &createAt
	cedarSystemBookmark.EUAUserID = euaUserID
	const createCedarSystemBookmarkSQL = `
		INSERT INTO cedar_system_bookmarks (
			eua_user_id,
			cedar_system_id,
			created_at
		)
		VALUES (
			:eua_user_id,
			:cedar_system_id,
			:created_at
		) ON CONFLICT ON CONSTRAINT cedar_system_bookmarks_pkey DO UPDATE SET created_at = :created_at`
	_, err := s.db.NamedExecContext(
		ctx,
		createCedarSystemBookmarkSQL,
		cedarSystemBookmark,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to create cedar system bookmark with error %s", zap.Error(err))
		return nil, err
	}
	return cedarSystemBookmark, nil
}

// FetchCedarSystemBookmarks queries the DB for all the cedar system bookmarks matching the given user's EUA ID
func (s *Store) FetchCedarSystemBookmarks(ctx context.Context) ([]*models.CedarSystemBookmark, error) {
	results := []*models.CedarSystemBookmark{}

	euaUserID := appcontext.Principal(ctx).ID()
	err := s.db.SelectContext(ctx, &results, `SELECT * FROM cedar_system_bookmarks WHERE eua_user_id=$1`, euaUserID)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		appcontext.ZLogger(ctx).Error("Failed to fetch cedar system bookmarks", zap.Error(err), zap.String("id", euaUserID))
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.CedarSystemBookmark{},
			Operation: apperrors.QueryFetch,
		}
	}
	return results, nil
}

// DeleteCedarSystemBookmark deletes an existing cedar system bookmark object in the database
func (s *Store) DeleteCedarSystemBookmark(ctx context.Context, cedarSystemBookmark *models.CedarSystemBookmark) (*models.CedarSystemBookmark, error) {
	euaUserID := appcontext.Principal(ctx).ID()

	const deleteCedarSystemBookmarkSQL = `
		DELETE FROM cedar_system_bookmarks
		WHERE eua_user_id = $1
		AND cedar_system_id = $2;`

	_, err := s.db.Exec(deleteCedarSystemBookmarkSQL, euaUserID, cedarSystemBookmark.CedarSystemID)

	if err != nil {
		appcontext.ZLogger(ctx).Error("Failed to delete cedar system bookmark with error %s", zap.Error(err))
		return nil, err
	}

	return cedarSystemBookmark, nil
}
