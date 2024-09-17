package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func sendDiscussionReplyOriginatorEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	DiscussionContent models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlanID uuid.UUID,
	modelPlanName string,
	modelPlanAbbreviation string,
	originatorName string,
	originatorRole string,
	originatorEmail string,
	mostRecentReplyName string,
	replies []email.DiscussionReplyEmailContent,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.DiscussionReplyCreatedOriginatorTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DiscussionReplyCreatedOriginatorSubject{
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
	})
	if err != nil {
		return err
	}
	replyCount := len(replies)
	if replyCount > 2 {
		replies = replies[:2] // only retain the first two replies
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DiscussionReplyCreatedOriginatorBody{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		DiscussionContent: DiscussionContent.RawContent.ToTemplate(),
		ModelID:           modelPlanID.String(),
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
		OriginatorName:    originatorName,
		OriginatorRole:    originatorRole,
		Replies:           replies,
		ReplyCount:        replyCount,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{originatorEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}

	return nil

}

func sendDiscussionReplyEmails(ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	discussion *models.PlanDiscussion,
	reply *models.DiscussionReply,
	modelPlan *models.ModelPlan,
	replyUser *authentication.UserAccount,
) error {

	discUser, err := UserAccountGetByIDLOADER(ctx, discussion.CreatedBy)
	if err != nil {
		return err
	}
	// Get the email details from the db
	replyDetails, err := store.GetDiscussionReplyDetailsForEmail(discussion.ID)
	if err != nil {
		return err
	}

	// convert the DB reply to the email type we need
	replyEmails := email.DiscussionRepliesEmailContentDBToEmailForm(replyDetails)

	errEmail := sendDiscussionReplyOriginatorEmail(
		emailService,
		emailTemplateService,
		addressBook,
		discussion.Content,
		discussion.ID,
		modelPlan.ID,
		modelPlan.ModelName,
		models.ValueOrEmpty(modelPlan.Abbreviation),
		discUser.CommonName,
		discussion.UserRole.Humanize(models.ValueOrEmpty(discussion.UserRoleDescription)),
		discUser.Email,
		replyUser.CommonName,
		replyEmails,
	)
	if errEmail != nil {
		return errEmail
	}

	return nil
}
