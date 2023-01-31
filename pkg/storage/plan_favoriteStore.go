package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/plan_favorite/create.sql
var planFavoriteCreateSQL string

//go:embed SQL/plan_favorite/delete.sql
var planFavoriteDeleteSQL string

//go:embed SQL/plan_favorite/get.sql
var planFavoriteGetSQL string

//go:embed SQL/plan_favorite/get_collection_by_user_id.sql
var planFavoriteGetCollectionByUserIDSQL string

//go:embed SQL/plan_favorite/get_unique_user_id.sql
var planFavoriteGetUniqueUserIDsSQL string

// PlanFavoriteCreate creates and returns a plan favorite object
func (s *Store) PlanFavoriteCreate(logger *zap.Logger, favorite models.PlanFavorite) (*models.PlanFavorite, error) {

	if favorite.ID == uuid.Nil {
		favorite.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(planFavoriteCreateSQL) //TODO, look to refactor this SQL to make it clearer

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create plan favorite with error %s", err),
			zap.String("user", favorite.CreatedBy.String()),
		)
		return nil, err
	}
	retFavorite := models.PlanFavorite{}
	err = stmt.Get(&retFavorite, favorite)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create plan favorite with error %s", err),
			zap.String("user", favorite.CreatedBy.String()),
		)
		return nil, err

	}

	return &retFavorite, nil
}

// PlanFavoriteDelete deletes a plan favorite
func (s *Store) PlanFavoriteDelete(logger *zap.Logger, userAccountID uuid.UUID, planID uuid.UUID) (*models.PlanFavorite, error) {
	stmt, err := s.db.PrepareNamed(planFavoriteDeleteSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id":       userAccountID,
		"model_plan_id": planID,
	}
	delFavorite := models.PlanFavorite{}
	err = stmt.Get(&delFavorite, arg)
	if err != nil {
		return nil, err
	}

	return &delFavorite, nil
}

// PlanFavoriteGetByModelIDAndUserAccountID returns a plan favorite
func (s *Store) PlanFavoriteGetByModelIDAndUserAccountID(logger *zap.Logger, userAccountID uuid.UUID, modelPlanID uuid.UUID) (*models.PlanFavorite, error) {
	stmt, err := s.db.PrepareNamed(planFavoriteGetSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id":       userAccountID,
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

// PlanFavoriteCollectionGetUniqueUserIDs returns userIDs of users that have favorited any model
func (s *Store) PlanFavoriteCollectionGetUniqueUserIDs() ([]uuid.UUID, error) {

	userIDs := []uuid.UUID{}
	stmt, err := s.db.PrepareNamed(planFavoriteGetUniqueUserIDsSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{}

	err = stmt.Select(&userIDs, arg)

	if err != nil {
		return nil, err
	}

	return userIDs, nil
}

// PlanFavoriteGetCollectionByUserID returns plan favorites by userID
func (s *Store) PlanFavoriteGetCollectionByUserID(logger *zap.Logger, userAccountID uuid.UUID) ([]*models.PlanFavorite, error) {

	planFavorites := []*models.PlanFavorite{}
	stmt, err := s.db.PrepareNamed(planFavoriteGetCollectionByUserIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id": userAccountID,
	}

	err = stmt.Select(&planFavorites, arg)

	if err != nil {
		return nil, err
	}

	return planFavorites, nil
}
