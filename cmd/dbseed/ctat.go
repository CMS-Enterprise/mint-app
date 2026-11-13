package main

import (
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func closeCTATSupportingDocumentInputs(inputs []*model.CTATRequestDocumentInput) {
	for _, input := range inputs {
		if input == nil {
			continue
		}

		closer, ok := input.FileData.File.(io.Closer)
		if !ok {
			continue
		}

		_ = closer.Close()
	}
}

func (s *Seeder) ctatSupportingDocumentInput(fileName string, filePath string, contentType string) *model.CTATRequestDocumentInput {
	path, err := filepath.Abs(filePath)
	if err != nil {
		panic(err)
	}

	file, err := os.Open(path) // #nosec
	if err != nil {
		panic(err)
	}

	fileStats, err := file.Stat()
	if err != nil {
		_ = file.Close()
		panic(err)
	}

	return &model.CTATRequestDocumentInput{
		FileData: graphql.Upload{
			File:        file,
			Filename:    fileName,
			Size:        fileStats.Size(),
			ContentType: contentType,
		},
	}
}

func (s *Seeder) createCTATRequest(requester *authentication.ApplicationPrincipal, input *model.CTATRequestInput) *models.CTATRequest {
	if requester == nil || requester.UserAccount == nil {
		panic("ctat request seed requires a requester")
	}
	if input == nil {
		panic("ctat request seed requires an input")
	}

	defer closeCTATSupportingDocumentInputs(input.SupportingDocuments)

	request, err := resolvers.CTATRequestCreate(
		s.Config.Context,
		s.Config.Logger,
		input,
		requester,
		s.Config.Store,
		s.Config.S3Client,
		nil,
		email.AddressBook{},
	)
	if err != nil {
		panic(err)
	}

	return request
}

func (s *Seeder) createCTATDiscussion(ticket *models.CTATRequest, author authentication.Principal, role models.CTATDiscussionPoster, content string) *models.CTATDiscussion {
	if ticket == nil || author == nil || author.Account() == nil {
		panic("ctat discussion seed requires a ticket and an author")
	}

	switch role {
	case models.CTATDiscussionPosterRequester:
		if ticket.Requester != author.Account().ID {
			panic("ctat discussion requester must own the ticket")
		}
	case models.CTATDiscussionPosterAdmin:
		if !author.AllowASSESSMENT() {
			panic("ctat discussion admin must have assessment access")
		}
	default:
		panic("ctat discussion seed requires a valid poster role")
	}

	discussion := &models.CTATDiscussion{
		TicketID:   ticket.ID,
		Content:    content,
		PosterRole: role,
	}
	discussion.CreatedBy = author.Account().ID

	// Seed directly through storage so test data does not send discussion emails.
	created, err := storage.CTATDiscussionCreate(s.Config.Store, discussion)
	if err != nil {
		panic(err)
	}
	return created
}

func (s *Seeder) seedCTATDiscussionThread(ticket *models.CTATRequest, requester *authentication.ApplicationPrincipal, admin *authentication.ApplicationPrincipal, messages ...string) {
	for index, content := range messages {
		if index%2 == 0 {
			s.createCTATDiscussion(ticket, requester, models.CTATDiscussionPosterRequester, content)
		} else {
			s.createCTATDiscussion(ticket, admin, models.CTATDiscussionPosterAdmin, content)
		}
	}
}

func (s *Seeder) seedCTATRequests(
	now time.Time,
	planWithBasics *models.ModelPlan,
	planWithDocuments *models.ModelPlan,
	sampleModelPlan *models.ModelPlan,
	planWithCrTDLs *models.ModelPlan,
	planApproachingClearance *models.ModelPlan,
) {
	requesterBTAL := s.getTestPrincipalByUsername("BTAL")
	requesterJANE := s.getTestPrincipalByUsername("JANE")
	requesterBTMN := s.getTestPrincipalByUsername("BTMN")
	adminADMI := s.getTestPrincipalByUsername("ADMI")
	adminADMI.JobCodeASSESSMENT = true

	bsgDivision := models.CTATCMMIDivisionOptionBSGDCCS
	bsgTechDivision := models.CTATCMMIDivisionOptionBSGDTS
	ldgDivision := models.CTATCMMIDivisionOptionLDGDMLS
	ldgAnalysisDivision := models.CTATCMMIDivisionOptionLDGDAN
	pcmgDivision := models.CTATCMMIDivisionOptionPCMGDAPC
	ppgDataDivision := models.CTATCMMIDivisionOptionPPGDDA
	rregDivision := models.CTATCMMIDivisionOptionRREGDPAR
	scmgDivision := models.CTATCMMIDivisionOptionSCMGDFR
	scmgInfraDivision := models.CTATCMMIDivisionOptionSCMGDSI
	sphgDivision := models.CTATCMMIDivisionOptionSPHGDHCD
	technicalAssistance := models.CTATContractActivityTypeTechnicalAssistance
	implementationActivity := models.CTATContractActivityTypeImplementation
	evaluationActivity := models.CTATContractActivityTypeEvaluation
	learningActivity := models.CTATContractActivityTypeLearning
	timeAndMaterials := models.CTATContractTypeTimeAndMaterials
	firmFixedPrice := models.CTATContractTypeFirmFixedPrice
	costReimbursement := models.CTATContractTypeCostReimbursement
	incentiveContract := models.CTATContractTypeIncentiveContract
	costPlusFixedFee := models.CTATContractTypeCostPlusFixedFee

	operationalSupportTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           &bsgDivision,
		RelatedMINTModels:      []uuid.UUID{planWithBasics.ID, sampleModelPlan.ID},
		ContractActivityType:   &technicalAssistance,
		ContractName:           new("CMMI Operational Support Services"),
		ContractNumber:         new("75FCMC24F0001"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
		DescribeHelpNeeded:     "Need help shaping an RFI package and validating market research assumptions for an upcoming acquisition.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 14),
	})

	learningSystemsTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionLDG,
		CmmiDivision:           &ldgDivision,
		RelatedMINTModels:      []uuid.UUID{planWithDocuments.ID},
		ContractActivityType:   &implementationActivity,
		ContractName:           new("Learning Systems Implementation Support"),
		ContractNumber:         new("75FCMC24F0003"),
		ContractType:           &firmFixedPrice,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP, models.CTATHelpNeededTypeSOWSOOPWSDevelopment},
		DescribeHelpNeeded:     "Need help reviewing the draft RFP package and refining the performance work statement before release.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 21),
	})

	seamlessCareTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionSCMG,
		CmmiDivision:           &scmgDivision,
		RelatedMINTModels:      []uuid.UUID{planApproachingClearance.ID},
		ContractActivityType:   &evaluationActivity,
		ContractName:           new("Seamless Care Financial Risk Advisory"),
		ContractNumber:         new("75FCMC24F0004"),
		ContractType:           &costReimbursement,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeDataUseAgreementDUA, models.CTATHelpNeededTypeInvoiceProcessingPlatformIPP},
		DescribeHelpNeeded:     "Looking for hands-on support with post-award administration questions and a related data use agreement workflow.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 10),
	})

	primaryCareTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionPCMG,
		CmmiDivision:           &pcmgDivision,
		RelatedMINTModels:      []uuid.UUID{sampleModelPlan.ID},
		ContractActivityType:   &implementationActivity,
		ContractName:           new("Primary Care Analytics Support"),
		ContractNumber:         new("75FCMC24F0005"),
		ContractType:           &firmFixedPrice,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ, models.CTATHelpNeededTypeIndependentGovernmentCostEstimateIGCEPreparation},
		DescribeHelpNeeded:     "Need help preparing an RFQ package and independent government cost estimate for a primary care-focused effort.",
		RequestUrgency:         models.CTATRequestUrgencyLow,
		DateAssistanceNeededBy: now.AddDate(0, 0, 28),
	})

	dataAnalyticsTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionPPG,
		CmmiDivision:           &ppgDataDivision,
		RelatedMINTModels:      []uuid.UUID{planWithBasics.ID},
		ContractActivityType:   &evaluationActivity,
		ContractName:           new("Data Analytics Advisory BPA"),
		ContractNumber:         new("75FCMC24F0006"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypePreAwardContractCostReviewCCRProcessing, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
		DescribeHelpNeeded:     "Looking for guidance on market research and a contract cost review tied to an analytics workstream.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 24),
	})

	paymentResearchTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionRREG,
		CmmiDivision:           &rregDivision,
		RelatedMINTModels:      []uuid.UUID{planWithCrTDLs.ID},
		ContractActivityType:   &learningActivity,
		ContractName:           new("Payment Accountability Research Support"),
		ContractNumber:         new("75FCMC24F0007"),
		ContractType:           &costReimbursement,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeInvoiceProcessingPlatformIPP, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
		DescribeHelpNeeded:     "Need help reviewing COR documentation and documenting contractor performance for a research support contract.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 20),
	})

	healthCareTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionSPHG,
		CmmiDivision:           &sphgDivision,
		RelatedMINTModels:      []uuid.UUID{planApproachingClearance.ID},
		ContractActivityType:   &technicalAssistance,
		ContractName:           new("Health Care Delivery Advisory"),
		ContractNumber:         new("75FCMC24F0008"),
		ContractType:           &costPlusFixedFee,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypePoliticalAppointeeApprovalPAAModification, models.CTATHelpNeededTypeMaintainingTheElectronicCorECORFile},
		DescribeHelpNeeded:     "Needed follow-up support on political appointee approval and electronic COR documentation maintenance.",
		RequestUrgency:         models.CTATRequestUrgencyLow,
		DateAssistanceNeededBy: now.AddDate(0, 0, 18),
	})

	seamlessInfrastructureTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionSCMG,
		CmmiDivision:           &scmgInfraDivision,
		RelatedMINTModels:      []uuid.UUID{planWithDocuments.ID},
		ContractActivityType:   &implementationActivity,
		ContractName:           new("Seamless Infrastructure Support"),
		ContractNumber:         new("75FCMC24F0009"),
		ContractType:           &incentiveContract,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCalmSystemRequisitionSupport, models.CTATHelpNeededTypeIdentityAndCredentialingToolICT},
		DescribeHelpNeeded:     "Need intake support for a requisition and identity/credentialing setup guidance for a new support effort.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 16),
	})

	technologySolutionsTicket := s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionBSG,
		CmmiDivision:           &bsgTechDivision,
		RelatedMINTModels:      []uuid.UUID{planWithBasics.ID, planWithDocuments.ID},
		ContractActivityType:   &evaluationActivity,
		ContractName:           new("Technology Solutions Advisory"),
		ContractNumber:         new("75FCMC24F0010"),
		ContractType:           &firmFixedPrice,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeGuidanceOnTEPMembershipScoringReporting, models.CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDF},
		DescribeHelpNeeded:     "Requested CTAT guidance on technical evaluation panel setup and required determinations and findings documentation.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 12),
	})

	// Leave this ticket without discussions to exercise the empty state.
	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionLDG,
		CmmiDivision:           &ldgAnalysisDivision,
		RelatedMINTModels:      []uuid.UUID{sampleModelPlan.ID, planApproachingClearance.ID},
		ContractActivityType:   &learningActivity,
		ContractName:           new("Analysis and Networks Advisory"),
		ContractNumber:         new("75FCMC24F0011"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForContractMemoRFC, models.CTATHelpNeededTypeDefiningAndDocumentingContractRequirements},
		DescribeHelpNeeded:     "Need support refining contract requirements and drafting a request for contract memo for a learning support engagement.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 9),
	})

	ppgDivisionOther := "Division of Innovation Partnerships (PPG/DIP)"
	ppgDivision := models.CTATCMMIDivisionOptionOther
	contractActivityOther := models.CTATContractActivityTypeOther
	contractTypeOther := models.CTATContractTypeOther
	typeOfHelpNeededOther := "Assistance drafting evaluation criteria for a new workstream"

	populationHealthTicket := s.createCTATRequest(requesterJANE, &model.CTATRequestInput{
		CmmiGroup:                 models.CTATCMMIGroupOptionPPG,
		CmmiDivision:              &ppgDivision,
		CmmiDivisionOther:         &ppgDivisionOther,
		RelatedMINTModels:         []uuid.UUID{planWithDocuments.ID},
		ContractActivityType:      &contractActivityOther,
		ContractActivityTypeOther: new("Acquisition strategy support"),
		ContractName:              new("Population Health Advisory Support"),
		ContractNumber:            new("75FCMC24F0002"),
		ContractType:              &contractTypeOther,
		ContractTypeOther:         new("Blanket Purchase Agreement"),
		TypeOfHelpNeeded:          []models.CTATHelpNeededType{models.CTATHelpNeededTypeSOWSOOPWSDevelopment, models.CTATHelpNeededTypeOther},
		TypeOfHelpNeededOther:     &typeOfHelpNeededOther,
		DescribeHelpNeeded:        "Looking for support drafting a statement of work and evaluating acquisition options for a policy-focused engagement.",
		RequestUrgency:            models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy:    now.AddDate(0, 0, 30),
		SupportingDocuments: []*model.CTATRequestDocumentInput{
			s.ctatSupportingDocumentInput("ctat-supporting-document.pdf", "cmd/dbseed/data/sample.pdf", "application/pdf"),
		},
	})

	crossCmmiGroupOther := "Cross-CMMI Strategic Operations"

	crossCmmiTicket := s.createCTATRequest(requesterBTMN, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionOther,
		CmmiGroupOther:         &crossCmmiGroupOther,
		RelatedMINTModels:      []uuid.UUID{planWithCrTDLs.ID, planApproachingClearance.ID},
		ContractActivityType:   &learningActivity,
		ContractType:           &costPlusFixedFee,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeInvoiceProcessingPlatformIPP, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
		DescribeHelpNeeded:     "Requested follow-up support on post-award administration questions and documentation closeout activities.",
		RequestUrgency:         models.CTATRequestUrgencyLow,
		DateAssistanceNeededBy: now.AddDate(0, 0, 7),
	})

	s.seedCTATDiscussionThread(operationalSupportTicket, requesterBTAL, adminADMI,
		"Can CTAT help us decide which market research findings should be reflected in the RFI?",
		"Yes. Please share the draft RFI and market research summary so we can review them together.",
		"Thanks. I will send the draft and highlight the sections where we need guidance.",
		"The acquisition team has also asked whether the vendor questions should be grouped by topic.",
		"Grouping them by topic would help respondents and make the answers easier to compare.",
		"That makes sense. I have updated the outline and would appreciate a final review.",
		"We will review the updated outline and return comments by the end of the week.",
	)

	s.seedCTATDiscussionThread(learningSystemsTicket, requesterBTAL, adminADMI,
		"The draft performance work statement is ready for CTAT review. Are there specific sections we should prioritize?",
		"Please start with the deliverables and evaluation criteria. We will review those first.",
		"I have marked the deliverables that need clearer acceptance criteria.",
		"The acceptance criteria should describe the expected output and review timeline for each deliverable.",
		"We updated those sections. Would CTAT also review the reporting schedule?",
		"Yes. We will include the reporting schedule in our next review pass.",
	)

	s.seedCTATDiscussionThread(seamlessCareTicket, requesterBTAL, adminADMI,
		"We need guidance on the data use agreement for the financial risk analysis.",
		"Please send the proposed data elements and the intended users of the data.",
		"The proposed data elements are listed in the draft agreement we shared.",
		"We found two fields that may need narrower access language.",
		"Could you identify those fields so we can revise the agreement?",
		"They are the beneficiary identifier and the provider-level payment amount.",
		"I have updated the draft to limit access to those fields.",
		"Thanks. CTAT will review the revised language before the next meeting.",
	)

	s.seedCTATDiscussionThread(primaryCareTicket, requesterBTAL, adminADMI,
		"Can CTAT review the independent government cost estimate for the primary care effort?",
		"Yes. Please include the assumptions behind the labor categories and estimated hours.",
		"The labor assumptions are in the latest cost worksheet.",
		"We recommend explaining the difference between the base year and option years.",
		"I added that explanation and updated the estimated hours.",
		"The revised estimate is clearer. We will finish our review of the RFQ package next.",
	)

	s.seedCTATDiscussionThread(dataAnalyticsTicket, requesterBTAL, adminADMI,
		"Could CTAT advise on the market research sources for this analytics workstream?",
		"Please include both the recent sources and the assumptions used in the cost review.",
	)

	s.seedCTATDiscussionThread(paymentResearchTicket, requesterBTAL, adminADMI,
		"We would appreciate guidance on documenting contractor performance for this support contract.",
		"Please share the current COR notes and any draft CPARS language.",
		"I have gathered the notes and will send the draft language for review.",
	)

	s.seedCTATDiscussionThread(healthCareTicket, requesterBTAL, adminADMI,
		"Can CTAT help us confirm the required approval steps for this contract modification?",
	)

	s.seedCTATDiscussionThread(seamlessInfrastructureTicket, requesterBTAL, adminADMI,
		"We need help with the requisition and identity credentialing steps for the new effort.",
		"Please send the planned start date and the list of staff who will need access.",
	)

	s.seedCTATDiscussionThread(technologySolutionsTicket, requesterBTAL, adminADMI,
		"Could CTAT review the technical evaluation panel plan before we finalize the solicitation?",
	)

	s.seedCTATDiscussionThread(populationHealthTicket, requesterJANE, adminADMI,
		"Could CTAT review our draft statement of work before we finalize the acquisition approach?",
		"Yes. Please identify the deliverables and the decision points that need contract support.",
		"I have marked those sections in the draft statement of work.",
		"The milestones are clear, but the acceptance criteria need more detail.",
		"I updated the criteria and added examples for the evaluation deliverables.",
		"Those examples help. We will review the revised draft with the acquisition team.",
		"Thank you. I will wait for the team's comments before making further changes.",
	)

	s.seedCTATDiscussionThread(crossCmmiTicket, requesterBTMN, adminADMI,
		"We have follow-up questions about the post-award documentation closeout process.",
		"We have received your request and will review the current closeout checklist.",
		"The checklist is available, but we are unsure which records must be retained.",
		"Please send the records list so we can identify the required retention items.",
		"I sent the records list and highlighted the items in question.",
		"Thanks. We will provide comments on those items after reviewing the checklist.",
	)
}
