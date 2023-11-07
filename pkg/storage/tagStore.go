package storage

import (
	_ "embed"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/tag/create.sql
var tagCreateSQL string

//go:embed SQL/tag/create_collection.sql
var tagCreateCollectionSQL string

//go:embed SQL/tag/get_by_table_field_and_content_id.sql
var tagGetByTableFieldAndContentIDSQL string

// TagCreate writes a new tage to the database
func (s *Store) TagCreate(
	logger *zap.Logger,
	tag *models.Tag,
) (*models.Tag, error) {
	tag.ID = utilityUUID.ValueOrNewUUID(tag.ID)

	stmt, err := s.db.PrepareNamed(tagCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, tag)
	}
	defer stmt.Close()

	retTag := &models.Tag{}
	err = stmt.Get(retTag, tag)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, retTag)
	}

	return retTag, nil
}

// TagCollectionCreate creates an array of tags in the database based on the tag contet provided in the string
// the method is expected to be part of a larger transaction and does not handle  committing or rollingback the transactions
// if the *sqlx.Tx is nil, this function will create one. The returned tx is the same as the one in the parameters.
func (s *Store) TagCollectionCreate(_ *zap.Logger, tags []*models.Tag, createdBy uuid.UUID, tx *sqlx.Tx) ([]*models.Tag, *sqlx.Tx, error) {
	if tx == nil {
		tx = s.db.MustBegin()
	}

	retTags := []*models.Tag{}
	stmt, sErr := tx.PrepareNamed(tagCreateCollectionSQL)
	if sErr != nil {
		return nil, tx, sErr
	}
	defer stmt.Close()

	mapSlice := []map[string]interface{}{}
	for _, tag := range tags {
		tag.ID = utilityUUID.ValueOrNewUUID(tag.ID) //Note, there are helper functions to do most of this, but converting manually let's us set ID and created by here as well.
		tag.CreatedBy = createdBy
		tMap, err := models.StructToMap(*tag)
		if err != nil {
			return nil, tx, fmt.Errorf(" issue creating tags: error: %w", err)
		}
		mapSlice = append(mapSlice, tMap)
	}

	jsonTag, err := models.MapArrayToJSONArray(mapSlice)
	if err != nil {
		return nil, tx, fmt.Errorf(" error converting tagArray to json: %w", err)
	}

	arg := map[string]interface{}{
		"paramTableJSON": jsonTag,
	}
	err = stmt.Select(&retTags, arg)
	if err != nil {
		return nil, tx, err
	}
	return retTags, tx, nil

}

// TagCollectionGetByContentIDAndField returns relevant tags for specific table and field
func (s *Store) TagCollectionGetByContentIDAndField(_ *zap.Logger, taggedTable string, taggedField string, taggedContentID uuid.UUID) ([]*models.Tag, error) {

	var tags []*models.Tag

	stmt, err := s.db.PrepareNamed(tagGetByTableFieldAndContentIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"tagged_content_table": taggedTable,
		"tagged_field":         taggedField,
		"tagged_content_id":    taggedContentID,
	}

	err = stmt.Select(&tags, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return tags, nil
}
