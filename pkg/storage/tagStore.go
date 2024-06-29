package storage

import (
	_ "embed"
	"fmt"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

// TagCreate writes a new tage to the database
func (s *Store) TagCreate(
	logger *zap.Logger,
	tag *models.Tag,
) (*models.Tag, error) {
	tag.ID = utilityUUID.ValueOrNewUUID(tag.ID)

	stmt, err := s.db.PrepareNamed(sqlqueries.Tag.Create)
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

// TagCollectionCreate creates an array of tags in the database based on the tag context provided in the string
// the method is expected to be part of a larger transaction and does not handle  committing or rolling back the transactions
func TagCollectionCreate(np sqlutils.NamedPreparer, _ *zap.Logger, tags []*models.Tag, createdBy uuid.UUID) ([]*models.Tag, error) {

	retTags := []*models.Tag{}
	stmt, sErr := np.PrepareNamed(sqlqueries.Tag.CreateCollection)
	if sErr != nil {
		return nil, sErr
	}
	defer stmt.Close()

	mapSlice := []map[string]interface{}{}
	for _, tag := range tags {
		tag.ID = utilityUUID.ValueOrNewUUID(tag.ID) //Note, there are helper functions to do most of this, but converting manually let's us set ID and created by here as well.
		tag.CreatedBy = createdBy
		tMap, err := models.StructToMap(*tag)
		if err != nil {
			return nil, fmt.Errorf(" issue creating tags: error: %w", err)
		}
		mapSlice = append(mapSlice, tMap)
	}

	jsonTag, err := models.MapArrayToJSONArray(mapSlice)
	if err != nil {
		return nil, fmt.Errorf(" error converting tagArray to json: %w", err)
	}

	arg := map[string]interface{}{
		"paramTableJSON": jsonTag,
	}
	err = stmt.Select(&retTags, arg)
	if err != nil {
		return nil, err
	}
	return retTags, nil

}

// TagCollectionGetByContentIDAndField returns relevant tags for specific table and field
func (s *Store) TagCollectionGetByContentIDAndField(_ *zap.Logger, taggedTable string, taggedField string, taggedContentID uuid.UUID) ([]*models.Tag, error) {

	var tags []*models.Tag

	stmt, err := s.db.PrepareNamed(sqlqueries.Tag.GetByTableFieldAndContent)
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
