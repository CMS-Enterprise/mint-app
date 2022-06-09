package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (r *modelPlanResolver) CmsCenters(ctx context.Context, obj *models.ModelPlan) ([]models.CMSCenter, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var cmsCenters []models.CMSCenter

	for _, item := range obj.CMSCenters {
		cmsCenters = append(cmsCenters, models.CMSCenter(item))
	}

	return cmsCenters, nil
}

func (r *modelPlanResolver) CmmiGroups(ctx context.Context, obj *models.ModelPlan) ([]model.CMMIGroup, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var cmmiGroups []model.CMMIGroup

	for _, item := range obj.CMMIGroups {
		cmmiGroups = append(cmmiGroups, model.CMMIGroup(item))
	}

	return cmmiGroups, nil
}

func (r *modelPlanResolver) Basics(ctx context.Context, obj *models.ModelPlan) (*models.PlanBasics, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.PlanBasicsGetByModelPlanID(logger, &principal, obj.ID, r.store)
}

func (r *modelPlanResolver) Milestones(ctx context.Context, obj *models.ModelPlan) (*models.PlanMilestones, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.FetchPlanMilestonesByModelPlanID(logger, &principal, obj.ID, r.store)
}

func (r *modelPlanResolver) GeneralCharacteristics(ctx context.Context, obj *models.ModelPlan) (*models.PlanGeneralCharacteristics, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(logger, principal, obj.ID, r.store)
}

func (r *modelPlanResolver) ProvidersAndParticipants(ctx context.Context, obj *models.ModelPlan) (*models.PlanParticipantsAndProviders, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.PlanParticipantsAndProvidersGetByModelPlanID(logger, principal, obj.ID, r.store)
}

func (r *modelPlanResolver) Beneficiaries(ctx context.Context, obj *models.ModelPlan) (*models.PlanBeneficiaries, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.PlanBeneficiariesGetByModelPlanID(logger, principal, obj.ID, r.store)
}

func (r *modelPlanResolver) OpsEvalAndLearning(ctx context.Context, obj *models.ModelPlan) (*models.PlanOpsEvalAndLearning, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanOpsEvalAndLearningGetByModelPlanID(logger, obj.ID, r.store)
}

func (r *modelPlanResolver) Collaborators(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanCollaborator, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	collaborators, err := resolvers.FetchCollaboratorsByModelPlanID(logger, &principal, obj.ID, r.store)

	return collaborators, err
}

func (r *modelPlanResolver) Documents(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanDocument, error) {
	logger := appcontext.ZLogger(ctx)

	documents, err := resolvers.PlanDocumentsReadByModelPlanID(logger, obj.ID, r.store, r.s3Client)
	return documents, err
}

func (r *modelPlanResolver) Discussions(ctx context.Context, obj *models.ModelPlan) ([]*models.PlanDiscussion, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDiscussionCollectionByModelPlanID(logger, obj.ID, r.store)
}

func (r *mutationResolver) CreateModelPlan(ctx context.Context, modelName string) (*models.ModelPlan, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()
	principalInfo, err := r.service.FetchUserInfo(ctx, principal)
	if err != nil { //if can't get user info, use EUAID as commonName
		tempPrincipalInfo := models.UserInfo{
			EuaUserID:  principal,
			CommonName: principal,
		}
		principalInfo = &tempPrincipalInfo
	}

	return resolvers.ModelPlanCreate(logger, modelName, r.store, principalInfo)
}

func (r *mutationResolver) UpdateModelPlan(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.ModelPlan, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.ModelPlanUpdate(logger, id, changes, &principal, r.store)
}

func (r *mutationResolver) CreatePlanCollaborator(ctx context.Context, input model.PlanCollaboratorCreateInput) (*models.PlanCollaborator, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanCollaborator(logger, &input, principal, r.store)
}

func (r *mutationResolver) UpdatePlanCollaborator(ctx context.Context, id uuid.UUID, newRole models.TeamRole) (*models.PlanCollaborator, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanCollaborator(logger, id, newRole, principal, r.store)
}

func (r *mutationResolver) DeletePlanCollaborator(ctx context.Context, id uuid.UUID) (*models.PlanCollaborator, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeletePlanCollaborator(logger, id, principal, r.store)
}

func (r *mutationResolver) UpdatePlanBasics(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanBasics, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanBasics(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanMilestones(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanMilestones, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanMilestones(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanGeneralCharacteristics(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanGeneralCharacteristics, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanGeneralCharacteristics(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanBeneficiares(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanBeneficiaries, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanBeneficiariesUpdate(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanParticipantsAndProviders(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanParticipantsAndProviders, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanParticipantsAndProvidersUpdate(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanOpsEvalAndLearning(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanOpsEvalAndLearning, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanOpsEvalAndLearningUpdate(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) GeneratePresignedUploadURL(ctx context.Context, input model.GeneratePresignedUploadURLInput) (*model.GeneratePresignedUploadURLPayload, error) {
	url, err := r.s3Client.NewPutPresignedURL(input.MimeType)
	if err != nil {
		return nil, err
	}

	return &model.GeneratePresignedUploadURLPayload{
		URL: &url.URL,
	}, nil
}

func (r *mutationResolver) CreatePlanDocument(ctx context.Context, input model.PlanDocumentInput) (*model.PlanDocumentPayload, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	document := ConvertToPlanDocumentModel(&input)
	payload, err := resolvers.PlanDocumentCreate(logger, document, input.URL, principal, r.store, r.s3Client)

	return payload, err
}

func (r *mutationResolver) UpdatePlanDocument(ctx context.Context, input model.PlanDocumentInput) (*model.PlanDocumentPayload, error) {
	document := ConvertToPlanDocumentModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentUpdate(logger, r.s3Client, document, &principal, r.store)
}

func (r *mutationResolver) DeletePlanDocument(ctx context.Context, input model.PlanDocumentInput) (int, error) {
	document := ConvertToPlanDocumentModel(&input)
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentDelete(logger, document, &principal, r.store)
}

func (r *mutationResolver) CreatePlanDiscussion(ctx context.Context, input model.PlanDiscussionCreateInput) (*models.PlanDiscussion, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreatePlanDiscussion(logger, &input, principal, r.store)
}

func (r *mutationResolver) UpdatePlanDiscussion(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanDiscussion, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdatePlanDiscussion(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) DeletePlanDiscussion(ctx context.Context, id uuid.UUID) (*models.PlanDiscussion, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeletePlanDiscussion(logger, id, principal, r.store)
}

func (r *mutationResolver) CreateDiscussionReply(ctx context.Context, input model.DiscussionReplyCreateInput) (*models.DiscussionReply, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.CreateDiscussionReply(logger, &input, principal, r.store)
}

func (r *mutationResolver) UpdateDiscussionReply(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.DiscussionReply, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.UpdateDiscussionReply(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) DeleteDiscussionReply(ctx context.Context, id uuid.UUID) (*models.DiscussionReply, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)

	return resolvers.DeleteDiscussionReply(logger, id, principal, r.store)
}

func (r *planBeneficiariesResolver) Beneficiaries(ctx context.Context, obj *models.PlanBeneficiaries) ([]model.BeneficiariesType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var bTypes []model.BeneficiariesType

	for _, item := range obj.Beneficiaries {
		bTypes = append(bTypes, model.BeneficiariesType(item))
	}

	return bTypes, nil
}

func (r *planBeneficiariesResolver) BeneficiarySelectionMethod(ctx context.Context, obj *models.PlanBeneficiaries) ([]model.SelectionMethodType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var sTypes []model.SelectionMethodType

	for _, item := range obj.BeneficiarySelectionMethod {
		sTypes = append(sTypes, model.SelectionMethodType(item))
	}

	return sTypes, nil
}

func (r *planDiscussionResolver) Replies(ctx context.Context, obj *models.PlanDiscussion) ([]*models.DiscussionReply, error) {
	//TODO see if you can check if the PlanDiscussion already has replies, and if not go to DB, otherwise return the replies
	logger := appcontext.ZLogger(ctx)
	return resolvers.DiscussionReplyCollectionByDiscusionID(logger, obj.ID, r.store)
}

func (r *planDocumentResolver) OtherType(ctx context.Context, obj *models.PlanDocument) (*string, error) {
	return obj.OtherTypeDescription, nil
}

func (r *planGeneralCharacteristicsResolver) ResemblesExistingModelWhich(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]string, error) {
	return obj.ResemblesExistingModelWhich, nil
}

func (r *planGeneralCharacteristicsResolver) AlternativePaymentModelTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.AlternativePaymentModelType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var apmTypes []model.AlternativePaymentModelType

	for _, item := range obj.AlternativePaymentModelTypes {
		apmTypes = append(apmTypes, model.AlternativePaymentModelType(item))
	}

	return apmTypes, nil
}

func (r *planGeneralCharacteristicsResolver) KeyCharacteristics(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.KeyCharacteristic, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var keyCharacteristics []model.KeyCharacteristic

	for _, item := range obj.KeyCharacteristics {
		keyCharacteristics = append(keyCharacteristics, model.KeyCharacteristic(item))
	}

	return keyCharacteristics, nil
}

func (r *planGeneralCharacteristicsResolver) GeographiesTargetedTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.GeographyType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var geographyTypes []model.GeographyType

	for _, item := range obj.GeographiesTargetedTypes {
		geographyTypes = append(geographyTypes, model.GeographyType(item))
	}

	return geographyTypes, nil
}

func (r *planGeneralCharacteristicsResolver) GeographiesTargetedAppliedTo(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.GeographyApplication, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var geographyApplications []model.GeographyApplication

	for _, item := range obj.GeographiesTargetedAppliedTo {
		geographyApplications = append(geographyApplications, model.GeographyApplication(item))
	}

	return geographyApplications, nil
}

func (r *planGeneralCharacteristicsResolver) AgreementTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.AgreementType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var agreementTypes []model.AgreementType

	for _, item := range obj.AgreementTypes {
		agreementTypes = append(agreementTypes, model.AgreementType(item))
	}

	return agreementTypes, nil
}

func (r *planGeneralCharacteristicsResolver) AuthorityAllowances(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.AuthorityAllowance, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var authorityAllowances []model.AuthorityAllowance

	for _, item := range obj.AuthorityAllowances {
		authorityAllowances = append(authorityAllowances, model.AuthorityAllowance(item))
	}

	return authorityAllowances, nil
}

func (r *planGeneralCharacteristicsResolver) WaiversRequiredTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.WaiverType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var waiverTypes []model.WaiverType

	for _, item := range obj.WaiversRequiredTypes {
		waiverTypes = append(waiverTypes, model.WaiverType(item))
	}

	return waiverTypes, nil
}

func (r *planOpsEvalAndLearningResolver) AgencyOrStateHelp(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.AgencyOrStateHelpType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var agencyOrStateHelpTypes []model.AgencyOrStateHelpType
	for _, item := range obj.AgencyOrStateHelp {
		agencyOrStateHelpTypes = append(agencyOrStateHelpTypes, model.AgencyOrStateHelpType(item))
	}
	return agencyOrStateHelpTypes, nil
}

func (r *planOpsEvalAndLearningResolver) Stakeholders(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.StakeholdersType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var stakeholdersTypes []model.StakeholdersType
	for _, item := range obj.Stakeholders {
		stakeholdersTypes = append(stakeholdersTypes, model.StakeholdersType(item))
	}
	return stakeholdersTypes, nil
}

func (r *planOpsEvalAndLearningResolver) HelpdeskUse(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.HelpdeskUseType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var helpdeskUseTypes []model.HelpdeskUseType
	for _, item := range obj.HelpdeskUse {
		helpdeskUseTypes = append(helpdeskUseTypes, model.HelpdeskUseType(item))
	}
	return helpdeskUseTypes, nil
}

func (r *planOpsEvalAndLearningResolver) ContractorSupport(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.ContractorSupportType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var contractorSupportTypes []model.ContractorSupportType
	for _, item := range obj.ContractorSupport {
		contractorSupportTypes = append(contractorSupportTypes, model.ContractorSupportType(item))
	}
	return contractorSupportTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataMonitoringFileTypes(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.MonitoringFileType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var monitoringFileTypes []model.MonitoringFileType
	for _, item := range obj.DataMonitoringFileTypes {
		monitoringFileTypes = append(monitoringFileTypes, model.MonitoringFileType(item))
	}
	return monitoringFileTypes, nil
}

func (r *planOpsEvalAndLearningResolver) EvaluationApproaches(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.EvaluationApproachType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var evaluationApproachTypes []model.EvaluationApproachType
	for _, item := range obj.EvaluationApproaches {
		evaluationApproachTypes = append(evaluationApproachTypes, model.EvaluationApproachType(item))
	}
	return evaluationApproachTypes, nil
}

func (r *planOpsEvalAndLearningResolver) CcmInvolvment(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.CcmInvolvmentType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var ccmInvolvmentTypes []model.CcmInvolvmentType
	for _, item := range obj.CcmInvolvment {
		ccmInvolvmentTypes = append(ccmInvolvmentTypes, model.CcmInvolvmentType(item))
	}
	return ccmInvolvmentTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataNeededForMonitoring(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataForMonitoringType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var dataForMonitoringTypes []model.DataForMonitoringType
	for _, item := range obj.DataNeededForMonitoring {
		dataForMonitoringTypes = append(dataForMonitoringTypes, model.DataForMonitoringType(item))
	}
	return dataForMonitoringTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataToSendParticicipants(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataToSendParticipantsType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var dataToSendParticipantsTypes []model.DataToSendParticipantsType
	for _, item := range obj.DataToSendParticicipants {
		dataToSendParticipantsTypes = append(dataToSendParticipantsTypes, model.DataToSendParticipantsType(item))
	}
	return dataToSendParticipantsTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataSharingFrequency(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataFrequencyType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var dataFrequencyTypes []model.DataFrequencyType
	for _, item := range obj.DataSharingFrequency {
		dataFrequencyTypes = append(dataFrequencyTypes, model.DataFrequencyType(item))
	}
	return dataFrequencyTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataCollectionFrequency(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataFrequencyType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var dataFrequencyTypes []model.DataFrequencyType
	for _, item := range obj.DataCollectionFrequency {
		dataFrequencyTypes = append(dataFrequencyTypes, model.DataFrequencyType(item))
	}
	return dataFrequencyTypes, nil
}

func (r *planOpsEvalAndLearningResolver) ModelLearningSystems(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.ModelLearningSystemType, error) {
	// TODO: We should probably have a better way to handle enum arrays //Consider implmenting a generic function to handle this with Generics
	var modelLearningSystemTypes []model.ModelLearningSystemType
	for _, item := range obj.ModelLearningSystems {
		modelLearningSystemTypes = append(modelLearningSystemTypes, model.ModelLearningSystemType(item))
	}
	return modelLearningSystemTypes, nil
}

func (r *planParticipantsAndProvidersResolver) Participants(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsType, error) {
	// TODO: We should probably have a better way to handle enum arrays
	var participants []model.ParticipantsType
	for _, item := range obj.Participants {
		participants = append(participants, model.ParticipantsType(item))
	}
	return participants, nil
}

func (r *planParticipantsAndProvidersResolver) SelectionMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantSelectionType, error) {
	var selectionTypes []model.ParticipantSelectionType
	for _, item := range obj.SelectionMethod {
		selectionTypes = append(selectionTypes, model.ParticipantSelectionType(item))
	}
	return selectionTypes, nil
}

func (r *planParticipantsAndProvidersResolver) CommunicationMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantCommunicationType, error) {
	var communicationTypes []model.ParticipantCommunicationType
	for _, item := range obj.CommunicationMethod {
		communicationTypes = append(communicationTypes, model.ParticipantCommunicationType(item))
	}
	return communicationTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ParticipantsIds(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsIDType, error) {
	var participantsIDTypes []model.ParticipantsIDType
	for _, item := range obj.ParticipantsIds {
		participantsIDTypes = append(participantsIDTypes, model.ParticipantsIDType(item))
	}
	return participantsIDTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ProviderAddMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderAddType, error) {
	var providerAddTypes []model.ProviderAddType
	for _, item := range obj.ProviderAddMethod {
		providerAddTypes = append(providerAddTypes, model.ProviderAddType(item))
	}
	return providerAddTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ProviderLeaveMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderLeaveType, error) {
	var providerLeaveTypes []model.ProviderLeaveType
	for _, item := range obj.ProviderLeaveMethod {
		providerLeaveTypes = append(providerLeaveTypes, model.ProviderLeaveType(item))
	}
	return providerLeaveTypes, nil
}

func (r *queryResolver) CurrentUser(ctx context.Context) (*model.CurrentUser, error) {
	ldUser := flags.Principal(ctx)
	userKey := ldUser.GetKey()
	signedHash := r.ldClient.SecureModeHash(ldUser)

	currentUser := model.CurrentUser{
		LaunchDarkly: &model.LaunchDarklySettings{
			UserKey:    userKey,
			SignedHash: signedHash,
		},
	}
	return &currentUser, nil
}

func (r *queryResolver) ModelPlan(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.ModelPlanGetByID(logger, principal, id, r.store)
}

func (r *queryResolver) PlanDocument(ctx context.Context, id uuid.UUID) (*models.PlanDocument, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentRead(logger, r.store, r.s3Client, id)
}

func (r *queryResolver) PlanDocumentDownloadURL(ctx context.Context, id uuid.UUID) (*model.PlanDocumentPayload, error) {
	logger := appcontext.ZLogger(ctx)

	document, err := resolvers.PlanDocumentRead(logger, r.store, r.s3Client, id)
	if err != nil {
		return nil, err
	}

	url, err := r.s3Client.NewGetPresignedURL(document.FileKey)
	if err != nil {
		return nil, err
	}

	return &model.PlanDocumentPayload{
		Document:     document,
		PresignedURL: url,
	}, nil
}

func (r *queryResolver) ReadPlanDocumentByModelID(ctx context.Context, id uuid.UUID) ([]*models.PlanDocument, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanDocumentsReadByModelPlanID(logger, id, r.store, r.s3Client)
}

func (r *queryResolver) ModelPlanCollection(ctx context.Context) ([]*models.ModelPlan, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.ModelPlanCollectionByUser(logger, principal, r.store)
}

func (r *queryResolver) ExistingModelCollection(ctx context.Context) ([]*models.ExistingModel, error) {
	logger := appcontext.ZLogger(ctx)
	return resolvers.ExistingModelCollectionGet(logger, r.store)
}

func (r *queryResolver) CedarPersonsByCommonName(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
	response, err := r.service.SearchCommonNameContains(ctx, commonName)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func (r *queryResolver) PlanCollaboratorByID(ctx context.Context, id uuid.UUID) (*models.PlanCollaborator, error) {
	logger := appcontext.ZLogger(ctx)
	return resolvers.FetchCollaboratorByID(logger, id, r.store)
}

func (r *userInfoResolver) Email(ctx context.Context, obj *models.UserInfo) (string, error) {
	return string(obj.Email), nil
}

// ModelPlan returns generated.ModelPlanResolver implementation.
func (r *Resolver) ModelPlan() generated.ModelPlanResolver { return &modelPlanResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PlanBeneficiaries returns generated.PlanBeneficiariesResolver implementation.
func (r *Resolver) PlanBeneficiaries() generated.PlanBeneficiariesResolver {
	return &planBeneficiariesResolver{r}
}

// PlanDiscussion returns generated.PlanDiscussionResolver implementation.
func (r *Resolver) PlanDiscussion() generated.PlanDiscussionResolver {
	return &planDiscussionResolver{r}
}

// PlanDocument returns generated.PlanDocumentResolver implementation.
func (r *Resolver) PlanDocument() generated.PlanDocumentResolver { return &planDocumentResolver{r} }

// PlanGeneralCharacteristics returns generated.PlanGeneralCharacteristicsResolver implementation.
func (r *Resolver) PlanGeneralCharacteristics() generated.PlanGeneralCharacteristicsResolver {
	return &planGeneralCharacteristicsResolver{r}
}

// PlanOpsEvalAndLearning returns generated.PlanOpsEvalAndLearningResolver implementation.
func (r *Resolver) PlanOpsEvalAndLearning() generated.PlanOpsEvalAndLearningResolver {
	return &planOpsEvalAndLearningResolver{r}
}

// PlanParticipantsAndProviders returns generated.PlanParticipantsAndProvidersResolver implementation.
func (r *Resolver) PlanParticipantsAndProviders() generated.PlanParticipantsAndProvidersResolver {
	return &planParticipantsAndProvidersResolver{r}
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// UserInfo returns generated.UserInfoResolver implementation.
func (r *Resolver) UserInfo() generated.UserInfoResolver { return &userInfoResolver{r} }

type modelPlanResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type planBeneficiariesResolver struct{ *Resolver }
type planDiscussionResolver struct{ *Resolver }
type planDocumentResolver struct{ *Resolver }
type planGeneralCharacteristicsResolver struct{ *Resolver }
type planOpsEvalAndLearningResolver struct{ *Resolver }
type planParticipantsAndProvidersResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userInfoResolver struct{ *Resolver }
