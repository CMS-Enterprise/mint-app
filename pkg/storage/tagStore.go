package storage

import (
	_ "embed"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/tag/create.sql
var tagCreateSQL string

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
func (s *Store) TagCollectionCreate(logger *zap.Logger, tags []*models.Tag, createdBy uuid.UUID) ([]*models.Tag, error) {
	//TODO: SW create a tag collection using a CTE instead of iteration through list
	retTags := []*models.Tag{}
	errs := []*error{}

	for _, tag := range tags {
		tag.CreatedBy = createdBy
		retTag, err := s.TagCreate(logger, tag)
		if err != nil {
			errs = append(errs, &err)
			continue
		}
		retTags = append(retTags, retTag)

	}
	if len(errs) > 0 {
		return retTags, fmt.Errorf(" issue creating tags: first error: %w", *errs[0])
		//TODO: revisit error handling here
	}
	return retTags, nil

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
