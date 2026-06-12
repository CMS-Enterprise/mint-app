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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionPPG,
		CmmiDivision:           &ppgDataDivision,
		RelatedMINTModels:      []uuid.UUID{planWithBasics.ID},
		ContractActivityType:   &evaluationActivity,
		ContractName:           new("Data Analytics Advisory BPA"),
		ContractNumber:         new("75FCMC24F0006"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeContractCostReviewCCRProcessing, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
		DescribeHelpNeeded:     "Looking for guidance on market research and a contract cost review tied to an analytics workstream.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 24),
	})

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionRREG,
		CmmiDivision:           &rregDivision,
		RelatedMINTModels:      []uuid.UUID{planWithCrTDLs.ID},
		ContractActivityType:   &learningActivity,
		ContractName:           new("Payment Accountability Research Support"),
		ContractNumber:         new("75FCMC24F0007"),
		ContractType:           &costReimbursement,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCORTranscriptReview, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
		DescribeHelpNeeded:     "Need help reviewing COR documentation and documenting contractor performance for a research support contract.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 20),
	})

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTAL, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterJANE, &model.CTATRequestInput{
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

	s.createCTATRequest(requesterBTMN, &model.CTATRequestInput{
		CmmiGroup:              models.CTATCMMIGroupOptionOther,
		CmmiGroupOther:         &crossCmmiGroupOther,
		RelatedMINTModels:      []uuid.UUID{planWithCrTDLs.ID, planApproachingClearance.ID},
		ContractActivityType:   &learningActivity,
		ContractType:           &costPlusFixedFee,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCORTranscriptReview, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
		DescribeHelpNeeded:     "Requested follow-up support on post-award administration questions and documentation closeout activities.",
		RequestUrgency:         models.CTATRequestUrgencyLow,
		DateAssistanceNeededBy: now.AddDate(0, 0, 7),
	})
}
