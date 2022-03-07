package translation

import (
	"encoding/json"
	"strconv"

	wire "github.com/cmsgov/easi-app/pkg/cedar/intake/gen/models"
	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/models"
)

// TranslatableBusinessCase is a wrapper around our BusinessCase model for translating into the CEDAR Intake API schema
type TranslatableBusinessCase models.BusinessCase

// ObjectID is a unique identifier for a TranslatableAction
func (bc *TranslatableBusinessCase) ObjectID() string {
	return bc.ID.String()
}

// ObjectType is a human-readable identifier for the BusinessCase type, for use in logging
func (bc *TranslatableBusinessCase) ObjectType() string {
	return "business case"
}

// CreateIntakeModel translates a BusinessCase into an IntakeInput
func (bc *TranslatableBusinessCase) CreateIntakeModel() (*wire.IntakeInput, error) {
	obj := intakemodels.EASIBizCase{
		UserEUA:              bc.EUAUserID,
		IntakeID:             bc.SystemIntakeID.String(),
		ProjectName:          bc.ProjectName.ValueOrZero(),
		Requester:            bc.Requester.ValueOrZero(),
		RequesterPhoneNumber: bc.RequesterPhoneNumber.ValueOrZero(),
		BusinessOwner:        bc.BusinessOwner.ValueOrZero(),
		BusinessNeed:         bc.BusinessNeed.ValueOrZero(),
		CmsBenefit:           bc.CMSBenefit.ValueOrZero(),
		PriorityAlignment:    bc.PriorityAlignment.ValueOrZero(),
		SuccessIndicators:    bc.SuccessIndicators.ValueOrZero(),

		AsIsTitle:       bc.AsIsTitle.ValueOrZero(),
		AsIsSummary:     bc.AsIsSummary.ValueOrZero(),
		AsIsPros:        bc.AsIsPros.ValueOrZero(),
		AsIsCons:        bc.AsIsCons.ValueOrZero(),
		AsIsCostSavings: bc.AsIsCons.ValueOrZero(),

		SubmittedAt:        strDateTime(bc.SubmittedAt),
		ArchivedAt:         strDateTime(bc.ArchivedAt),
		InitialSubmittedAt: strDateTime(bc.InitialSubmittedAt),
		LastSubmittedAt:    strDateTime(bc.LastSubmittedAt),

		BusinessSolutions:  []*intakemodels.EASIBusinessSolution{},
		LifecycleCostLines: []*intakemodels.EASILifecycleCost{},
	}

	// build the collection of embedded objects

	// business solutions
	// preferred (required)
	preferredSolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "preferred",
		Title:                   bc.PreferredTitle.ValueOrZero(),
		Summary:                 bc.PreferredSummary.ValueOrZero(),
		AcquisitionApproach:     bc.PreferredAcquisitionApproach.ValueOrZero(),
		SecurityIsApproved:      strNullableBool(bc.PreferredSecurityIsApproved),
		SecurityIsBeingReviewed: bc.PreferredSecurityIsBeingReviewed.ValueOrZero(),
		HostingType:             bc.PreferredHostingType.ValueOrZero(),
		HostingLocation:         bc.PreferredHostingLocation.ValueOrZero(),
		HostingCloudServiceType: bc.PreferredHostingCloudServiceType.ValueOrZero(),
		HasUI:                   bc.PreferredHasUI.ValueOrZero(),
		Pros:                    bc.PreferredPros.ValueOrZero(),
		Cons:                    bc.PreferredCons.ValueOrZero(),
		CostSavings:             bc.PreferredCostSavings.ValueOrZero(),
	}
	obj.BusinessSolutions = append(obj.BusinessSolutions, preferredSolution)

	// TODO: do we need to check if alternative a and b are filled out?
	// what is the best way to do that? need to check each field individually?

	// alternative a (optional)
	alternativeASolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "alternativeA",
		Title:                   bc.AlternativeATitle.ValueOrZero(),
		Summary:                 bc.AlternativeASummary.ValueOrZero(),
		AcquisitionApproach:     bc.AlternativeAAcquisitionApproach.ValueOrZero(),
		SecurityIsApproved:      strNullableBool(bc.AlternativeASecurityIsApproved),
		SecurityIsBeingReviewed: bc.AlternativeASecurityIsBeingReviewed.ValueOrZero(),
		HostingType:             bc.AlternativeAHostingType.ValueOrZero(),
		HostingLocation:         bc.AlternativeAHostingLocation.ValueOrZero(),
		HostingCloudServiceType: bc.AlternativeAHostingCloudServiceType.ValueOrZero(),
		HasUI:                   bc.AlternativeAHasUI.ValueOrZero(),
		Pros:                    bc.AlternativeAPros.ValueOrZero(),
		Cons:                    bc.AlternativeACons.ValueOrZero(),
		CostSavings:             bc.AlternativeACostSavings.ValueOrZero(),
	}
	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeASolution)

	// alternative b (optional)
	alternativeBSolution := &intakemodels.EASIBusinessSolution{
		SolutionType:            "alternativeB",
		Title:                   bc.AlternativeBTitle.ValueOrZero(),
		Summary:                 bc.AlternativeBSummary.ValueOrZero(),
		AcquisitionApproach:     bc.AlternativeBAcquisitionApproach.ValueOrZero(),
		SecurityIsApproved:      strNullableBool(bc.AlternativeBSecurityIsApproved),
		SecurityIsBeingReviewed: bc.AlternativeBSecurityIsBeingReviewed.ValueOrZero(),
		HostingType:             bc.AlternativeBHostingType.ValueOrZero(),
		HostingLocation:         bc.AlternativeBHostingLocation.ValueOrZero(),
		HostingCloudServiceType: bc.AlternativeBHostingCloudServiceType.ValueOrZero(),
		HasUI:                   bc.AlternativeBHasUI.ValueOrZero(),
		Pros:                    bc.AlternativeBPros.ValueOrZero(),
		Cons:                    bc.AlternativeBCons.ValueOrZero(),
		CostSavings:             bc.AlternativeBCostSavings.ValueOrZero(),
	}
	obj.BusinessSolutions = append(obj.BusinessSolutions, alternativeBSolution)

	// lifecycle cost lines
	bcID := bc.ID.String()

	for _, line := range bc.LifecycleCostLines {
		lc := &intakemodels.EASILifecycleCost{
			ID:             bcID,
			BusinessCaseID: bcID,
			Solution:       string(line.Solution),
			Year:           string(line.Year),
		}

		phase := ""
		if line.Phase != nil {
			phase = string(*line.Phase)
		}
		lc.Phase = phase

		cost := ""
		if line.Cost != nil {
			cost = strconv.Itoa(*line.Cost)
		}
		lc.Cost = cost

		obj.LifecycleCostLines = append(obj.LifecycleCostLines, lc)
	}

	blob, err := json.Marshal(&obj)
	if err != nil {
		return nil, err
	}

	result := &wire.IntakeInput{
		ClientID: pStr(bcID),
		Body:     pStr(string(blob)),

		// invariants for this type
		BodyFormat: pStr(wire.IntakeInputBodyFormatJSON),
		Type:       typeStr(intakeInputBizCase),
		Schema:     versionStr(IntakeInputSchemaEASIBizCaseV01),
	}

	if bc.Status == models.BusinessCaseStatusCLOSED {
		result.ClientStatus = statusStr(inputStatusFinal)
	} else {
		result.ClientStatus = statusStr(inputStatusInitiated)
	}

	if bc.CreatedAt != nil {
		result.ClientCreatedDate = pStrfmtDateTime(bc.CreatedAt)
	}
	if bc.UpdatedAt != nil {
		result.ClientLastUpdatedDate = pStrfmtDateTime(bc.UpdatedAt)
	}

	return result, nil
}
