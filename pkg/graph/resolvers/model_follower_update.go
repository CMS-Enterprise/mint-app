package resolvers

import (
	"context"
	"fmt"
	htmlPackage "html"
	"html/template"
	"strings"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/sanitization"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ModelFollowerUpdateSend saves an update message about a model plan and sends it to everyone following it.
// Followers receive an in-app notification and, if they have opted in, an email.
func ModelFollowerUpdateSend(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	content string,
) (*models.ModelFollowerUpdate, error) {
	sanitizedContent := sanitization.SanitizeHTML(content)
	if strings.TrimSpace(htmlPackage.UnescapeString(sanitization.InnerHTML(sanitizedContent))) == "" {
		return nil, fmt.Errorf("model follower update message content cannot be empty")
	}

	modelPlan, err := ModelPlanGetByIDLOADER(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	senderID := principal.Account().ID

	followerUpdate, err := storage.ModelFollowerUpdateCreate(
		store,
		models.NewModelFollowerUpdate(senderID, modelPlanID, sanitizedContent),
	)
	if err != nil {
		return nil, err
	}

	recipients, err := storage.UserAccountGetNotificationPreferencesForModelFollowerUpdate(store, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("failed to get followers for model follower update: %w", err)
	}

	recipients = lo.Filter(recipients, func(recipient *models.UserAccountAndNotificationPreferences, _ int) bool {
		return recipient.ID != senderID
	})

	emailRecipients, inAppRecipients := models.FilterNotificationPreferences(recipients)

	_, err = notifications.ActivityModelFollowerUpdateCreate(
		ctx,
		senderID,
		store,
		inAppRecipients,
		modelPlanID,
		sanitizedContent,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create model follower update activity: %w", err)
	}

	if emailService == nil || len(emailRecipients) == 0 {
		return followerUpdate, nil
	}

	emailSubject, emailBody, err := getExecutedModelFollowerUpdateEmail(ctx, emailService, modelPlan, sanitizedContent)
	if err != nil {
		return nil, err
	}

	receiverEmails := lo.Map(emailRecipients, func(recipient *models.UserAccountAndNotificationPreferences, _ int) string {
		return recipient.Email
	})

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{},
		nil,
		emailSubject,
		"text/html",
		emailBody,
		oddmail.WithBCC(receiverEmails),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to send model follower update email: %w", err)
	}

	return followerUpdate, nil
}

func getExecutedModelFollowerUpdateEmail(
	ctx context.Context,
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	sanitizedContent string,
) (string, string, error) {
	planBasics, err := PlanBasicsGetByModelPlanIDLOADER(ctx, modelPlan.ID)
	if err != nil {
		return "", "", err
	}

	var modelCategories []string
	if planBasics.ModelCategory != nil {
		modelCategories = append(modelCategories, models.ModelCategoryHumanized[*planBasics.ModelCategory])
	}
	for _, category := range planBasics.AdditionalModelCategories {
		modelCategories = append(modelCategories, models.ModelCategoryHumanized[models.ModelCategory(category)])
	}

	lastModified := modelPlan.CreatedDts
	if modelPlan.ModifiedDts != nil {
		lastModified = *modelPlan.ModifiedDts
	}

	planCollaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(ctx, modelPlan.ID)
	if err != nil {
		return "", "", fmt.Errorf("failed to get plan collaborators: %w", err)
	}

	var modelLeads []string
	for _, collaborator := range planCollaborators {
		if !lo.Contains(collaborator.TeamRoles, string(models.TeamRoleModelLead)) {
			continue
		}
		collabAccount, accountErr := collaborator.UserAccount(ctx)
		if accountErr != nil {
			return "", "", fmt.Errorf("failed to get model lead user account for model follower update: %w", accountErr)
		}
		modelLeads = append(modelLeads, collabAccount.CommonName)
	}

	subjectContent := email.ModelFollowerUpdateSubjectContent{
		ModelShortName: modelPlan.Abbreviation,
	}
	bodyContent := email.ModelFollowerUpdateBodyContent{
		ClientAddress:    emailService.GetConfig().GetClientAddress(),
		ModelID:          modelPlan.ID.String(),
		ModelName:        modelPlan.ModelName,
		ModelShortName:   modelPlan.Abbreviation,
		ModelCategories:  modelCategories,
		ModelStatus:      models.ModelStatusHumanized[modelPlan.Status],
		ModelLastUpdated: lastModified,
		ModelLeads:       modelLeads,
		Content:          template.HTML(sanitizedContent), //nolint:gosec // the content is sanitized before it is passed here
	}

	return email.ModelPlan.FollowerUpdate.GetContent(subjectContent, bodyContent)
}
