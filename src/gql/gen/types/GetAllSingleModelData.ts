/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelStatus, ModelCategory, CMSCenter, CMMIGroup, ModelType, TaskStatus, AuthorityAllowance, WaiverType, YesNoOtherType, AgencyOrStateHelpType, AlternativePaymentModelType, KeyCharacteristic, GeographyType, StatesAndTerritories, GeographyRegionType, GeographyApplication, AgreementType, FrequencyType, ParticipantCommunicationType, ParticipantRiskType, ParticipantRequireFinancialGuaranteeType, GainshareArrangementEligibility, ParticipantsIDType, ConfidenceType, RecruitmentType, ParticipantSelectionType, ParticipantsType, ProviderAddType, ProviderLeaveType, OverlapType, BeneficiariesType, SelectionMethodType, TriStateAnswer, YesNoType, CcmInvolvmentType, DataStartsType, EvaluationApproachType, DataForMonitoringType, DataToSendParticipantsType, DataFullTimeOrIncrementalType, MonitoringFileType, ModelLearningSystemType, StakeholdersType, ContractorSupportType, BenchmarkForPerformanceType, PayType, ClaimsBasedPayType, ComplexityCalculationLevelType, FundingSource, PayRecipient, NonClaimsBasedPayType, TeamRole, DiscussionUserRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllSingleModelData
// ====================================================

export interface GetAllSingleModelData_modelPlan_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_basics_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelCategory: ModelCategory | null;
  amsModelID: string | null;
  demoCode: string | null;
  cmsCenters: CMSCenter[];
  cmmiGroups: CMMIGroup[];
  modelType: ModelType[];
  modelTypeOther: string | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
  completeICIP: Time | null;
  clearanceStarts: Time | null;
  clearanceEnds: Time | null;
  announced: Time | null;
  applicationsStart: Time | null;
  applicationsEnd: Time | null;
  performancePeriodStarts: Time | null;
  performancePeriodEnds: Time | null;
  highLevelNote: string | null;
  wrapUpEnds: Time | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_basics_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_generalCharacteristics_resemblesExistingModelWhich {
  __typename: "ExistingModelLinks";
  names: string[];
}

export interface GetAllSingleModelData_modelPlan_generalCharacteristics_participationInModelPreconditionWhich {
  __typename: "ExistingModelLinks";
  names: string[];
}

export interface GetAllSingleModelData_modelPlan_generalCharacteristics_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  rulemakingRequired: boolean | null;
  rulemakingRequiredDescription: string | null;
  rulemakingRequiredNote: string | null;
  authorityAllowances: AuthorityAllowance[];
  authorityAllowancesOther: string | null;
  authorityAllowancesNote: string | null;
  waiversRequired: boolean | null;
  waiversRequiredTypes: WaiverType[];
  waiversRequiredNote: string | null;
  isNewModel: boolean | null;
  existingModel: string | null;
  resemblesExistingModel: YesNoOtherType | null;
  /**
   * For providing clarifying comments if Yes or No is selected for resemblesExistingModel
   */
  resemblesExistingModelWhyHow: string | null;
  resemblesExistingModelHow: string | null;
  resemblesExistingModelNote: string | null;
  resemblesExistingModelWhich: GetAllSingleModelData_modelPlan_generalCharacteristics_resemblesExistingModelWhich | null;
  /**
   * For providing clarifying comments if Other is selected for resemblesExistingModel
   */
  resemblesExistingModelOtherSpecify: string | null;
  /**
   * For denoting the name of the other existing model that this model resembles
   */
  resemblesExistingModelOtherOption: string | null;
  /**
   * For answering if participation in other models is a precondition for participating in this model
   */
  participationInModelPrecondition: YesNoOtherType | null;
  /**
   * The collection of existing model links relevant to the participationInModelPrecondition question
   */
  participationInModelPreconditionWhich: GetAllSingleModelData_modelPlan_generalCharacteristics_participationInModelPreconditionWhich | null;
  /**
   * For providing clarifying comments if Other is selected for participationInModelPrecondition
   */
  participationInModelPreconditionOtherSpecify: string | null;
  /**
   * For denoting the name of the other existing model
   */
  participationInModelPreconditionOtherOption: string | null;
  /**
   * For providing clarifying comments if Yes or No is selected for participationInModelPrecondition
   */
  participationInModelPreconditionWhyHow: string | null;
  /**
   * A note field for participationInModelPrecondition
   */
  participationInModelPreconditionNote: string | null;
  hasComponentsOrTracks: boolean | null;
  hasComponentsOrTracksDiffer: string | null;
  hasComponentsOrTracksNote: string | null;
  careCoordinationInvolved: boolean | null;
  careCoordinationInvolvedDescription: string | null;
  careCoordinationInvolvedNote: string | null;
  additionalServicesInvolved: boolean | null;
  additionalServicesInvolvedDescription: string | null;
  additionalServicesInvolvedNote: string | null;
  communityPartnersInvolved: boolean | null;
  communityPartnersInvolvedDescription: string | null;
  communityPartnersInvolvedNote: string | null;
  agencyOrStateHelp: AgencyOrStateHelpType[];
  agencyOrStateHelpOther: string | null;
  agencyOrStateHelpNote: string | null;
  alternativePaymentModelTypes: AlternativePaymentModelType[];
  alternativePaymentModelNote: string | null;
  keyCharacteristics: KeyCharacteristic[];
  keyCharacteristicsNote: string | null;
  keyCharacteristicsOther: string | null;
  collectPlanBids: boolean | null;
  collectPlanBidsNote: string | null;
  managePartCDEnrollment: boolean | null;
  managePartCDEnrollmentNote: string | null;
  planContractUpdated: boolean | null;
  planContractUpdatedNote: string | null;
  geographiesTargeted: boolean | null;
  geographiesTargetedTypes: GeographyType[];
  geographiesStatesAndTerritories: StatesAndTerritories[];
  geographiesRegionTypes: GeographyRegionType[];
  geographiesTargetedTypesOther: string | null;
  geographiesTargetedAppliedTo: GeographyApplication[];
  geographiesTargetedAppliedToOther: string | null;
  geographiesTargetedNote: string | null;
  participationOptions: boolean | null;
  participationOptionsNote: string | null;
  agreementTypes: AgreementType[];
  agreementTypesOther: string | null;
  multiplePatricipationAgreementsNeeded: boolean | null;
  multiplePatricipationAgreementsNeededNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_generalCharacteristics_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_participantsAndProviders_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  participantAddedFrequency: FrequencyType[];
  participantAddedFrequencyContinually: string | null;
  participantAddedFrequencyOther: string | null;
  participantAddedFrequencyNote: string | null;
  participantRemovedFrequency: FrequencyType[];
  participantRemovedFrequencyContinually: string | null;
  participantRemovedFrequencyOther: string | null;
  participantRemovedFrequencyNote: string | null;
  communicationMethod: ParticipantCommunicationType[];
  communicationMethodOther: string | null;
  communicationNote: string | null;
  riskType: ParticipantRiskType[];
  riskOther: string | null;
  riskNote: string | null;
  willRiskChange: boolean | null;
  willRiskChangeNote: string | null;
  participantRequireFinancialGuarantee: boolean | null;
  participantRequireFinancialGuaranteeType: ParticipantRequireFinancialGuaranteeType[];
  participantRequireFinancialGuaranteeOther: string | null;
  participantRequireFinancialGuaranteeNote: string | null;
  coordinateWork: boolean | null;
  coordinateWorkNote: string | null;
  gainsharePayments: boolean | null;
  gainsharePaymentsTrack: boolean | null;
  gainsharePaymentsEligibility: GainshareArrangementEligibility[];
  gainsharePaymentsEligibilityOther: string | null;
  gainsharePaymentsNote: string | null;
  participantsIds: ParticipantsIDType[];
  participantsIdsOther: string | null;
  participantsIDSNote: string | null;
  expectedNumberOfParticipants: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  recruitmentMethod: RecruitmentType | null;
  recruitmentOther: string | null;
  recruitmentNote: string | null;
  selectionMethod: ParticipantSelectionType[];
  selectionOther: string | null;
  selectionNote: string | null;
  participants: ParticipantsType[];
  medicareProviderType: string | null;
  statesEngagement: string | null;
  participantsOther: string | null;
  participantsNote: string | null;
  participantsCurrentlyInModels: boolean | null;
  participantsCurrentlyInModelsNote: string | null;
  modelApplicationLevel: string | null;
  providerAdditionFrequency: FrequencyType[];
  providerAdditionFrequencyContinually: string | null;
  providerAdditionFrequencyOther: string | null;
  providerAdditionFrequencyNote: string | null;
  providerAddMethod: ProviderAddType[];
  providerAddMethodOther: string | null;
  providerAddMethodNote: string | null;
  providerLeaveMethod: ProviderLeaveType[];
  providerLeaveMethodOther: string | null;
  providerLeaveMethodNote: string | null;
  providerRemovalFrequency: FrequencyType[];
  providerRemovalFrequencyContinually: string | null;
  providerRemovalFrequencyOther: string | null;
  providerRemovalFrequencyNote: string | null;
  providerOverlap: OverlapType | null;
  providerOverlapHierarchy: string | null;
  providerOverlapNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_participantsAndProviders_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_beneficiaries_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  beneficiaries: BeneficiariesType[];
  beneficiariesNote: string | null;
  beneficiariesOther: string | null;
  beneficiaryOverlap: OverlapType | null;
  beneficiaryOverlapNote: string | null;
  beneficiarySelectionNote: string | null;
  beneficiarySelectionOther: string | null;
  beneficiarySelectionMethod: SelectionMethodType[];
  treatDualElligibleDifferent: TriStateAnswer | null;
  treatDualElligibleDifferentHow: string | null;
  treatDualElligibleDifferentNote: string | null;
  excludeCertainCharacteristics: TriStateAnswer | null;
  excludeCertainCharacteristicsCriteria: string | null;
  excludeCertainCharacteristicsNote: string | null;
  beneficiarySelectionFrequency: FrequencyType[];
  beneficiarySelectionFrequencyContinually: string | null;
  beneficiarySelectionFrequencyNote: string | null;
  beneficiarySelectionFrequencyOther: string | null;
  beneficiaryRemovalFrequency: FrequencyType[];
  beneficiaryRemovalFrequencyContinually: string | null;
  beneficiaryRemovalFrequencyNote: string | null;
  beneficiaryRemovalFrequencyOther: string | null;
  precedenceRules: YesNoType[];
  precedenceRulesYes: string | null;
  precedenceRulesNo: string | null;
  precedenceRulesNote: string | null;
  numberPeopleImpacted: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_beneficiaries_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_opsEvalAndLearning_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  ccmInvolvmentOther: string | null;
  ccmInvolvmentNote: string | null;
  iddocSupport: boolean | null;
  iddocSupportNote: string | null;
  sendFilesBetweenCcw: boolean | null;
  sendFilesBetweenCcwNote: string | null;
  appToSendFilesToKnown: boolean | null;
  appToSendFilesToWhich: string | null;
  appToSendFilesToNote: string | null;
  useCcwForFileDistribiutionToParticipants: boolean | null;
  useCcwForFileDistribiutionToParticipantsNote: string | null;
  developNewQualityMeasures: boolean | null;
  developNewQualityMeasuresNote: string | null;
  qualityPerformanceImpactsPayment: YesNoOtherType | null;
  qualityPerformanceImpactsPaymentOther: string | null;
  qualityPerformanceImpactsPaymentNote: string | null;
  dataSharingStarts: DataStartsType | null;
  dataSharingStartsOther: string | null;
  dataSharingFrequency: FrequencyType[];
  dataSharingFrequencyContinually: string | null;
  dataSharingFrequencyOther: string | null;
  dataSharingStartsNote: string | null;
  dataCollectionStarts: DataStartsType | null;
  dataCollectionStartsOther: string | null;
  dataCollectionFrequency: FrequencyType[];
  dataCollectionFrequencyContinually: string | null;
  dataCollectionFrequencyOther: string | null;
  dataCollectionFrequencyNote: string | null;
  qualityReportingStarts: DataStartsType | null;
  qualityReportingStartsOther: string | null;
  qualityReportingStartsNote: string | null;
  qualityReportingFrequency: FrequencyType[];
  qualityReportingFrequencyContinually: string | null;
  qualityReportingFrequencyOther: string | null;
  evaluationApproaches: EvaluationApproachType[];
  evaluationApproachOther: string | null;
  evalutaionApproachNote: string | null;
  dataNeededForMonitoring: DataForMonitoringType[];
  dataNeededForMonitoringOther: string | null;
  dataNeededForMonitoringNote: string | null;
  dataToSendParticicipants: DataToSendParticipantsType[];
  dataToSendParticicipantsOther: string | null;
  dataToSendParticicipantsNote: string | null;
  shareCclfData: boolean | null;
  shareCclfDataNote: string | null;
  technicalContactsIdentified: boolean | null;
  technicalContactsIdentifiedDetail: string | null;
  technicalContactsIdentifiedNote: string | null;
  captureParticipantInfo: boolean | null;
  captureParticipantInfoNote: string | null;
  icdOwner: string | null;
  draftIcdDueDate: Time | null;
  icdNote: string | null;
  dataFullTimeOrIncremental: DataFullTimeOrIncrementalType | null;
  eftSetUp: boolean | null;
  unsolicitedAdjustmentsIncluded: boolean | null;
  dataFlowDiagramsNeeded: boolean | null;
  produceBenefitEnhancementFiles: boolean | null;
  fileNamingConventions: string | null;
  dataMonitoringNote: string | null;
  uatNeeds: string | null;
  stcNeeds: string | null;
  testingTimelines: string | null;
  testingNote: string | null;
  dataMonitoringFileTypes: MonitoringFileType[];
  dataMonitoringFileOther: string | null;
  dataResponseType: string | null;
  dataResponseFileFrequency: string | null;
  modelLearningSystems: ModelLearningSystemType[];
  modelLearningSystemsOther: string | null;
  modelLearningSystemsNote: string | null;
  anticipatedChallenges: string | null;
  stakeholders: StakeholdersType[];
  stakeholdersOther: string | null;
  stakeholdersNote: string | null;
  helpdeskUse: boolean | null;
  helpdeskUseNote: string | null;
  contractorSupport: ContractorSupportType[];
  contractorSupportOther: string | null;
  contractorSupportHow: string | null;
  contractorSupportNote: string | null;
  benchmarkForPerformance: BenchmarkForPerformanceType | null;
  benchmarkForPerformanceNote: string | null;
  computePerformanceScores: boolean | null;
  computePerformanceScoresNote: string | null;
  riskAdjustPerformance: boolean | null;
  riskAdjustFeedback: boolean | null;
  riskAdjustPayments: boolean | null;
  riskAdjustOther: boolean | null;
  riskAdjustNote: string | null;
  appealPerformance: boolean | null;
  appealFeedback: boolean | null;
  appealPayments: boolean | null;
  appealOther: boolean | null;
  appealNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_opsEvalAndLearning_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_payments_readyForReviewByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  creatingDependenciesBetweenServices: boolean | null;
  creatingDependenciesBetweenServicesNote: string | null;
  needsClaimsDataCollection: boolean | null;
  needsClaimsDataCollectionNote: string | null;
  providingThirdPartyFile: boolean | null;
  isContractorAwareTestDataRequirements: boolean | null;
  beneficiaryCostSharingLevelAndHandling: string | null;
  waiveBeneficiaryCostSharingForAnyServices: boolean | null;
  waiveBeneficiaryCostSharingServiceSpecification: string | null;
  waiverOnlyAppliesPartOfPayment: boolean | null;
  waiveBeneficiaryCostSharingNote: string | null;
  payClaimsNote: string | null;
  payClaimsOther: string | null;
  shouldAnyProvidersExcludedFFSSystems: boolean | null;
  shouldAnyProviderExcludedFFSSystemsNote: string | null;
  changesMedicarePhysicianFeeSchedule: boolean | null;
  changesMedicarePhysicianFeeScheduleNote: string | null;
  affectsMedicareSecondaryPayerClaims: boolean | null;
  affectsMedicareSecondaryPayerClaimsHow: string | null;
  affectsMedicareSecondaryPayerClaimsNote: string | null;
  payModelDifferentiation: string | null;
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType | null;
  expectedCalculationComplexityLevelNote: string | null;
  claimsProcessingPrecedence: boolean | null;
  claimsProcessingPrecedenceOther: string | null;
  claimsProcessingPrecedenceNote: string | null;
  canParticipantsSelectBetweenPaymentMechanisms: boolean | null;
  canParticipantsSelectBetweenPaymentMechanismsHow: string | null;
  canParticipantsSelectBetweenPaymentMechanismsNote: string | null;
  anticipatedPaymentFrequency: FrequencyType[];
  anticipatedPaymentFrequencyContinually: string | null;
  anticipatedPaymentFrequencyOther: string | null;
  anticipatedPaymentFrequencyNote: string | null;
  fundingSource: FundingSource[];
  fundingSourceMedicareAInfo: string | null;
  fundingSourceMedicareBInfo: string | null;
  fundingSourceOther: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[];
  fundingSourceRMedicareAInfo: string | null;
  fundingSourceRMedicareBInfo: string | null;
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[];
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payTypeNote: string | null;
  nonClaimsPayments: NonClaimsBasedPayType[];
  nonClaimsPaymentOther: string | null;
  paymentCalculationOwner: string | null;
  numberPaymentsPerPayCycle: string | null;
  numberPaymentsPerPayCycleNote: string | null;
  sharedSystemsInvolvedAdditionalClaimPayment: boolean | null;
  sharedSystemsInvolvedAdditionalClaimPaymentNote: string | null;
  planningToUseInnovationPaymentContractor: boolean | null;
  planningToUseInnovationPaymentContractorNote: string | null;
  willRecoverPayments: boolean | null;
  willRecoverPaymentsNote: string | null;
  anticipateReconcilingPaymentsRetrospectively: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote: string | null;
  paymentReconciliationFrequency: FrequencyType[];
  paymentReconciliationFrequencyContinually: string | null;
  paymentReconciliationFrequencyOther: string | null;
  paymentReconciliationFrequencyNote: string | null;
  paymentDemandRecoupmentFrequency: FrequencyType[];
  paymentDemandRecoupmentFrequencyContinually: string | null;
  paymentDemandRecoupmentFrequencyOther: string | null;
  paymentDemandRecoupmentFrequencyNote: string | null;
  paymentStartDate: Time | null;
  paymentStartDateNote: string | null;
  readyForReviewByUserAccount: GetAllSingleModelData_modelPlan_payments_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllSingleModelData_modelPlan_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetAllSingleModelData_modelPlan_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  userAccount: GetAllSingleModelData_modelPlan_collaborators_userAccount;
  userID: UUID;
  teamRoles: TeamRole[];
  modelPlanID: UUID;
  createdDts: Time;
}

export interface GetAllSingleModelData_modelPlan_discussions_content {
  __typename: "TaggedContent";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface GetAllSingleModelData_modelPlan_discussions_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_discussions_replies_content {
  __typename: "TaggedContent";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface GetAllSingleModelData_modelPlan_discussions_replies_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetAllSingleModelData_modelPlan_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  discussionID: UUID;
  content: GetAllSingleModelData_modelPlan_discussions_replies_content | null;
  createdByUserAccount: GetAllSingleModelData_modelPlan_discussions_replies_createdByUserAccount;
  userRole: DiscussionUserRole | null;
  userRoleDescription: string | null;
  createdDts: Time;
}

export interface GetAllSingleModelData_modelPlan_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  content: GetAllSingleModelData_modelPlan_discussions_content | null;
  createdByUserAccount: GetAllSingleModelData_modelPlan_discussions_createdByUserAccount;
  userRole: DiscussionUserRole | null;
  userRoleDescription: string | null;
  createdDts: Time;
  replies: GetAllSingleModelData_modelPlan_discussions_replies[];
}

export interface GetAllSingleModelData_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  nameHistory: string[];
  abbreviation: string | null;
  archived: boolean;
  createdByUserAccount: GetAllSingleModelData_modelPlan_createdByUserAccount;
  createdDts: Time;
  status: ModelStatus;
  basics: GetAllSingleModelData_modelPlan_basics;
  generalCharacteristics: GetAllSingleModelData_modelPlan_generalCharacteristics;
  participantsAndProviders: GetAllSingleModelData_modelPlan_participantsAndProviders;
  beneficiaries: GetAllSingleModelData_modelPlan_beneficiaries;
  opsEvalAndLearning: GetAllSingleModelData_modelPlan_opsEvalAndLearning;
  payments: GetAllSingleModelData_modelPlan_payments;
  collaborators: GetAllSingleModelData_modelPlan_collaborators[];
  discussions: GetAllSingleModelData_modelPlan_discussions[];
}

export interface GetAllSingleModelData {
  modelPlan: GetAllSingleModelData_modelPlan;
}

export interface GetAllSingleModelDataVariables {
  id: UUID;
}
