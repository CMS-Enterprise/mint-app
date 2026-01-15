package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func getExecutedIDDOCQuestionnaireCompletedEmail(
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) (string, string, error) {
	subjectContent := email.IDDOCQuestionnaireCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	bodyContent := email.IDDOCQuestionnaireCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompletedByUserCommonName,
		ShowFooter:                      showFooter,
	}

	emailSubject, emailBody, err := email.IDDOCQuestionnaire.Completed.GetContent(subjectContent, bodyContent)
	if err != nil {
		return "", "", err
	}
	return emailSubject, emailBody, nil
}

func SendIDDOCQuestionnaireCompletedEmailNotification(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedIDDOCQuestionnaireCompletedEmail(
		emailService,
		modelPlan,
		markedCompletedByUserCommonName,
		showFooter,
	)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{userEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}

func SendIDDOCQuestionnaireCompletedEmailNotifications(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompletedByUserCommonName string,
	showFooter bool,
) error {
	emailSubject, emailBody, err := getExecutedIDDOCQuestionnaireCompletedEmail(
		emailService,
		modelPlan,
		markedCompletedByUserCommonName,
		showFooter,
	)
	if err != nil {
		return err
	}

	receiverEmails := lo.Map(
		receivers,
		func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
			return pref.Email
		},
	)

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
		return err
	}
	return nil
}
