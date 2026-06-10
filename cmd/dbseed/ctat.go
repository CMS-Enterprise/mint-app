package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type ctatRequestDocumentSeedInput struct {
	FileName    string
	FilePath    string
	ContentType string
	Restricted  bool
	Scanned     bool
	VirusFound  bool
}

var seededCTATRequestID = uuid.MustParse("00000000-0000-0000-0000-000000000021")

func seededCTATRequest(requesterID uuid.UUID, createdDts time.Time) *models.CTATRequest {
	request := models.NewCTATRequest(requesterID, requesterID)
	request.CreatedDts = createdDts

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
	adminCTAT := s.getTestPrincipalByUsername("ADMI")
	requesterBTALID := requesterBTAL.UserAccount.ID
	requesterJANEID := requesterJANE.UserAccount.ID
	requesterBTMNID := requesterBTMN.UserAccount.ID
	adminCTATID := adminCTAT.UserAccount.ID

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

	firstRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -5))
	firstRequest.ID = seededCTATRequestID
	firstRequest.Status = models.CTATStatusNew
	firstRequest.CmmiGroup = models.CTATCMMIGroupOptionBSG
	firstRequest.CmmiDivision = &bsgDivision
	firstRequest.ContractActivityType = &technicalAssistance
	firstRequest.ContractName = new("CMMI Operational Support Services")
	firstRequest.ContractNumber = new("75FCMC24F0001")
	firstRequest.ContractType = &timeAndMaterials
	firstRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeRequestForInformationRFI,
		models.CTATHelpNeededTypeGuidanceOnMarketResearch,
	}
	firstRequest.DescribeHelpNeeded = "Need help shaping an RFI package and validating market research assumptions for an upcoming acquisition."
	firstRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	firstRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 14)
	s.createCTATRequest(firstRequest, []uuid.UUID{planWithBasics.ID, sampleModelPlan.ID}, nil)

	btALAssignedNotes := "Assigned to CTAT admin for follow-up on acquisition package sequencing."
	secondRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -4))
	secondRequest.AssignedAdmin = &adminCTATID
	secondRequest.Status = models.CTATStatusAssigned
	secondRequest.Notes = &btALAssignedNotes
	secondRequest.CmmiGroup = models.CTATCMMIGroupOptionLDG
	secondRequest.CmmiDivision = &ldgDivision
	secondRequest.ContractActivityType = &implementationActivity
	secondRequest.ContractName = new("Learning Systems Implementation Support")
	secondRequest.ContractNumber = new("75FCMC24F0003")
	secondRequest.ContractType = &firmFixedPrice
	secondRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeRequestForProposalRFP,
		models.CTATHelpNeededTypeSOWSOOPWSDevelopment,
	}
	secondRequest.DescribeHelpNeeded = "Need help reviewing the draft RFP package and refining the performance work statement before release."
	secondRequest.RequestUrgency = models.CTATRequestUrgencyMedium
	secondRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 21)
	s.createCTATRequest(secondRequest, []uuid.UUID{planWithDocuments.ID}, nil)

	btALInProgressNotes := "CTAT is actively coordinating follow-up guidance with the requester."
	thirdRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -2))
	thirdRequest.AssignedAdmin = &adminCTATID
	thirdRequest.Status = models.CTATStatusInProgress
	thirdRequest.Notes = &btALInProgressNotes
	thirdRequest.CmmiGroup = models.CTATCMMIGroupOptionSCMG
	thirdRequest.CmmiDivision = &scmgDivision
	thirdRequest.ContractActivityType = &evaluationActivity
	thirdRequest.ContractName = new("Seamless Care Financial Risk Advisory")
	thirdRequest.ContractNumber = new("75FCMC24F0004")
	thirdRequest.ContractType = &costReimbursement
	thirdRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeDataUseAgreementDUA,
		models.CTATHelpNeededTypeInvoiceProcessingPlatformIPP,
	}
	thirdRequest.DescribeHelpNeeded = "Looking for hands-on support with post-award administration questions and a related data use agreement workflow."
	thirdRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	thirdRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 10)
	s.createCTATRequest(thirdRequest, []uuid.UUID{planApproachingClearance.ID}, nil)

	fourthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -12))
	fourthRequest.Status = models.CTATStatusNew
	fourthRequest.CmmiGroup = models.CTATCMMIGroupOptionPCMG
	fourthRequest.CmmiDivision = &pcmgDivision
	fourthRequest.ContractActivityType = &implementationActivity
	fourthRequest.ContractName = new("Primary Care Analytics Support")
	fourthRequest.ContractNumber = new("75FCMC24F0005")
	fourthRequest.ContractType = &firmFixedPrice
	fourthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeRequestForQuotationRFQ,
		models.CTATHelpNeededTypeIndependentGovernmentCostEstimateIGCEPreparation,
	}
	fourthRequest.DescribeHelpNeeded = "Need help preparing an RFQ package and independent government cost estimate for a primary care-focused effort."
	fourthRequest.RequestUrgency = models.CTATRequestUrgencyLow
	fourthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 28)
	s.createCTATRequest(fourthRequest, []uuid.UUID{sampleModelPlan.ID}, nil)

	fifthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -11))
	fifthRequest.AssignedAdmin = &adminCTATID
	fifthRequest.Status = models.CTATStatusAssigned
	fifthRequest.Notes = new("Queued for admin review on the next CTAT intake cycle.")
	fifthRequest.CmmiGroup = models.CTATCMMIGroupOptionPPG
	fifthRequest.CmmiDivision = &ppgDataDivision
	fifthRequest.ContractActivityType = &evaluationActivity
	fifthRequest.ContractName = new("Data Analytics Advisory BPA")
	fifthRequest.ContractNumber = new("75FCMC24F0006")
	fifthRequest.ContractType = &timeAndMaterials
	fifthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeContractCostReviewCCRProcessing,
		models.CTATHelpNeededTypeGuidanceOnMarketResearch,
	}
	fifthRequest.DescribeHelpNeeded = "Looking for guidance on market research and a contract cost review tied to an analytics workstream."
	fifthRequest.RequestUrgency = models.CTATRequestUrgencyMedium
	fifthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 24)
	s.createCTATRequest(fifthRequest, []uuid.UUID{planWithBasics.ID}, nil)

	sixthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -10))
	sixthRequest.AssignedAdmin = &adminCTATID
	sixthRequest.Status = models.CTATStatusInProgress
	sixthRequest.Notes = new("Working session scheduled with CTAT to review administration questions.")
	sixthRequest.CmmiGroup = models.CTATCMMIGroupOptionRREG
	sixthRequest.CmmiDivision = &rregDivision
	sixthRequest.ContractActivityType = &learningActivity
	sixthRequest.ContractName = new("Payment Accountability Research Support")
	sixthRequest.ContractNumber = new("75FCMC24F0007")
	sixthRequest.ContractType = &costReimbursement
	sixthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeCORTranscriptReview,
		models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS,
	}
	sixthRequest.DescribeHelpNeeded = "Need help reviewing COR documentation and documenting contractor performance for a research support contract."
	sixthRequest.RequestUrgency = models.CTATRequestUrgencyMedium
	sixthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 20)
	s.createCTATRequest(sixthRequest, []uuid.UUID{planWithCrTDLs.ID}, nil)

	seventhRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -9))
	seventhRequest.AssignedAdmin = &adminCTATID
	seventhRequest.Status = models.CTATStatusClosed
	seventhRequest.Notes = new("Closed after CTAT delivered closeout guidance.")
	seventhRequest.Resolution = new("Provided written post-award guidance and resolved the request.")
	seventhRequest.CmmiGroup = models.CTATCMMIGroupOptionSPHG
	seventhRequest.CmmiDivision = &sphgDivision
	seventhRequest.ContractActivityType = &technicalAssistance
	seventhRequest.ContractName = new("Health Care Delivery Advisory")
	seventhRequest.ContractNumber = new("75FCMC24F0008")
	seventhRequest.ContractType = &costPlusFixedFee
	seventhRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypePoliticalAppointeeApprovalPAAModification,
		models.CTATHelpNeededTypeMaintainingTheElectronicCorECORFile,
	}
	seventhRequest.DescribeHelpNeeded = "Needed follow-up support on political appointee approval and electronic COR documentation maintenance."
	seventhRequest.RequestUrgency = models.CTATRequestUrgencyLow
	seventhRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 18)
	s.createCTATRequest(seventhRequest, []uuid.UUID{planApproachingClearance.ID}, nil)

	eighthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -8))
	eighthRequest.Status = models.CTATStatusNew
	eighthRequest.CmmiGroup = models.CTATCMMIGroupOptionSCMG
	eighthRequest.CmmiDivision = &scmgInfraDivision
	eighthRequest.ContractActivityType = &implementationActivity
	eighthRequest.ContractName = new("Seamless Infrastructure Support")
	eighthRequest.ContractNumber = new("75FCMC24F0009")
	eighthRequest.ContractType = &incentiveContract
	eighthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeCalmSystemRequisitionSupport,
		models.CTATHelpNeededTypeIdentityAndCredentialingToolICT,
	}
	eighthRequest.DescribeHelpNeeded = "Need intake support for a requisition and identity/credentialing setup guidance for a new support effort."
	eighthRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	eighthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 16)
	s.createCTATRequest(eighthRequest, []uuid.UUID{planWithDocuments.ID}, nil)

	ninthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -7))
	ninthRequest.AssignedAdmin = &adminCTATID
	ninthRequest.Status = models.CTATStatusAssigned
	ninthRequest.Notes = new("Pending requester confirmation on technical evaluation panel membership.")
	ninthRequest.CmmiGroup = models.CTATCMMIGroupOptionBSG
	ninthRequest.CmmiDivision = &bsgTechDivision
	ninthRequest.ContractActivityType = &evaluationActivity
	ninthRequest.ContractName = new("Technology Solutions Advisory")
	ninthRequest.ContractNumber = new("75FCMC24F0010")
	ninthRequest.ContractType = &firmFixedPrice
	ninthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeGuidanceOnTEPMembershipScoringReporting,
		models.CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDF,
	}
	ninthRequest.DescribeHelpNeeded = "Requested CTAT guidance on technical evaluation panel setup and required determinations and findings documentation."
	ninthRequest.RequestUrgency = models.CTATRequestUrgencyMedium
	ninthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 12)
	s.createCTATRequest(ninthRequest, []uuid.UUID{planWithBasics.ID, planWithDocuments.ID}, nil)

	tenthRequest := seededCTATRequest(requesterBTALID, now.AddDate(0, 0, -6))
	tenthRequest.AssignedAdmin = &adminCTATID
	tenthRequest.Status = models.CTATStatusInProgress
	tenthRequest.Notes = new("CTAT is refining draft language with the requester before package submission.")
	tenthRequest.CmmiGroup = models.CTATCMMIGroupOptionLDG
	tenthRequest.CmmiDivision = &ldgAnalysisDivision
	tenthRequest.ContractActivityType = &learningActivity
	tenthRequest.ContractName = new("Analysis and Networks Advisory")
	tenthRequest.ContractNumber = new("75FCMC24F0011")
	tenthRequest.ContractType = &timeAndMaterials
	tenthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeRequestForContractMemoRFC,
		models.CTATHelpNeededTypeDefiningAndDocumentingContractRequirements,
	}
	tenthRequest.DescribeHelpNeeded = "Need support refining contract requirements and drafting a request for contract memo for a learning support engagement."
	tenthRequest.RequestUrgency = models.CTATRequestUrgencyHigh
	tenthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 9)
	s.createCTATRequest(tenthRequest, []uuid.UUID{sampleModelPlan.ID, planApproachingClearance.ID}, nil)

	ppgDivisionOther := "Division of Innovation Partnerships (PPG/DIP)"
	ppgGroup := models.CTATCMMIGroupOptionPPG
	ppgDivision := models.CTATCMMIDivisionOptionOther
	contractActivityOther := models.CTATContractActivityTypeOther
	contractTypeOther := models.CTATContractTypeOther
	assignedNotes := "Initial intake completed. Waiting on admin review for next-step guidance."
	typeOfHelpNeededOther := "Assistance drafting evaluation criteria for a new workstream"

	eleventhRequest := seededCTATRequest(requesterJANEID, now.AddDate(0, 0, -3))
	eleventhRequest.AssignedAdmin = &adminCTATID
	eleventhRequest.Status = models.CTATStatusAssigned
	eleventhRequest.Notes = &assignedNotes
	eleventhRequest.CmmiGroup = ppgGroup
	eleventhRequest.CmmiDivision = &ppgDivision
	eleventhRequest.CmmiDivisionOther = &ppgDivisionOther
	eleventhRequest.ContractActivityType = &contractActivityOther
	eleventhRequest.ContractActivityTypeOther = new("Acquisition strategy support")
	eleventhRequest.ContractName = new("Population Health Advisory Support")
	eleventhRequest.ContractNumber = new("75FCMC24F0002")
	eleventhRequest.ContractType = &contractTypeOther
	eleventhRequest.ContractTypeOther = new("Blanket Purchase Agreement")
	eleventhRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeSOWSOOPWSDevelopment,
		models.CTATHelpNeededTypeOther,
	}
	eleventhRequest.TypeOfHelpNeededOther = &typeOfHelpNeededOther
	eleventhRequest.DescribeHelpNeeded = "Looking for support drafting a statement of work and evaluating acquisition options for a policy-focused engagement."
	eleventhRequest.RequestUrgency = models.CTATRequestUrgencyMedium
	eleventhRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 30)
	s.createCTATRequest(
		eleventhRequest,
		[]uuid.UUID{planWithDocuments.ID},
		[]ctatRequestDocumentSeedInput{
			{
				FileName:    "ctat-assigned-request.pdf",
				FilePath:    "cmd/dbseed/data/sample.pdf",
				ContentType: "application/pdf",
				Restricted:  false,
				Scanned:     true,
				VirusFound:  false,
			},
		},
	)

	crossCmmiGroupOther := "Cross-CMMI Strategic Operations"
	closedResolution := "Provided consultation, shared follow-up guidance, and closed the request after confirming the team had what it needed."
	closedNotes := "Resolved during weekly CTAT office hours."

	twelfthRequest := seededCTATRequest(requesterBTMNID, now.AddDate(0, 0, -1))
	twelfthRequest.AssignedAdmin = &adminCTATID
	twelfthRequest.Status = models.CTATStatusClosed
	twelfthRequest.Notes = &closedNotes
	twelfthRequest.Resolution = &closedResolution
	twelfthRequest.CmmiGroup = models.CTATCMMIGroupOptionOther
	twelfthRequest.CmmiGroupOther = &crossCmmiGroupOther
	twelfthRequest.ContractActivityType = &learningActivity
	twelfthRequest.ContractType = &costPlusFixedFee
	twelfthRequest.TypeOfHelpNeeded = models.EnumArray[models.CTATHelpNeededType]{
		models.CTATHelpNeededTypeCORTranscriptReview,
		models.CTATHelpNeededTypeDocumentingAndSubmittingCPARS,
	}
	twelfthRequest.DescribeHelpNeeded = "Requested follow-up support on post-award administration questions and documentation closeout activities."
	twelfthRequest.RequestUrgency = models.CTATRequestUrgencyLow
	twelfthRequest.DateAssistanceNeededBy = now.AddDate(0, 0, 7)
	s.createCTATRequest(twelfthRequest, []uuid.UUID{planWithCrTDLs.ID, planApproachingClearance.ID}, nil)
}

func (s *Seeder) createCTATRequest(
	request *models.CTATRequest,
	relatedModelPlanIDs []uuid.UUID,
	supportingDocuments []ctatRequestDocumentSeedInput,
) *models.CTATRequest {
	if request == nil {
		panic("ctat request seed requires a request")
	}

	if request.Requester == uuid.Nil {
		panic("ctat request seed requires a requester ID")
	}

	tx, err := s.Config.Store.Beginx()
	if err != nil {
		panic(err)
	}
	defer tx.Rollback()

	actorUserID := request.CreatedBy
	if actorUserID == uuid.Nil {
		actorUserID = request.Requester
		request.CreatedBy = actorUserID
	}

	_, err = tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, utilitysql.CreateUserIDQueryMap(actorUserID))
	if err != nil {
		panic(err)
	}

	inserted, err := storage.CTATRequestCreate(tx, request)
	if err != nil {
		panic(err)
	}

	for index, modelPlanID := range relatedModelPlanIDs {
		link := &models.CTATRequestModelPlanLink{}
		link.ModelPlanID = modelPlanID
		link.CTATRequestID = inserted.ID
		link.CreatedBy = actorUserID
		link.CreatedDts = request.CreatedDts.Add(time.Duration(index+1) * time.Minute)

		_, err = storage.CTATRequestModelPlanLinkCreate(tx, link)
		if err != nil {
			panic(err)
		}
	}

	for index, doc := range supportingDocuments {
		if err := s.createCTATRequestDocument(tx, inserted.ID, actorUserID, request.CreatedDts.Add(time.Duration(index+1)*time.Minute), doc); err != nil {
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
