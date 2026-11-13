package main

import (
	"io"
	"os"
	"path/filepath"
	"strings"
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

func (s *Seeder) createCTATDiscussion(ticket *models.CTATRequest, author authentication.Principal, role models.CTATDiscussionPoster, content string, createdDts time.Time) *models.CTATDiscussion {
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
	discussion.CreatedDts = createdDts

	// Seed directly through storage so test data does not send discussion emails.
	created, err := storage.CTATDiscussionCreate(s.Config.Store, discussion)
	if err != nil {
		panic(err)
	}
	return created
}

var ctatSeedLoremIpsum = []string{
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
	"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
	"Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
	"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
	"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
	"Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
	"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
	"Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
	"Et harum quidem rerum facilis est et expedita distinctio.",
	"Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
	"Omnis voluptas assumenda est, omnis dolor repellendus.",
}

func ctatSeedDiscussionContent(ticketNumber int, messageIndex int) string {
	start := (ticketNumber*7 + messageIndex*11) % len(ctatSeedLoremIpsum)
	length := 1 + (ticketNumber+messageIndex*2)%5
	sentences := make([]string, 0, length)
	for offset := range length {
		sentences = append(sentences, ctatSeedLoremIpsum[(start+offset)%len(ctatSeedLoremIpsum)])
	}
	return strings.Join(sentences, " ")
}

func (s *Seeder) seedCTATDiscussionThread(ticket *models.CTATRequest, requester *authentication.ApplicationPrincipal, admin *authentication.ApplicationPrincipal, latestAt time.Time, messageCount int) {
	for index := range messageCount {
		content := ctatSeedDiscussionContent(ticket.HumanReadableIDNumber, index)
		createdDts := latestAt.AddDate(0, 0, index-messageCount+1)
		if index%2 == 0 {
			s.createCTATDiscussion(ticket, requester, models.CTATDiscussionPosterRequester, content, createdDts)
		} else {
			s.createCTATDiscussion(ticket, admin, models.CTATDiscussionPosterAdmin, content, createdDts)
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

	s.seedCTATDiscussionThread(operationalSupportTicket, requesterBTAL, adminADMI, now.Add(-2*time.Hour), 7)
	s.seedCTATDiscussionThread(learningSystemsTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -1), 6)
	s.seedCTATDiscussionThread(seamlessCareTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -5), 8)
	s.seedCTATDiscussionThread(primaryCareTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -14), 6)
	s.seedCTATDiscussionThread(dataAnalyticsTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -3), 2)
	s.seedCTATDiscussionThread(paymentResearchTicket, requesterBTAL, adminADMI, now.AddDate(0, -1, 0), 3)
	s.seedCTATDiscussionThread(healthCareTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -2), 1)
	s.seedCTATDiscussionThread(seamlessInfrastructureTicket, requesterBTAL, adminADMI, now.AddDate(0, 0, -7), 2)
	s.seedCTATDiscussionThread(technologySolutionsTicket, requesterBTAL, adminADMI, now.AddDate(0, -2, 0), 1)
	s.seedCTATDiscussionThread(populationHealthTicket, requesterJANE, adminADMI, now.Add(-4*time.Hour), 7)
	s.seedCTATDiscussionThread(crossCmmiTicket, requesterBTMN, adminADMI, now.AddDate(0, 0, -21), 6)
}
