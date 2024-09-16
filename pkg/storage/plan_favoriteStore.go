package storage

import (
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	_ "embed"
)

// PlanFavoriteCreate creates and returns a plan favorite object
func (s *Store) PlanFavoriteCreate(np sqlutils.NamedPreparer, logger *zap.Logger, favorite models.PlanFavorite) (*models.PlanFavorite, error) {

	if favorite.ID == uuid.Nil {
		favorite.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.PlanFavorite.Create) // TODO: Look to refactor this SQL to make it clearer
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create plan favorite with error %s", err),
			zap.String("user", favorite.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

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
func (s *Store) PlanFavoriteDelete(
	_ *zap.Logger,
	userAccountID uuid.UUID,
	planID uuid.UUID,
	deletedByUserID uuid.UUID,
) (*models.PlanFavorite, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, deletedByUserID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(sqlqueries.PlanFavorite.Delete)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"user_id":       userAccountID,
		"model_plan_id": planID,
	}

	delFavorite := models.PlanFavorite{}
	err = stmt.Get(&delFavorite, arg)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit plan favorite delete transaction: %w", err)
	}
	return &delFavorite, nil
}

// PlanFavoriteGetByModelIDAndUserAccountID returns a plan favorite
func (s *Store) PlanFavoriteGetByModelIDAndUserAccountID(
	_ *zap.Logger,
	userAccountID uuid.UUID,
	modelPlanID uuid.UUID,
) (*models.PlanFavorite, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanFavorite.Get)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

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

	var userIDs []uuid.UUID

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanFavorite.GetUniqueUserIDs)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{}

	err = stmt.Select(&userIDs, arg)
	if err != nil {
		return nil, err
	}

	return userIDs, nil
}

// PlanFavoriteGetCollectionByUserID returns plan favorites by userID
func PlanFavoriteGetCollectionByUserID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	userAccountID uuid.UUID,
) ([]*models.PlanFavorite, error) {

	var planFavorites []*models.PlanFavorite

	stmt, err := np.PrepareNamed(sqlqueries.PlanFavorite.GetCollectionByUserID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"user_id": userAccountID,
	}

	err = stmt.Select(&planFavorites, arg)
	if err != nil {
		return nil, err
	}

	return planFavorites, nil
}
