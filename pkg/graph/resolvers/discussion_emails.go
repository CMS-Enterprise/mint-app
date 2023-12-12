package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func sendDiscussionReplyOriginatorEmail( //TODO, this is very similar to the test email in the command package, we could reuse
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
		UserName: mostRecentReplyName,
	})
	if err != nil {
		return err
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
	replyUserRole *models.DiscussionUserRole, //TODO this should take other as needed
) error {
	replies, err := DiscussionReplyCollectionByDiscusionIDLOADER(ctx, discussion.ID)
	if err != nil {
		return err
	}

	replyEmails := lo.Map(replies, func(reply *models.DiscussionReply, _ int) email.DiscussionReplyEmailContent {
		return email.DiscussionReplyEmailContent{
			UserName: "TODO UserNeeded",
			Role:     reply.UserRole.Humanize(models.ValueOrEmpty(reply.UserRoleDescription)),
			Content:  reply.Content.RawContent.ToTemplate(),
		}
	})

	errEmail := sendDiscussionReplyOriginatorEmail(
		emailService,
		emailTemplateService,
		addressBook,
		discussion.Content,
		discussion.ID,
		modelPlan.ID,
		modelPlan.ModelName,
		models.ValueOrEmpty(modelPlan.Abbreviation),
		replyUser.CommonName, // TODO: role should be the person who made the original discussion, not the reply user
		reply.UserRole.Humanize(models.ValueOrEmpty(reply.UserRoleDescription)),
		replyUser.Email, // TODO this is the wrong email
		replyUser.CommonName,
		replyEmails,
	)
	if errEmail != nil {
		return errEmail
	}

	return nil
}
