package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
)

// NDAAgreementGetByUserID returns an NDA based on a UserID
func (s *Store) NDAAgreementGetByUserID(_ *zap.Logger, userID uuid.UUID) (*models.NDAAgreement, error) {

	nda := models.NDAAgreement{}

	stmt, err := s.db.PrepareNamed(sqlqueries.NDAAgreement.GetByUserID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"user_id": userID,
	}

	err = stmt.Get(&nda, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &nda, nil
}

// NDAAgreementUpdate updates an nda agreement based on userID
func (s *Store) NDAAgreementUpdate(_ *zap.Logger, nda *models.NDAAgreement) (*models.NDAAgreement, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.NDAAgreement.Update)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(nda, nda)
	if err != nil {
		return nil, err
	}

	return nda, nil
}

// NDAAgreementCreate creates a new nda agreement based on an EUA
func (s *Store) NDAAgreementCreate(_ *zap.Logger, nda *models.NDAAgreement) (*models.NDAAgreement, error) {

	nda.ID = utilityuuid.ValueOrNewUUID(nda.ID)

	stmt, err := s.db.PrepareNamed(sqlqueries.NDAAgreement.Insert)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(nda, &nda)
	if err != nil {
		return nil, err
	}

	return nda, nil

}
