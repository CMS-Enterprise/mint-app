package notifications

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// activityCreate creates a new activity in the database.
func activityCreate(_ context.Context, np sqlutils.NamedPreparer, activity *models.Activity) (*models.Activity, error) {
	// All activities need to call the specific resolver, this is the resolver simply to create the DB record and the notifications

	retActivity, err := dbStore.activity.Create(np, activity)
	if err != nil {
		return nil, err
	}
	return retActivity, nil

}

// ActivityGetByIDLoaderThunk is the method called by the data loader to batch
func ActivityGetByIDLoaderThunk(_ context.Context, np sqlutils.NamedPreparer, paramTableJSON string, orderedKeys []string) []*dataloader.Result {

	activities, err := dbStore.activity.GetByIDLoader(np, paramTableJSON)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	activitiesByID := lo.Associate(activities, func(a *models.Activity) (string, *models.Activity) {
		return a.ID.String(), a
	})
	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(orderedKeys))
	for index, key := range orderedKeys {
		activity, ok := activitiesByID[key]
		if ok {
			// PARSE the meta data
			meta, err := parseRawActivityMetaData(activity.ActivityType, activity.MetaDataRaw)
			if err != nil {
				err = fmt.Errorf("issue converting activity meta data to discrete type: %w", err)
				output[index] = &dataloader.Result{Data: nil, Error: err}
			}
			activity.MetaData = meta

			output[index] = &dataloader.Result{Data: activity, Error: nil}

		} else {
			err := fmt.Errorf("activity  not found for id %s", key)
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}

	}
	return output

}

// parseRawActivityMetaData conditionally parses meta data from JSON to a specific meta data type
func parseRawActivityMetaData(activityType models.ActivityType, rawMetaDataJSON interface{}) (models.ActivityMetaData, error) {
	//Future Enhancement: can this be genericized instead of switching on activity type?

	var rawData []byte

	// Check if rawMetaDataJSON is already a string
	if str, ok := rawMetaDataJSON.(string); ok {
		// Convert string to byte array
		rawData = []byte(str)
	} else if bytes, ok := rawMetaDataJSON.([]byte); ok {
		// Use byte array directly
		rawData = bytes
	} else {
		// Invalid type, return an error
		return nil, fmt.Errorf("unsupported type for activityData: %T", rawMetaDataJSON)
	}

	switch activityType {
	case models.ActivityTaggedInDiscussion:
		// Deserialize the raw JSON into TaggedInPlanDiscussionActivityMeta
		meta := models.TaggedInPlanDiscussionActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil

	case models.ActivityTaggedInDiscussionReply:
		// Deserialize the raw JSON into TaggedInDiscussionReplyActivityMeta
		meta := models.TaggedInDiscussionReplyActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {

			return nil, err
		}
		return &meta, nil

	case models.ActivityDigest:
		// Deserialize the raw JSON into TaggedInDiscussionReplyActivityMeta
		meta := models.DailyDigestCompleteActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil

	case models.ActivityNewDiscussionReply:
		// Deserialize the raw JSON into NewDiscussionReplyActivityMeta
		meta := models.NewDiscussionRepliedActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil
	case models.ActivityAddedAsCollaborator:
		// Deserialize the raw JSON into AddedAsCollaboratorMeta
		meta := models.AddedAsCollaboratorMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {

			return nil, err
		}
		return &meta, nil

	case models.ActivityModelPlanShared:
		// Deserialize the raw JSON into ModelPlanSharedActivityMeta
		meta := models.ModelPlanSharedActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil

	case models.ActivityNewModelPlan:
		// Deserialize the raw JSON into NewModelPlanActivityMeta
		meta := models.NewModelPlanActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
			return nil, err
		}
		return &meta, nil

	default:
		// Return a default implementation or handle unsupported types
		return nil, fmt.Errorf("unsupported activity type: %s", activityType)
	}

}
