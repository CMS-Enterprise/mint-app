package resolvers

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// TaggedContentGet returns the tag content of a parent object
func TaggedContentGet(
	logger *zap.Logger,
	store *storage.Store,
	rawContent string, // if desired, we could get this from the database as well
	taggedTable string,
	taggedField string,
	taggedContentID uuid.UUID) (*models.TaggedContent, error) {
	taggedContent, err := models.NewTaggedContentFromString(rawContent)
	if err != nil {
		return nil, err
	}

	tags, err := TagCollectionGet(logger, store, taggedTable, taggedField, taggedContentID)
	if err != nil {
		return nil, err
	}
	taggedContent.Tags = tags

	return &taggedContent, nil

}

// TagCollectionGet retrieves all the tags for a specific entry and table
func TagCollectionGet(
	logger *zap.Logger,
	store *storage.Store,
	taggedTable string,
	taggedField string,
	taggedContentID uuid.UUID) ([]*models.Tag, error) {

	tags, err := store.TagCollectionGetByContentIDAndField(logger, taggedTable, taggedField, taggedContentID)

	return tags, err
}

// TaggedEntityGet returns a Tagged Entity based on the table it refers to as well as the ID
func TaggedEntityGet(
	ctx context.Context,
	store *storage.Store,
	tagType models.TagType,
	EntityUUID *uuid.UUID,
	EntityIntID *int,
) (models.TaggedEntity, error) {
	logger := appcontext.ZLogger(ctx)
	switch tagType {
	case models.TagTypeUserAccount:
		return UserAccountGetByIDLOADER(ctx, *EntityUUID)
	case models.TagTypePossibleSolution:
		return PossibleOperationalSolutionGetByID(logger, store, *EntityIntID)
	default:
		return nil, fmt.Errorf(" no tagged entity configured for table: %s", tagType)
	}

}

// UpdateTaggedHTMLMentionsAndRawContent updates the tagged html with the correct entity ids, and updates the RAW HTMl with the new representation of the mentions
// Both the raw content as well as the the individual mentions are updated as a result of this method
func UpdateTaggedHTMLMentionsAndRawContent(ctx context.Context, store *storage.Store, tHTML *models.TaggedHTMLInput, getAccountInformation userhelpers.GetAccountInfoFunc) error {

	for _, mention := range tHTML.Mentions {
		if mention.EntityDB != nil && mention.EntityDB != "" { // Check if the id is set, if not do logic to get the entity record created in the db / return the entity needed
			continue
		}
		tagType := mention.Type

		// Conditionally set the entity DB by tag type
		switch tagType {
		case models.TagTypeUserAccount:
			isMacUser := false
			collabAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, mention.EntityRaw, false, isMacUser, getAccountInformation)
			if err != nil {
				return fmt.Errorf("unable to get tagged user account reference. error : %w", err)
			}
			mention.EntityUUID = &collabAccount.ID
			mention.EntityDB = mention.EntityUUID

		case models.TagTypePossibleSolution:
			logger := appcontext.ZLogger(ctx)

			sol, err := store.PossibleOperationalSolutionGetByKey(logger, models.OperationalSolutionKey(mention.EntityRaw))
			if err != nil {
				return fmt.Errorf("unable to get tagged possible solution reference. error : %w", err)
			}
			mention.EntityIntID = &sol.ID
			mention.EntityDB = mention.EntityIntID
		default:
			return fmt.Errorf("could not set entity id because the tag type is invalid %s", tagType)
		}

		// Updated the parent Raw content with the new fields
		newHTML, err := mention.ToHTML()
		if err != nil {
			return fmt.Errorf("unable to get transform the HTML mention into a string html representation. error : %w", err)
		}

		// Update the Tagged HTML Raw content by replacing the tags old value, with the new representation
		newTotalRaw := strings.Replace(string(tHTML.RawContent), string(mention.RawHTML), string(newHTML), -1)
		tHTML.RawContent = models.HTML(newTotalRaw)

		mention.RawHTML = newHTML
	}

	return nil
}

// TagCollectionCreate converts an array of mentions, and creates an array in the database for unique tags.
func TagCollectionCreate(logger *zap.Logger, store *storage.Store, principal authentication.Principal,
	taggedField string, taggedTable string, taggedContentID uuid.UUID, mentions []*models.HTMLMention, tx *sqlx.Tx) ([]*models.Tag, *sqlx.Tx, error) {

	tags := models.TagArrayFromHTMLMentions(taggedField, taggedTable, taggedContentID, mentions)

	uniqTags := lo.UniqBy(tags, func(tag *models.Tag) string {

		key := fmt.Sprint(tag.TagType, tag.EntityRaw) //The entity raw, and tag type will be unique.
		return key
	})

	retTags, _, err := store.TagCollectionCreate(logger, uniqTags, principal.Account().ID, tx) // Note, this will fail if any tag is invalid.
	if err != nil {
		return nil, tx, err
	}
	return retTags, tx, nil
	//TODO: EASI-3288 send an email to tagged individuals

}
