package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/model_plan_favorite_create.sql
var modelPlanFavoriteCreateSQL string

//go:embed SQL/model_plan_favorite_delete.sql
var modelPlanFavoriteDeleteSQL string

//go:embed SQL/model_plan_favorite_collection_by_user.sql
var modelPlanFavoriteCollectionByUserSQL string

//PlanFavoriteCollectionByUser returns a list of model plans for a given EUA ID (TODO: Make this go by collaborators, not by createdBy)
func (s *Store) PlanFavoriteCollectionByUser(logger *zap.Logger, EUAID string, archived bool) ([]*models.PlanFavorite, error) {
	favorites := []*models.PlanFavorite{}

	stmt, err := s.db.PrepareNamed(modelPlanFavoriteCollectionByUserSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"euaID": EUAID,
	}

	err = stmt.Select(&favorites, arg)

	if err != nil {
		logger.Error(
			"Failed to fetch model plan favorites",
			zap.Error(err),
			zap.String("euaID", EUAID),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     EUAID,
			Operation: apperrors.QueryFetch,
		}
	}

	return favorites, nil
}

//PlanFavoriteCreate creates and returns a modelPlan favorite object
func (s *Store) PlanFavoriteCreate(logger *zap.Logger, favorite models.PlanFavorite) (*models.PlanFavorite, error) {

	if favorite.ID == uuid.Nil {
		favorite.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(modelPlanFavoriteCreateSQL)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan favorite with error %s", err),
			zap.String("user", favorite.CreatedBy),
		)
		return nil, err
	}
	retFavorite := models.PlanFavorite{}
	err = stmt.Get(&retFavorite, favorite)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", favorite.CreatedBy),
		)
		return nil, err

	}

	return &retFavorite, nil
}

//PlanFavoriteDelete deletes a model plan favorite
func (s *Store) PlanFavoriteDelete(logger *zap.Logger, EUAID string, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {
	stmt, err := s.db.PrepareNamed(modelPlanFavoriteDeleteSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"euaID":       EUAID,
		"modelPlanId": modelPlanID,
	}
	delFavorite := models.PlanFavorite{}
	err = stmt.Get(&delFavorite, arg)
	if err != nil {
		return nil, err
	}

	return &delFavorite, nil
}
