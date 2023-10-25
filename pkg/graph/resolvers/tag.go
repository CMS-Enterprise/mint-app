package resolvers

import (
	"context"
	"fmt"
	"strconv"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/net/html"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

// TaggedHTMLGet returns the tag content of a parent object
func TaggedHTMLGet( //TODO: SW rename
	logger *zap.Logger,
	store *storage.Store,
	rawContent string, //TODO, if we want, we could get this from the database as well
	taggedTable string,
	taggedField string,
	taggedContentID uuid.UUID) (*models.TaggedHTML, error) {
	taggedHTML, err := models.NewTaggedHTMLFromString(rawContent)
	if err != nil {
		return nil, err
	}

	tags, err := TagCollectionGet(logger, store, taggedTable, taggedField, taggedContentID)
	if err != nil {
		return nil, err
	}
	taggedHTML.Tags = tags

	return &taggedHTML, nil

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

// CreateOrGetTagEntityID updates the tagged html with the correct entity ids, and returns an array of tags to store in the database.
func CreateOrGetTagEntityID(ctx context.Context, store *storage.Store, tHTML models.TaggedHTML, taggedField string, taggedTable string, taggedContentID uuid.UUID, getAccountInformation userhelpers.GetAccountInfoFunc) ([]*models.Tag, error) {

	//TODO remove TagArrayFromHTMLMentions
	tags := []*models.Tag{}
	for _, mention := range tHTML.Mentions {
		tagType := mention.Type
		entityIDStr := mention.EntityRaw
		// TODO: SW update to check if the id is set, if not do logic to get the entity record created in the db / return the entity needed
		switch tagType { //TODO: Solution is an int id, user is a UUID
		case models.TagTypeUserAccount:
			isMacUser := false
			collabAccount, err := userhelpers.GetOrCreateUserAccount(ctx, store, mention.EntityRaw, false, isMacUser, getAccountInformation)
			if err != nil {
				return nil, err
			}
			mention.EntityUUID = &collabAccount.ID
			dataIDDBAttribute := html.Attribute{Key: "data-id-db", Val: mention.EntityUUID.String()}
			mention.RawHTML.Attr = append(mention.RawHTML.Attr, dataIDDBAttribute) //TODO: SW, this won't actually work because it isn't a pointer
			// mention.RawHTML. // TODO: SW add the attribute
		case models.TagTypePossibleSolution:
			//TODO: SW do we want to actually check for the possible solution, or just assume here?
			number, err := strconv.Atoi(entityIDStr)
			if err != nil {
				return nil, fmt.Errorf("error setting possible solution ID for mention %w", err)
			}
			mention.EntityIntID = &number
		default:
			return nil, fmt.Errorf("could not set entity id because the tag type is invalid %s", tagType)
		}
		//TODO:
		/*
			1. Get the reference to the correct entity in the database
			2. Add the data-id-db attribute to the tag
			3. Store the old raw value of the tag, do a string replace with the old value and the new value
			    a. any considerations if the tag is in there twice and identical? Hopefully we would not need to do the action twice
			4. Return the updated tHTML, store the tags on it as well so they can be saved separately


		*/

		tag := mention.ToTag(taggedField, taggedTable, taggedContentID)
		tags = append(tags, &tag)

	}
	// return tags

	return tags, nil
}
