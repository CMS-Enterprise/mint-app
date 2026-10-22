package resolvers

import (
	"context"
	"fmt"
	"html/template"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/sanitization"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ModelFollowerUpdateSend sanitizes the content of a message, records it as an activity and sends it
// as an in-app notification and an email to everyone following the model plan.
// Only members of the model team can send a message. A failure to send the email does not fail the mutation.
func ModelFollowerUpdateSend(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	content string,
) (*model.ModelFollowerUpdate, error) {
	err := accesscontrol.ErrorIfNotCollaborator(models.NewModelPlanRelation(modelPlanID), logger, principal, store)
	if err != nil {
		return nil, err
	}

	sanitizedContent := sanitization.SanitizeHTML(content)
	if strings.TrimSpace(sanitization.InnerHTML(sanitizedContent)) == "" {
		return nil, fmt.Errorf("content must not be empty")
	}

	modelPlan, err := storage.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	// TODO(MINT-3910): honor a dedicated notification preference for model follower updates
	followers, err := storage.UserAccountGetFollowersForModelFollowerUpdate(store, modelPlanID)
	if err != nil {
		return nil, err
	}
	// until MINT-3910 adds a preference, every follower receives both the in-app notification and the email
	recipients := lo.Map(followers, func(follower *authentication.UserAccount, _ int) *models.UserAccountAndNotificationPreferences {
		return &models.UserAccountAndNotificationPreferences{
			UserAccount: *follower,
			PreferenceFlags: models.UserNotificationPreferenceFlags{
				models.UserNotificationPreferenceInApp,
				models.UserNotificationPreferenceEmail,
			},
		}
	})

	activity, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.Activity, error) {
		return notifications.ActivityModelFollowerUpdateCreate(
			ctx,
			principal.Account().ID,
			tx,
			recipients,
			modelPlanID,
			sanitizedContent,
		)
	})
	if err != nil {
		return nil, err
	}

	trySendModelFollowerUpdateEmail(logger, emailService, addressBook, modelPlan, principal, recipients, sanitizedContent)

	return &model.ModelFollowerUpdate{
		ID:                   activity.ID,
		ModelPlanID:          modelPlanID,
		Content:              sanitizedContent,
		CreatedBy:            principal.Account().ID,
		CreatedByUserAccount: *principal.Account(),
		CreatedDts:           activity.CreatedDts,
	}, nil
}

// trySendModelFollowerUpdateEmail sends one email to all recipients in BCC. Failures are logged, not returned.
func trySendModelFollowerUpdateEmail(
	logger *zap.Logger,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	principal authentication.Principal,
	recipients []*models.UserAccountAndNotificationPreferences,
	sanitizedContent string,
) {
	if emailService == nil {
		return
	}

	emailRecipients, _ := models.FilterNotificationPreferences(recipients)
	emails := lo.FilterMap(emailRecipients, func(recipient *models.UserAccountAndNotificationPreferences, _ int) (string, bool) {
		return recipient.Email, recipient.Email != ""
	})
	if len(emails) == 0 {
		return
	}

	emailSubject, emailBody, err := email.ModelFollowerUpdate.Send.GetContent(
		email.ModelFollowerUpdateSubjectContent{
			ModelName: modelPlan.ModelName,
		},
		email.ModelFollowerUpdateBodyContent{
			ClientAddress: emailService.GetConfig().GetClientAddress(),
			ModelID:       modelPlan.ID.String(),
			ModelName:     modelPlan.ModelName,
			SenderName:    principal.Account().CommonName,
			Content:       template.HTML(sanitizedContent), //nolint:gosec // content is sanitized by sanitization.SanitizeHTML
		},
	)
	if err != nil {
		logger.Error("failed to build model follower update email notification", zap.Error(err))
		return
	}

	go func() {
		err := emailService.Send(
			addressBook.DefaultSender,
			nil,
			nil,
			emailSubject,
			"text/html",
			emailBody,
			oddmail.WithBCC(emails),
		)
		if err != nil {
			logger.Error("failed to send model follower update email notification", zap.Error(err))
		}
	}()
}
