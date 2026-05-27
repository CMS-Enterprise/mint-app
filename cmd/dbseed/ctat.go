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
)

type ctatRequestSeedInput struct {
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
	technicalAssistance := models.CTATContractActivityTypeTechnicalAssistance
	timeAndMaterials := models.CTATContractTypeTimeAndMaterials

	s.createCTATRequest(ctatRequestSeedInput{
		Requester:              requesterBTAL,
		Status:                 models.CTATStatusNew,
		CMMIGroup:              models.CTATCMMIGroupOptionBSG,
		CMMIDivision:           &bsgDivision,
		RelatedModelPlanIDs:    []uuid.UUID{planWithBasics.ID, sampleModelPlan.ID},
		ContractActivityType:   &technicalAssistance,
		ContractName:           stringPtr("CMMI Operational Support Services"),
		ContractNumber:         stringPtr("75FCMC24F0001"),
		ContractType:           &timeAndMaterials,
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeRequestForInformationRfi, models.CTATHelpNeededTypeGuidanceOnMarketResearch},
		DescribeHelpNeeded:     "Need help shaping an RFI package and validating market research assumptions for an upcoming acquisition.",
		RequestUrgency:         models.CTATRequestUrgencyHigh,
		DateAssistanceNeededBy: now.AddDate(0, 0, 14),
		CreatedDts:             now.AddDate(0, 0, -5),
	})

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
		ContractActivityTypeOther: stringPtr("Acquisition strategy support"),
		ContractName:              stringPtr("Population Health Advisory Support"),
		ContractNumber:            stringPtr("75FCMC24F0002"),
		ContractType:              &contractTypeOther,
		ContractTypeOther:         stringPtr("Blanket Purchase Agreement"),
		TypeOfHelpNeeded:          []models.CTATHelpNeededType{models.CTATHelpNeededTypeSowSooPwsDevelopment, models.CTATHelpNeededTypeOther},
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
	learningActivity := models.CTATContractActivityTypeLearning
	costPlusFixedFee := models.CTATContractTypeCostPlusFixedFee

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
		TypeOfHelpNeeded:       []models.CTATHelpNeededType{models.CTATHelpNeededTypeCorTranscriptReview, models.CTATHelpNeededTypeDocumentingAndSubmittingCpars},
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
	helpNeeded := models.EnumArray[models.CTATHelpNeededType](input.TypeOfHelpNeeded)
	var assignedAdminID *uuid.UUID
	if input.AssignedAdmin != nil && input.AssignedAdmin.UserAccount != nil {
		assignedAdminID = &input.AssignedAdmin.UserAccount.ID
	}

	var inserted struct {
		ID                    uuid.UUID `db:"id"`
		HumanReadableIDNumber int       `db:"human_readable_id_number"`
	}

	err = tx.QueryRowx(
		`
			INSERT INTO ctat_request (
				id,
				requester,
				status,
				assigned_admin,
				notes,
				resolution,
				cmmi_group,
				cmmi_group_other,
				cmmi_division,
				cmmi_division_other,
				contract_activity_type,
				contract_activity_type_other,
				contract_name,
				contract_number,
				contract_type,
				contract_type_other,
				type_of_help_needed,
				type_of_help_needed_other,
				describe_help_needed,
				request_urgency,
				date_assistance_needed_by,
				created_by,
				created_dts
			)
			VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
				$13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
			)
			RETURNING id, human_readable_id_number
		`,
		requestID,
		input.Requester.UserAccount.ID,
		input.Status,
		assignedAdminID,
		input.Notes,
		input.Resolution,
		input.CMMIGroup,
		input.CMMIGroupOther,
		input.CMMIDivision,
		input.CMMIDivisionOther,
		input.ContractActivityType,
		input.ContractActivityTypeOther,
		input.ContractName,
		input.ContractNumber,
		input.ContractType,
		input.ContractTypeOther,
		helpNeeded,
		input.TypeOfHelpNeededOther,
		input.DescribeHelpNeeded,
		input.RequestUrgency,
		input.DateAssistanceNeededBy,
		actorUserID,
		input.CreatedDts,
	).StructScan(&inserted)
	if err != nil {
		panic(err)
	}

	for index, modelPlanID := range input.RelatedModelPlanIDs {
		_, err = tx.Exec(
			`
				INSERT INTO ctat_request_model_plan_link (
					id,
					model_plan_id,
					ctat_request_id,
					created_by,
					created_dts
				)
				VALUES ($1, $2, $3, $4, $5)
			`,
			uuid.New(),
			modelPlanID,
			inserted.ID,
			actorUserID,
			input.CreatedDts.Add(time.Duration(index+1)*time.Minute),
		)
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

	return &models.CTATRequest{
		Requester:                 input.Requester.UserAccount.ID,
		Status:                    input.Status,
		Notes:                     input.Notes,
		Resolution:                input.Resolution,
		AssignedAdmin:             assignedAdminID,
		CmmiGroup:                 input.CMMIGroup,
		CmmiGroupOther:            input.CMMIGroupOther,
		CmmiDivision:              input.CMMIDivision,
		CmmiDivisionOther:         input.CMMIDivisionOther,
		ContractActivityType:      input.ContractActivityType,
		ContractActivityTypeOther: input.ContractActivityTypeOther,
		ContractName:              input.ContractName,
		ContractNumber:            input.ContractNumber,
		ContractType:              input.ContractType,
		ContractTypeOther:         input.ContractTypeOther,
		TypeOfHelpNeeded:          helpNeeded,
		TypeOfHelpNeededOther:     input.TypeOfHelpNeededOther,
		DescribeHelpNeeded:        input.DescribeHelpNeeded,
		RequestUrgency:            input.RequestUrgency,
		DateAssistanceNeededBy:    input.DateAssistanceNeededBy,
		HumanReadableIDNumber:     inserted.HumanReadableIDNumber,
	}
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

	_, err = tx.Exec(
		`
			INSERT INTO ctat_request_document (
				id,
				ctat_request_id,
				file_type,
				bucket,
				file_key,
				virus_scanned,
				virus_clean,
				restricted,
				file_name,
				file_size,
				created_by,
				created_dts
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		`,
		uuid.New(),
		ctatRequestID,
		input.ContentType,
		*s.Config.S3Client.GetBucket(),
		fileKey,
		input.Scanned,
		virusClean,
		input.Restricted,
		input.FileName,
		int(fileStats.Size()),
		actorUserID,
		createdDts,
	)
	return err
}

func stringPtr(val string) *string {
	return &val
}
