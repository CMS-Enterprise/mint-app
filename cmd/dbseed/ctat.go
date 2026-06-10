package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type ctatRequestSeedInput struct {
	RequestID                 *uuid.UUID
	Requester                 *authentication.ApplicationPrincipal
	AssignedAdmin             *authentication.ApplicationPrincipal
	Status                    models.CTATStatus
	Notes                     *string
	Resolution                *string
	CMMIGroup                 models.CTATCMMIGroupOption
	CMMIGroupOther            *string
	CMMIDivision              *models.CTATCMMIDivisionOption
	CMMIDivisionOther         *string
	RelatedModelPlanIDs       []uuid.UUID
	ContractActivityType      *models.CTATContractActivityType
	ContractActivityTypeOther *string
	ContractName              *string
	ContractNumber            *string
	ContractType              *models.CTATContractType
	ContractTypeOther         *string
	TypeOfHelpNeeded          []models.CTATHelpNeededType
	TypeOfHelpNeededOther     *string
	DescribeHelpNeeded        string
	RequestUrgency            models.CTATRequestUrgency
	DateAssistanceNeededBy    time.Time
	CreatedDts                time.Time
	SupportingDocuments       []ctatRequestDocumentSeedInput
}

type ctatRequestDocumentSeedInput struct {
	FileName    string
	FilePath    string
	ContentType string
	Restricted  bool
	Scanned     bool
	VirusFound  bool
}

var seededCTATRequestID = uuid.MustParse("00000000-0000-0000-0000-000000000021")

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
	adminCTAT := s.getTestPrincipalByUsername("ADMI")

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

	s.createCTATRequest(ctatRequestSeedInput{
		RequestID:              &seededCTATRequestID,
		Requester:              requesterBTAL,
		Status:                 models.CTATStatusNew,
		CMMIGroup:              models.CTATCMMIGroupOptionBSG,
		CMMIDivision:           &bsgDivision,
		RelatedModelPlanIDs:    []uuid.UUID{planWithBasics.ID, sampleModelPlan.ID},
		ContractActivityType:   &technicalAssistance,
		ContractName:           new("CMMI Operational Support Services"),
		ContractNumber:         new("75FCMC24F0001"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRFI, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
		DescribeHelpNeeded:     "Need help shaping an RFI package and validating market research assumptions for an upcoming acquisition.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 14),
		CreatedDts:             now.AddDate(0, 0, -5),
	})

	btALAssignedNotes := "Assigned to CTAT admin for follow-up on acquisition package sequencing."
	s.createCTATRequest(ctatRequestSeedInput{
		Requester:              requesterBTAL,
		AssignedAdmin:          adminCTAT,
		Status:                 models.CTATStatusAssigned,
		Notes:                  &btALAssignedNotes,
		CMMIGroup:              models.CTATCMMIGroupOptionLDG,
		CMMIDivision:           &ldgDivision,
		RelatedModelPlanIDs:    []uuid.UUID{planWithDocuments.ID},
		ContractActivityType:   &implementationActivity,
		ContractName:           new("Learning Systems Implementation Support"),
		ContractNumber:         new("75FCMC24F0003"),
		ContractType:           &firmFixedPrice,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForProposalRFP, models.CTATHelpNeededTypeSOWSOOPWSDevelopment},
		DescribeHelpNeeded:     "Need help reviewing the draft RFP package and refining the performance work statement before release.",
		RequestUrgency:         models.CTATRequestUrgencyMedium,
		DateAssistanceNeededBy: now.AddDate(0, 0, 21),
		CreatedDts:             now.AddDate(0, 0, -4),
	})

	btALInProgressNotes := "CTAT is actively coordinating follow-up guidance with the requester."
	s.createCTATRequest(ctatRequestSeedInput{
		Requester:              requesterBTAL,
		AssignedAdmin:          adminCTAT,
		Status:                 models.CTATStatusInProgress,
		Notes:                  &btALInProgressNotes,
		CMMIGroup:              models.CTATCMMIGroupOptionSCMG,
		CMMIDivision:           &scmgDivision,
		RelatedModelPlanIDs:    []uuid.UUID{planApproachingClearance.ID},
		ContractActivityType:   &evaluationActivity,
		ContractName:           new("Seamless Care Financial Risk Advisory"),
		ContractNumber:         new("75FCMC24F0004"),
		ContractType:           &costReimbursement,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeDataUseAgreementDUA, models.CTATHelpNeededTypeInvoiceProcessingPlatformIPP},
		DescribeHelpNeeded:     "Looking for hands-on support with post-award administration questions and a related data use agreement workflow.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 10),
		CreatedDts:             now.AddDate(0, 0, -2),
	})

	btALMoreRequests := []ctatRequestSeedInput{
		{
			Requester:              requesterBTAL,
			Status:                 models.CTATStatusNew,
			CMMIGroup:              models.CTATCMMIGroupOptionPCMG,
			CMMIDivision:           &pcmgDivision,
			RelatedModelPlanIDs:    []uuid.UUID{sampleModelPlan.ID},
			ContractActivityType:   &implementationActivity,
			ContractName:           new("Primary Care Analytics Support"),
			ContractNumber:         new("75FCMC24F0005"),
			ContractType:           &firmFixedPrice,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForQuotationRFQ, models.CTATHelpNeededTypeIndependentGovernmentCostEstimateIGCEPreparation},
			DescribeHelpNeeded:     "Need help preparing an RFQ package and independent government cost estimate for a primary care-focused effort.",
			RequestUrgency:         models.CTATRequestUrgencyLow,
			DateAssistanceNeededBy: now.AddDate(0, 0, 28),
			CreatedDts:             now.AddDate(0, 0, -12),
		},
		{
			Requester:              requesterBTAL,
			AssignedAdmin:          adminCTAT,
			Status:                 models.CTATStatusAssigned,
			Notes:                  new("Queued for admin review on the next CTAT intake cycle."),
			CMMIGroup:              models.CTATCMMIGroupOptionPPG,
			CMMIDivision:           &ppgDataDivision,
			RelatedModelPlanIDs:    []uuid.UUID{planWithBasics.ID},
			ContractActivityType:   &evaluationActivity,
			ContractName:           new("Data Analytics Advisory BPA"),
			ContractNumber:         new("75FCMC24F0006"),
			ContractType:           &timeAndMaterials,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeContractChangeRequestCCRProcessing, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
			DescribeHelpNeeded:     "Looking for guidance on market research and a contract change request tied to an analytics workstream.",
			RequestUrgency:         models.CTATRequestUrgencyMedium,
			DateAssistanceNeededBy: now.AddDate(0, 0, 24),
			CreatedDts:             now.AddDate(0, 0, -11),
		},
		{
			Requester:              requesterBTAL,
			AssignedAdmin:          adminCTAT,
			Status:                 models.CTATStatusInProgress,
			Notes:                  new("Working session scheduled with CTAT to review administration questions."),
			CMMIGroup:              models.CTATCMMIGroupOptionRREG,
			CMMIDivision:           &rregDivision,
			RelatedModelPlanIDs:    []uuid.UUID{planWithCrTDLs.ID},
			ContractActivityType:   &learningActivity,
			ContractName:           new("Payment Accountability Research Support"),
			ContractNumber:         new("75FCMC24F0007"),
			ContractType:           &costReimbursement,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCORTranscriptReview, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
			DescribeHelpNeeded:     "Need help reviewing COR documentation and documenting contractor performance for a research support contract.",
			RequestUrgency:         models.CTATRequestUrgencyMedium,
			DateAssistanceNeededBy: now.AddDate(0, 0, 20),
			CreatedDts:             now.AddDate(0, 0, -10),
		},
		{
			Requester:              requesterBTAL,
			AssignedAdmin:          adminCTAT,
			Status:                 models.CTATStatusClosed,
			Notes:                  new("Closed after CTAT delivered closeout guidance."),
			Resolution:             new("Provided written post-award guidance and resolved the request."),
			CMMIGroup:              models.CTATCMMIGroupOptionSPHG,
			CMMIDivision:           &sphgDivision,
			RelatedModelPlanIDs:    []uuid.UUID{planApproachingClearance.ID},
			ContractActivityType:   &technicalAssistance,
			ContractName:           new("Health Care Delivery Advisory"),
			ContractNumber:         new("75FCMC24F0008"),
			ContractType:           &costPlusFixedFee,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypePostAwardActionsPAAModification, models.CTATHelpNeededTypeMaintainingTheElectronicCorECORFile},
			DescribeHelpNeeded:     "Needed follow-up support on post-award actions and electronic COR documentation maintenance.",
			RequestUrgency:         models.CTATRequestUrgencyLow,
			DateAssistanceNeededBy: now.AddDate(0, 0, 18),
			CreatedDts:             now.AddDate(0, 0, -9),
		},
		{
			Requester:              requesterBTAL,
			Status:                 models.CTATStatusNew,
			CMMIGroup:              models.CTATCMMIGroupOptionSCMG,
			CMMIDivision:           &scmgInfraDivision,
			RelatedModelPlanIDs:    []uuid.UUID{planWithDocuments.ID},
			ContractActivityType:   &implementationActivity,
			ContractName:           new("Seamless Infrastructure Support"),
			ContractNumber:         new("75FCMC24F0009"),
			ContractType:           &incentiveContract,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCalmSystemRequisitionSupport, models.CTATHelpNeededTypeIdentityAndCredentialingToolICT},
			DescribeHelpNeeded:     "Need intake support for a requisition and identity/credentialing setup guidance for a new support effort.",
			RequestUrgency:         models.CTATRequestUrgencyHigh,
			DateAssistanceNeededBy: now.AddDate(0, 0, 16),
			CreatedDts:             now.AddDate(0, 0, -8),
		},
		{
			Requester:              requesterBTAL,
			AssignedAdmin:          adminCTAT,
			Status:                 models.CTATStatusAssigned,
			Notes:                  new("Pending requester confirmation on technical evaluation panel membership."),
			CMMIGroup:              models.CTATCMMIGroupOptionBSG,
			CMMIDivision:           &bsgTechDivision,
			RelatedModelPlanIDs:    []uuid.UUID{planWithBasics.ID, planWithDocuments.ID},
			ContractActivityType:   &evaluationActivity,
			ContractName:           new("Technology Solutions Advisory"),
			ContractNumber:         new("75FCMC24F0010"),
			ContractType:           &firmFixedPrice,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeGuidanceOnTEPMembershipScoringReporting, models.CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDF},
			DescribeHelpNeeded:     "Requested CTAT guidance on technical evaluation panel setup and required determinations and findings documentation.",
			RequestUrgency:         models.CTATRequestUrgencyMedium,
			DateAssistanceNeededBy: now.AddDate(0, 0, 12),
			CreatedDts:             now.AddDate(0, 0, -7),
		},
		{
			Requester:              requesterBTAL,
			AssignedAdmin:          adminCTAT,
			Status:                 models.CTATStatusInProgress,
			Notes:                  new("CTAT is refining draft language with the requester before package submission."),
			CMMIGroup:              models.CTATCMMIGroupOptionLDG,
			CMMIDivision:           &ldgAnalysisDivision,
			RelatedModelPlanIDs:    []uuid.UUID{sampleModelPlan.ID, planApproachingClearance.ID},
			ContractActivityType:   &learningActivity,
			ContractName:           new("Analysis and Networks Advisory"),
			ContractNumber:         new("75FCMC24F0011"),
			ContractType:           &timeAndMaterials,
			TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForContractMemoRFC, models.CTATHelpNeededTypeDefiningAndDocumentingContractRequirements},
			DescribeHelpNeeded:     "Need support refining contract requirements and drafting a request for contract memo for a learning support engagement.",
			RequestUrgency:         models.CTATRequestUrgencyHigh,
			DateAssistanceNeededBy: now.AddDate(0, 0, 9),
			CreatedDts:             now.AddDate(0, 0, -6),
		},
	}

	for _, request := range btALMoreRequests {
		s.createCTATRequest(request)
	}

	ppgDivisionOther := "Division of Innovation Partnerships (PPG/DIP)"
	ppgGroup := models.CTATCMMIGroupOptionPPG
	ppgDivision := models.CTATCMMIDivisionOptionOther
	contractActivityOther := models.CTATContractActivityTypeOther
	contractTypeOther := models.CTATContractTypeOther
	assignedNotes := "Initial intake completed. Waiting on admin review for next-step guidance."
	typeOfHelpNeededOther := "Assistance drafting evaluation criteria for a new workstream"

	s.createCTATRequest(ctatRequestSeedInput{
		Requester:                 requesterJANE,
		AssignedAdmin:             adminCTAT,
		Status:                    models.CTATStatusAssigned,
		Notes:                     &assignedNotes,
		CMMIGroup:                 ppgGroup,
		CMMIDivision:              &ppgDivision,
		CMMIDivisionOther:         &ppgDivisionOther,
		RelatedModelPlanIDs:       []uuid.UUID{planWithDocuments.ID},
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
		CreatedDts:                now.AddDate(0, 0, -3),
		SupportingDocuments: []ctatRequestDocumentSeedInput{
			{
				FileName:    "ctat-assigned-request.pdf",
				FilePath:    "cmd/dbseed/data/sample.pdf",
				ContentType: "application/pdf",
				Restricted:  false,
				Scanned:     true,
				VirusFound:  false,
			},
		},
	})

	crossCmmiGroupOther := "Cross-CMMI Strategic Operations"
	closedResolution := "Provided consultation, shared follow-up guidance, and closed the request after confirming the team had what it needed."
	closedNotes := "Resolved during weekly CTAT office hours."

	s.createCTATRequest(ctatRequestSeedInput{
		Requester:              requesterBTMN,
		AssignedAdmin:          adminCTAT,
		Status:                 models.CTATStatusClosed,
		Notes:                  &closedNotes,
		Resolution:             &closedResolution,
		CMMIGroup:              models.CTATCMMIGroupOptionOther,
		CMMIGroupOther:         &crossCmmiGroupOther,
		RelatedModelPlanIDs:    []uuid.UUID{planWithCrTDLs.ID, planApproachingClearance.ID},
		ContractActivityType:   &learningActivity,
		ContractType:           &costPlusFixedFee,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCORTranscriptReview, models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS},
		DescribeHelpNeeded:     "Requested follow-up support on post-award administration questions and documentation closeout activities.",
		RequestUrgency:         models.CTATRequestUrgencyLow,
		DateAssistanceNeededBy: now.AddDate(0, 0, 7),
		CreatedDts:             now.AddDate(0, 0, -1),
	})
}

func (s *Seeder) createCTATRequest(input ctatRequestSeedInput) *models.CTATRequest {
	if input.Requester == nil || input.Requester.UserAccount == nil {
		panic("ctat request seed requires a requester user account")
	}

	tx, err := s.Config.Store.Beginx()
	if err != nil {
		panic(err)
	}
	defer tx.Rollback()

	actorUserID := input.Requester.UserAccount.ID
	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(actorUserID))
	if err != nil {
		panic(err)
	}

	requestID := uuid.New()
	if input.RequestID != nil {
		requestID = *input.RequestID
	}
	helpNeeded := models.EnumArray[models.CTATHelpNeededType](input.TypeOfHelpNeeded)
	var assignedAdminID *uuid.UUID
	if input.AssignedAdmin != nil && input.AssignedAdmin.UserAccount != nil {
		assignedAdminID = &input.AssignedAdmin.UserAccount.ID
	}

	request := models.NewCTATRequest(actorUserID, input.Requester.UserAccount.ID)
	request.ID = requestID
	request.Status = input.Status
	request.AssignedAdmin = assignedAdminID
	request.Notes = input.Notes
	request.Resolution = input.Resolution
	request.CmmiGroup = input.CMMIGroup
	request.CmmiGroupOther = input.CMMIGroupOther
	request.CmmiDivision = input.CMMIDivision
	request.CmmiDivisionOther = input.CMMIDivisionOther
	request.ContractActivityType = input.ContractActivityType
	request.ContractActivityTypeOther = input.ContractActivityTypeOther
	request.ContractName = input.ContractName
	request.ContractNumber = input.ContractNumber
	request.ContractType = input.ContractType
	request.ContractTypeOther = input.ContractTypeOther
	request.TypeOfHelpNeeded = helpNeeded
	request.TypeOfHelpNeededOther = input.TypeOfHelpNeededOther
	request.DescribeHelpNeeded = input.DescribeHelpNeeded
	request.RequestUrgency = input.RequestUrgency
	request.DateAssistanceNeededBy = input.DateAssistanceNeededBy
	request.CreatedDts = input.CreatedDts

	inserted, err := storage.CTATRequestCreate(tx, request)
	if err != nil {
		panic(err)
	}

	for index, modelPlanID := range input.RelatedModelPlanIDs {
		link := &models.CTATRequestModelPlanLink{}
		link.ModelPlanID = modelPlanID
		link.CTATRequestID = inserted.ID
		link.CreatedBy = actorUserID
		link.CreatedDts = input.CreatedDts.Add(time.Duration(index+1) * time.Minute)

		_, err = storage.CTATRequestModelPlanLinkCreate(tx, link)
		if err != nil {
			panic(err)
		}
	}

	for index, doc := range input.SupportingDocuments {
		if err := s.createCTATRequestDocument(tx, inserted.ID, actorUserID, input.CreatedDts.Add(time.Duration(index+1)*time.Minute), doc); err != nil {
			panic(err)
		}
	}

	if err := tx.Commit(); err != nil {
		panic(err)
	}

	return inserted
}

func (s *Seeder) createCTATRequestDocument(
	tx *sqlx.Tx,
	ctatRequestID uuid.UUID,
	actorUserID uuid.UUID,
	createdDts time.Time,
	input ctatRequestDocumentSeedInput,
) error {
	absPath, err := filepath.Abs(input.FilePath)
	if err != nil {
		return err
	}

	file, err := os.Open(absPath) // #nosec
	if err != nil {
		return err
	}
	defer file.Close()

	fileStats, err := file.Stat()
	if err != nil {
		return err
	}

	fileKey := fmt.Sprintf("seed/ctat/%s/%s", ctatRequestID.String(), input.FileName)
	if err := s.Config.S3Client.UploadFile(context.TODO(), file, fileKey); err != nil {
		return err
	}

	if input.Scanned {
		avStatus := "CLEAN"
		if input.VirusFound {
			avStatus = "INFECTED"
		}
		if err := s.Config.S3Client.SetTagValueForKey(context.TODO(), fileKey, "av-status", avStatus); err != nil {
			return err
		}
	}

	virusClean := input.Scanned && !input.VirusFound

	doc := &models.CTATRequestDocument{
		FileType:     input.ContentType,
		Bucket:       *s.Config.S3Client.GetBucket(),
		FileKey:      fileKey,
		VirusScanned: input.Scanned,
		VirusClean:   virusClean,
		Restricted:   input.Restricted,
		FileName:     input.FileName,
		FileSize:     int(fileStats.Size()),
	}
	doc.CTATRequestID = ctatRequestID
	doc.CreatedBy = actorUserID
	doc.CreatedDts = createdDts

	_, err = storage.CTATRequestDocumentCreate(tx, doc)
	return err
}
