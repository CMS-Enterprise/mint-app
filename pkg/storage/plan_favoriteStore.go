package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/plan_favorite_create.sql
var planFavoriteCreateSQL string

//go:embed SQL/plan_favorite_delete.sql
var planFavoriteDeleteSQL string

//go:embed SQL/plan_favorite_collection_by_user.sql
var planFavoriteCollectionByUserSQL string

//go:embed SQL/plan_favorite_get.sql
var planFavoriteGetSQL string

//PlanFavoriteCollectionByUser returns a list of model plans for a given EUA ID (TODO: Make this go by collaborators, not by createdBy)
func (s *Store) PlanFavoriteCollectionByUser(logger *zap.Logger, EUAID string, archived bool) ([]*models.PlanFavorite, error) {
	favorites := []*models.PlanFavorite{}

	stmt, err := s.db.PrepareNamed(planFavoriteCollectionByUserSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id": EUAID,
	}

	err = stmt.Select(&favorites, arg)

	if err != nil {
		logger.Error(
			"Failed to fetch plan favorites",
			zap.Error(err),
			zap.String("user_id", EUAID),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     EUAID,
			Operation: apperrors.QueryFetch,
		}
	}

	return favorites, nil
}

//PlanFavoriteCreate creates and returns a plan favorite object
func (s *Store) PlanFavoriteCreate(logger *zap.Logger, favorite models.PlanFavorite) (*models.PlanFavorite, error) {

	if favorite.ID == uuid.Nil {
		favorite.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(planFavoriteCreateSQL)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create plan favorite with error %s", err),
			zap.String("user", favorite.CreatedBy),
		)
		return nil, err
	}
	retFavorite := models.PlanFavorite{}
	err = stmt.Get(&retFavorite, favorite)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create plan with error %s", err),
			zap.String("user", favorite.CreatedBy),
		)
		return nil, err

	}

	return &retFavorite, nil
}

//PlanFavoriteDelete deletes a plan favorite
func (s *Store) PlanFavoriteDelete(logger *zap.Logger, EUAID string, planID uuid.UUID) (*models.PlanFavorite, error) {
	stmt, err := s.db.PrepareNamed(planFavoriteDeleteSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id":       EUAID,
		"model_plan_id": planID,
	}
	delFavorite := models.PlanFavorite{}
	err = stmt.Get(&delFavorite, arg)
	if err != nil {
		return nil, err
	}

	return &delFavorite, nil
}

//PlanFavoriteGet returns a plan favorite
func (s *Store) PlanFavoriteGet(logger *zap.Logger, EUAID string, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {
	stmt, err := s.db.PrepareNamed(planFavoriteGetSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id":       EUAID,
		"model_plan_id": modelPlanID,
	}
	retFavorite := models.PlanFavorite{}
	err = stmt.Get(&retFavorite, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &retFavorite, nil
}
