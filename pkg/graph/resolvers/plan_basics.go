package resolvers

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// UpdatePlanBasics implements resolver logic to update a plan basics object
func UpdatePlanBasics(
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
) (*models.PlanBasics, error) {
	// Get existing basics
	existing, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(logger, existing.ModelPlanID)
	if err != nil {
		return nil, err
	}

	if emailService != nil &&
		emailTemplateService != nil &&
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		go func() {
			err = processChangedDates(
				logger,
				existing,
				emailService,
				emailTemplateService,
				addressBook,
				modelPlan,
				changes,
			)

			if err != nil {
				logger.Error("Error processing changed dates",
					zap.Error(err),
					zap.String("modelPlanID", modelPlan.ID.String()),
				)
			}
		}()
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retBasics, err := store.PlanBasicsUpdate(logger, existing)
	return retBasics, err
}

func processChangedDates(
	logger *zap.Logger,
	existing *models.PlanBasics,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	changes map[string]interface{},
) error {
	dp, err := NewDateProcessor(changes, existing)
	if err != nil {
		return err
	}

	dateChanges, err := dp.ExtractChangedDates()
	print("len dateChanges: ", len(dateChanges))
	if err != nil {
		return err
	}

	if len(dateChanges) == 0 {
		return nil
	}

	err = sendDateChangedEmails(
		emailService,
		emailTemplateService,
		addressBook,
		modelPlan,
		dateChanges,
		dp,
	)
	if err != nil {
		logger.Error("Failed to send email notification", zap.Error(err))
		return err
	}

	return nil
}

func sendDateChangedEmails(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	dateChanges map[string]email.DateChange,
	dateProcessor *DateProcessor,
) error {
	if emailService == nil || emailTemplateService == nil || dateProcessor == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanDateChangedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanDateChangedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	dateChangeSlice := make([]email.DateChange, 0, len(dateChanges))
	for _, v := range dateChanges {
		dateChangeSlice = append(dateChangeSlice, v)
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
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

// PlanBasicsGetByModelPlanIDLOADER implements resolver logic to get plan basics by a model plan ID using a data loader
func PlanBasicsGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	allLoaders := loaders.Loaders(ctx)
	basicsLoader := allLoaders.BasicsLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	//TODO do we need to write a new interface to convert our types to what we need?
	thunk := basicsLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanBasics), nil
}
