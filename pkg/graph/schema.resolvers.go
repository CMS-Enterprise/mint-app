package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/flags"
	"github.com/cmsgov/mint-app/pkg/graph/generated"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (r *modelPlanResolver) CmsCenters(ctx context.Context, obj *models.ModelPlan) ([]models.CMSCenter, error) {
	cmsCenters := models.ConvertEnums[models.CMSCenter](obj.CMSCenters)
	return cmsCenters, nil
}

func (r *modelPlanResolver) CmmiGroups(ctx context.Context, obj *models.ModelPlan) ([]model.CMMIGroup, error) {
	cmmiGroups := models.ConvertEnums[model.CMMIGroup](obj.CMMIGroups)
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

func (r *modelPlanResolver) ParticipantsAndProviders(ctx context.Context, obj *models.ModelPlan) (*models.PlanParticipantsAndProviders, error) {
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

func (r *modelPlanResolver) Payments(ctx context.Context, obj *models.ModelPlan) (*models.PlanPayments, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanPaymentsReadByModelPlan(logger, r.store, obj.ID)
}

func (r *modelPlanResolver) ItTools(ctx context.Context, obj *models.ModelPlan) (*models.PlanITTools, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanITToolsGetByModelPlanID(logger, obj.ID, r.store)
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

func (r *mutationResolver) UpdatePlanBeneficiaries(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanBeneficiaries, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanBeneficiariesUpdate(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanParticipantsAndProviders(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanParticipantsAndProviders, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanParticipantsAndProvidersUpdate(logger, id, changes, principal, r.store)
}

func (r *mutationResolver) UpdatePlanItTools(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanITTools, error) {
	principal := appcontext.Principal(ctx).ID()
	logger := appcontext.ZLogger(ctx)
	return resolvers.PlanITToolsUpdate(logger, id, changes, principal, r.store)
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

func (r *mutationResolver) UpdatePlanPayments(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.PlanPayments, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx).ID()

	return resolvers.PlanPaymentsUpdate(logger, r.store, id, changes, principal)
}

func (r *planBeneficiariesResolver) Beneficiaries(ctx context.Context, obj *models.PlanBeneficiaries) ([]model.BeneficiariesType, error) {
	bTypes := models.ConvertEnums[model.BeneficiariesType](obj.Beneficiaries)
	return bTypes, nil
}

func (r *planBeneficiariesResolver) BeneficiarySelectionMethod(ctx context.Context, obj *models.PlanBeneficiaries) ([]model.SelectionMethodType, error) {
	sTypes := models.ConvertEnums[model.SelectionMethodType](obj.BeneficiarySelectionMethod)
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
	apmTypes := models.ConvertEnums[model.AlternativePaymentModelType](obj.AlternativePaymentModelTypes)
	return apmTypes, nil
}

func (r *planGeneralCharacteristicsResolver) KeyCharacteristics(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.KeyCharacteristic, error) {
	keyCharacteristics := models.ConvertEnums[model.KeyCharacteristic](obj.KeyCharacteristics)
	return keyCharacteristics, nil
}

func (r *planGeneralCharacteristicsResolver) GeographiesTargetedTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.GeographyType, error) {
	geographyTypes := models.ConvertEnums[model.GeographyType](obj.GeographiesTargetedTypes)
	return geographyTypes, nil
}

func (r *planGeneralCharacteristicsResolver) GeographiesTargetedAppliedTo(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.GeographyApplication, error) {
	geographyApplications := models.ConvertEnums[model.GeographyApplication](obj.GeographiesTargetedAppliedTo)
	return geographyApplications, nil
}

func (r *planGeneralCharacteristicsResolver) AgreementTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.AgreementType, error) {
	agreementTypes := models.ConvertEnums[model.AgreementType](obj.AgreementTypes)
	return agreementTypes, nil
}

func (r *planGeneralCharacteristicsResolver) AuthorityAllowances(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.AuthorityAllowance, error) {
	authorityAllowances := models.ConvertEnums[model.AuthorityAllowance](obj.AuthorityAllowances)
	return authorityAllowances, nil
}

func (r *planGeneralCharacteristicsResolver) WaiversRequiredTypes(ctx context.Context, obj *models.PlanGeneralCharacteristics) ([]model.WaiverType, error) {
	waiverTypes := models.ConvertEnums[model.WaiverType](obj.WaiversRequiredTypes)
	return waiverTypes, nil
}

func (r *planITToolsResolver) GcPartCd(ctx context.Context, obj *models.PlanITTools) ([]model.GcPartCDType, error) {
	GcPartCDs := models.ConvertEnums[model.GcPartCDType](obj.GcPartCD)
	return GcPartCDs, nil
}

func (r *planITToolsResolver) GcCollectBids(ctx context.Context, obj *models.PlanITTools) ([]model.GcCollectBidsType, error) {
	GcCollectBidss := models.ConvertEnums[model.GcCollectBidsType](obj.GcCollectBids)
	return GcCollectBidss, nil
}

func (r *planITToolsResolver) GcUpdateContract(ctx context.Context, obj *models.PlanITTools) ([]model.GcUpdateContractType, error) {
	GcUpdateContracts := models.ConvertEnums[model.GcUpdateContractType](obj.GcUpdateContract)
	return GcUpdateContracts, nil
}

func (r *planITToolsResolver) PpToAdvertise(ctx context.Context, obj *models.PlanITTools) ([]model.PpToAdvertiseType, error) {
	PpToAdvertises := models.ConvertEnums[model.PpToAdvertiseType](obj.PpToAdvertise)
	return PpToAdvertises, nil
}

func (r *planITToolsResolver) PpCollectScoreReview(ctx context.Context, obj *models.PlanITTools) ([]model.PpCollectScoreReviewType, error) {
	PpCollectScoreReviews := models.ConvertEnums[model.PpCollectScoreReviewType](obj.PpCollectScoreReview)
	return PpCollectScoreReviews, nil
}

func (r *planITToolsResolver) PpAppSupportContractor(ctx context.Context, obj *models.PlanITTools) ([]model.PpAppSupportContractorType, error) {
	PpAppSupportContractors := models.ConvertEnums[model.PpAppSupportContractorType](obj.PpAppSupportContractor)
	return PpAppSupportContractors, nil
}

func (r *planITToolsResolver) PpCommunicateWithParticipant(ctx context.Context, obj *models.PlanITTools) ([]model.PpCommunicateWithParticipantType, error) {
	PpCommunicateWithParticipants := models.ConvertEnums[model.PpCommunicateWithParticipantType](obj.PpCommunicateWithParticipant)
	return PpCommunicateWithParticipants, nil
}

func (r *planITToolsResolver) PpManageProviderOverlap(ctx context.Context, obj *models.PlanITTools) ([]model.PpManageProviderOverlapType, error) {
	PpManageProviderOverlaps := models.ConvertEnums[model.PpManageProviderOverlapType](obj.PpManageProviderOverlap)
	return PpManageProviderOverlaps, nil
}

func (r *planITToolsResolver) BManageBeneficiaryOverlap(ctx context.Context, obj *models.PlanITTools) ([]model.BManageBeneficiaryOverlapType, error) {
	BManageBeneficiaryOverlaps := models.ConvertEnums[model.BManageBeneficiaryOverlapType](obj.BManageBeneficiaryOverlap)
	return BManageBeneficiaryOverlaps, nil
}

func (r *planITToolsResolver) OelHelpdeskSupport(ctx context.Context, obj *models.PlanITTools) ([]model.OelHelpdeskSupportType, error) {
	OelHelpdeskSupports := models.ConvertEnums[model.OelHelpdeskSupportType](obj.OelHelpdeskSupport)
	return OelHelpdeskSupports, nil
}

func (r *planITToolsResolver) OelManageAco(ctx context.Context, obj *models.PlanITTools) ([]model.OelManageAcoType, error) {
	OelManageAcos := models.ConvertEnums[model.OelManageAcoType](obj.OelManageAco)
	return OelManageAcos, nil
}

func (r *planITToolsResolver) OelPerformanceBenchmark(ctx context.Context, obj *models.PlanITTools) ([]model.OelPerformanceBenchmarkType, error) {
	OelPerformanceBenchmarks := models.ConvertEnums[model.OelPerformanceBenchmarkType](obj.OelPerformanceBenchmark)
	return OelPerformanceBenchmarks, nil
}

func (r *planITToolsResolver) OelProcessAppeals(ctx context.Context, obj *models.PlanITTools) ([]model.OelProcessAppealsType, error) {
	OelProcessAppealss := models.ConvertEnums[model.OelProcessAppealsType](obj.OelProcessAppeals)
	return OelProcessAppealss, nil
}

func (r *planITToolsResolver) OelEvaluationContractor(ctx context.Context, obj *models.PlanITTools) ([]model.OelEvaluationContractorType, error) {
	OelEvaluationContractors := models.ConvertEnums[model.OelEvaluationContractorType](obj.OelEvaluationContractor)
	return OelEvaluationContractors, nil
}

func (r *planITToolsResolver) OelCollectData(ctx context.Context, obj *models.PlanITTools) ([]model.OelCollectDataType, error) {
	OelCollectDatas := models.ConvertEnums[model.OelCollectDataType](obj.OelCollectData)
	return OelCollectDatas, nil
}

func (r *planITToolsResolver) OelObtainData(ctx context.Context, obj *models.PlanITTools) ([]model.OelObtainDataType, error) {
	OelObtainDatas := models.ConvertEnums[model.OelObtainDataType](obj.OelObtainData)
	return OelObtainDatas, nil
}

func (r *planITToolsResolver) OelClaimsBasedMeasures(ctx context.Context, obj *models.PlanITTools) ([]model.OelClaimsBasedMeasuresType, error) {
	OelClaimsBasedMeasuress := models.ConvertEnums[model.OelClaimsBasedMeasuresType](obj.OelClaimsBasedMeasures)
	return OelClaimsBasedMeasuress, nil
}

func (r *planITToolsResolver) OelQualityScores(ctx context.Context, obj *models.PlanITTools) ([]model.OelQualityScoresType, error) {
	OelQualityScoress := models.ConvertEnums[model.OelQualityScoresType](obj.OelQualityScores)
	return OelQualityScoress, nil
}

func (r *planITToolsResolver) OelSendReports(ctx context.Context, obj *models.PlanITTools) ([]model.OelSendReportsType, error) {
	OelSendReportss := models.ConvertEnums[model.OelSendReportsType](obj.OelSendReports)
	return OelSendReportss, nil
}

func (r *planITToolsResolver) OelLearningContractor(ctx context.Context, obj *models.PlanITTools) ([]model.OelLearningContractorType, error) {
	OelLearningContractors := models.ConvertEnums[model.OelLearningContractorType](obj.OelLearningContractor)
	return OelLearningContractors, nil
}

func (r *planITToolsResolver) OelParticipantCollaboration(ctx context.Context, obj *models.PlanITTools) ([]model.OelParticipantCollaborationType, error) {
	OelParticipantCollaborations := models.ConvertEnums[model.OelParticipantCollaborationType](obj.OelParticipantCollaboration)
	return OelParticipantCollaborations, nil
}

func (r *planITToolsResolver) OelEducateBeneficiaries(ctx context.Context, obj *models.PlanITTools) ([]model.OelEducateBeneficiariesType, error) {
	OelEducateBeneficiariess := models.ConvertEnums[model.OelEducateBeneficiariesType](obj.OelEducateBeneficiaries)
	return OelEducateBeneficiariess, nil
}

func (r *planITToolsResolver) PMakeClaimsPayments(ctx context.Context, obj *models.PlanITTools) ([]model.PMakeClaimsPaymentsType, error) {
	PMakeClaimsPaymentss := models.ConvertEnums[model.PMakeClaimsPaymentsType](obj.PMakeClaimsPayments)
	return PMakeClaimsPaymentss, nil
}

func (r *planITToolsResolver) PInformFfs(ctx context.Context, obj *models.PlanITTools) ([]model.PInformFfsType, error) {
	PInformFfss := models.ConvertEnums[model.PInformFfsType](obj.PInformFfs)
	return PInformFfss, nil
}

func (r *planITToolsResolver) PNonClaimsBasedPayments(ctx context.Context, obj *models.PlanITTools) ([]model.PNonClaimsBasedPaymentsType, error) {
	PNonClaimsBasedPaymentss := models.ConvertEnums[model.PNonClaimsBasedPaymentsType](obj.PNonClaimsBasedPayments)
	return PNonClaimsBasedPaymentss, nil
}

func (r *planITToolsResolver) PSharedSavingsPlan(ctx context.Context, obj *models.PlanITTools) ([]model.PSharedSavingsPlanType, error) {
	PSharedSavingsPlans := models.ConvertEnums[model.PSharedSavingsPlanType](obj.PSharedSavingsPlan)
	return PSharedSavingsPlans, nil
}

func (r *planITToolsResolver) PRecoverPayments(ctx context.Context, obj *models.PlanITTools) ([]model.PRecoverPaymentsType, error) {
	PRecoverPaymentss := models.ConvertEnums[model.PRecoverPaymentsType](obj.PRecoverPayments)
	return PRecoverPaymentss, nil
}

func (r *planOpsEvalAndLearningResolver) AgencyOrStateHelp(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.AgencyOrStateHelpType, error) {
	agencyOrStateHelpTypes := models.ConvertEnums[model.AgencyOrStateHelpType](obj.AgencyOrStateHelp)
	return agencyOrStateHelpTypes, nil
}

func (r *planOpsEvalAndLearningResolver) Stakeholders(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.StakeholdersType, error) {
	stakeholdersTypes := models.ConvertEnums[model.StakeholdersType](obj.Stakeholders)
	return stakeholdersTypes, nil
}

func (r *planOpsEvalAndLearningResolver) ContractorSupport(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.ContractorSupportType, error) {
	contractorSupportTypes := models.ConvertEnums[model.ContractorSupportType](obj.ContractorSupport)
	return contractorSupportTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataMonitoringFileTypes(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.MonitoringFileType, error) {
	monitoringFileTypes := models.ConvertEnums[model.MonitoringFileType](obj.DataMonitoringFileTypes)
	return monitoringFileTypes, nil
}

func (r *planOpsEvalAndLearningResolver) EvaluationApproaches(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.EvaluationApproachType, error) {
	evaluationApproachTypes := models.ConvertEnums[model.EvaluationApproachType](obj.EvaluationApproaches)
	return evaluationApproachTypes, nil
}

func (r *planOpsEvalAndLearningResolver) CcmInvolvment(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.CcmInvolvmentType, error) {
	ccmInvolvmentTypes := models.ConvertEnums[model.CcmInvolvmentType](obj.CcmInvolvment)
	return ccmInvolvmentTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataNeededForMonitoring(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataForMonitoringType, error) {
	dataForMonitoringTypes := models.ConvertEnums[model.DataForMonitoringType](obj.DataNeededForMonitoring)
	return dataForMonitoringTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataToSendParticicipants(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataToSendParticipantsType, error) {
	dataToSendParticipantsTypes := models.ConvertEnums[model.DataToSendParticipantsType](obj.DataToSendParticicipants)
	return dataToSendParticipantsTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataSharingFrequency(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataFrequencyType, error) {
	dataFrequencyTypes := models.ConvertEnums[model.DataFrequencyType](obj.DataSharingFrequency)
	return dataFrequencyTypes, nil
}

func (r *planOpsEvalAndLearningResolver) DataCollectionFrequency(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.DataFrequencyType, error) {
	dataFrequencyTypes := models.ConvertEnums[model.DataFrequencyType](obj.DataCollectionFrequency)
	return dataFrequencyTypes, nil
}

func (r *planOpsEvalAndLearningResolver) ModelLearningSystems(ctx context.Context, obj *models.PlanOpsEvalAndLearning) ([]model.ModelLearningSystemType, error) {
	modelLearningSystemTypes := models.ConvertEnums[model.ModelLearningSystemType](obj.ModelLearningSystems)
	return modelLearningSystemTypes, nil
}

func (r *planParticipantsAndProvidersResolver) Participants(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsType, error) {
	participants := models.ConvertEnums[model.ParticipantsType](obj.Participants)
	return participants, nil
}

func (r *planParticipantsAndProvidersResolver) SelectionMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantSelectionType, error) {
	selectionTypes := models.ConvertEnums[model.ParticipantSelectionType](obj.SelectionMethod)
	return selectionTypes, nil
}

func (r *planParticipantsAndProvidersResolver) CommunicationMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantCommunicationType, error) {
	communicationTypes := models.ConvertEnums[model.ParticipantCommunicationType](obj.CommunicationMethod)
	return communicationTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ParticipantsIds(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ParticipantsIDType, error) {
	participantsIDTypes := models.ConvertEnums[model.ParticipantsIDType](obj.ParticipantsIds)
	return participantsIDTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ProviderAddMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderAddType, error) {
	providerAddTypes := models.ConvertEnums[model.ProviderAddType](obj.ProviderAddMethod)
	return providerAddTypes, nil
}

func (r *planParticipantsAndProvidersResolver) ProviderLeaveMethod(ctx context.Context, obj *models.PlanParticipantsAndProviders) ([]model.ProviderLeaveType, error) {
	providerLeaveTypes := models.ConvertEnums[model.ProviderLeaveType](obj.ProviderLeaveMethod)
	return providerLeaveTypes, nil
}

func (r *planPaymentsResolver) FundingSourceR(ctx context.Context, obj *models.PlanPayments) ([]models.FundingSource, error) {
	return models.ConvertEnums[models.FundingSource](obj.FundingSourceR), nil
}

func (r *planPaymentsResolver) PayRecipients(ctx context.Context, obj *models.PlanPayments) ([]models.PayRecipient, error) {
	return models.ConvertEnums[models.PayRecipient](obj.PayRecipients), nil
}

func (r *planPaymentsResolver) PayRecipientNote(ctx context.Context, obj *models.PlanPayments) (string, error) {
	return *obj.PayRecipientsNote, nil
}

func (r *planPaymentsResolver) PayType(ctx context.Context, obj *models.PlanPayments) ([]models.PayType, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planPaymentsResolver) PayClaims(ctx context.Context, obj *models.PlanPayments) ([]models.ClaimsBasedPayType, error) {
	return models.ConvertEnums[models.ClaimsBasedPayType](obj.PayClaims), nil
}

func (r *planPaymentsResolver) NonClaimsPayments(ctx context.Context, obj *models.PlanPayments) ([]model.NonClaimsBasedPayType, error) {
	return models.ConvertEnums[model.NonClaimsBasedPayType](obj.NonClaimsPayments), nil
}

func (r *planPaymentsResolver) NonClaimsPaymentOther(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *planPaymentsResolver) AnticipatedPaymentFrequency(ctx context.Context, obj *models.PlanPayments) ([]models.AnticipatedPaymentFrequencyType, error) {
	panic(fmt.Errorf("not implemented"))
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

func (r *queryResolver) PlanPayments(ctx context.Context, id uuid.UUID) (*models.PlanPayments, error) {
	logger := appcontext.ZLogger(ctx)

	return resolvers.PlanPaymentsRead(logger, r.store, id)
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

// PlanITTools returns generated.PlanITToolsResolver implementation.
func (r *Resolver) PlanITTools() generated.PlanITToolsResolver { return &planITToolsResolver{r} }

// PlanOpsEvalAndLearning returns generated.PlanOpsEvalAndLearningResolver implementation.
func (r *Resolver) PlanOpsEvalAndLearning() generated.PlanOpsEvalAndLearningResolver {
	return &planOpsEvalAndLearningResolver{r}
}

// PlanParticipantsAndProviders returns generated.PlanParticipantsAndProvidersResolver implementation.
func (r *Resolver) PlanParticipantsAndProviders() generated.PlanParticipantsAndProvidersResolver {
	return &planParticipantsAndProvidersResolver{r}
}

// PlanPayments returns generated.PlanPaymentsResolver implementation.
func (r *Resolver) PlanPayments() generated.PlanPaymentsResolver { return &planPaymentsResolver{r} }

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
type planITToolsResolver struct{ *Resolver }
type planOpsEvalAndLearningResolver struct{ *Resolver }
type planParticipantsAndProvidersResolver struct{ *Resolver }
type planPaymentsResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userInfoResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *planPaymentsResolver) FundingSourceRTrustFundDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *planPaymentsResolver) FundingSourceROtherDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *planPaymentsResolver) PayClaimsOtherDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *planPaymentsResolver) NonClaimsPaymentOtherDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	return *obj.NonClaimsPaymentsOther, nil
}
func (r *planPaymentsResolver) FundingStructureDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *planPaymentsResolver) CanParticipantsSelectBetweenPaymentMechanismsDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *planPaymentsResolver) AnticipatedPaymentFrequencyOtherDescription(ctx context.Context, obj *models.PlanPayments) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
