package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/graph/generated"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// UpdateUserNotificationPreferences is the resolver for the updateUserNotificationPreferences field.
func (r *mutationResolver) UpdateUserNotificationPreferences(ctx context.Context, changes map[string]any) (*models.UserNotificationPreferences, error) {
	principal := appcontext.Principal(ctx)
	logger := appcontext.ZLogger(ctx)

	return UserNotificationPreferencesUpdate(ctx, logger, principal, r.store, changes)
}

// DailyDigestComplete is the resolver for the dailyDigestComplete field.
func (r *userNotificationPreferencesResolver) DailyDigestComplete(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.DailyDigestComplete, nil
}

// AddedAsCollaborator is the resolver for the addedAsCollaborator field.
func (r *userNotificationPreferencesResolver) AddedAsCollaborator(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.AddedAsCollaborator, nil
}

// TaggedInDiscussion is the resolver for the taggedInDiscussion field.
func (r *userNotificationPreferencesResolver) TaggedInDiscussion(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.TaggedInDiscussion, nil
}

// TaggedInDiscussionReply is the resolver for the taggedInDiscussionReply field.
func (r *userNotificationPreferencesResolver) TaggedInDiscussionReply(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.TaggedInDiscussionReply, nil
}

// NewDiscussionReply is the resolver for the newDiscussionReply field.
func (r *userNotificationPreferencesResolver) NewDiscussionReply(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.NewDiscussionReply, nil
}

// ModelPlanShared is the resolver for the modelPlanShared field.
func (r *userNotificationPreferencesResolver) ModelPlanShared(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.ModelPlanShared, nil
}

// NewModelPlan is the resolver for the newModelPlan field.
func (r *userNotificationPreferencesResolver) NewModelPlan(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.NewModelPlan, nil
}

// DatesChanged is the resolver for the datesChanged field.
func (r *userNotificationPreferencesResolver) DatesChanged(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.DatesChanged, nil
}

// DataExchangeApproachMarkedComplete is the resolver for the dataExchangeApproachMarkedComplete field.
func (r *userNotificationPreferencesResolver) DataExchangeApproachMarkedComplete(ctx context.Context, obj *models.UserNotificationPreferences) ([]models.UserNotificationPreferenceFlag, error) {
	return obj.DataExchangeApproachMarkedComplete, nil
}

// UserNotificationPreferences returns generated.UserNotificationPreferencesResolver implementation.
func (r *Resolver) UserNotificationPreferences() generated.UserNotificationPreferencesResolver {
	return &userNotificationPreferencesResolver{r}
}

type userNotificationPreferencesResolver struct{ *Resolver }
