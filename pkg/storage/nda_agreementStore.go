package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
)

//go:embed SQL/nda_agreement_get_by_euaid.sql
var ndaAgreementGetByEUAIDSQL string

//go:embed SQL/nda_agreement_update.sql
var ndaAgreementUpdateSQL string

//go:embed SQL/nda_agreement_insert.sql
var ndaAgreementInsertSQL string

// NDAAgreementGetByUserID returns an NDA based on a UserID
func (s *Store) NDAAgreementGetByUserID(logger *zap.Logger, userID uuid.UUID) (*models.NDAAgreement, error) {
	nda := models.NDAAgreement{}

	statement, err := s.db.PrepareNamed(ndaAgreementGetByEUAIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"user_id": userID,
	}

	err = statement.Get(&nda, arg)

	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return &nda, nil
}

// NDAAgreementUpdate updates an nda agreement based on userID
func (s *Store) NDAAgreementUpdate(logger *zap.Logger, nda *models.NDAAgreement) (*models.NDAAgreement, error) {

	statement, err := s.db.PrepareNamed(ndaAgreementUpdateSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(nda, nda)
	if err != nil {
		return nil, err
	}

	return nda, nil

}

// NDAAgreementCreate creates a new nda agreement based on an EUA
func (s *Store) NDAAgreementCreate(logger *zap.Logger, nda *models.NDAAgreement) (*models.NDAAgreement, error) {

	nda.ID = utilityUUID.ValueOrNewUUID(nda.ID)

	statement, err := s.db.PrepareNamed(ndaAgreementInsertSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(nda, &nda)
	if err != nil {
		return nil, err
	}

	return nda, nil

}
