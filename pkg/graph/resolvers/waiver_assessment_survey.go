package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// WaiverAssessmentSurveyGetByModelPlanID returns a stub WaiverAssessmentSurvey for a model plan.
// TODO: replace with dataloader once waiver_assessment_survey DB table is built.
func WaiverAssessmentSurveyGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	principal := appcontext.Principal(ctx)
	survey := models.NewWaiverAssessmentSurvey(principal.Account().ID, modelPlanID)
	survey.CreatedDts = time.Now()
	return survey, nil
}

// WaiverAssessmentSurveyUpdate updates a waiver assessment survey.
// TODO: implement once waiver_assessment_survey DB table is built.
func WaiverAssessmentSurveyUpdate(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.WaiverAssessmentSurvey, error) {
	principal := appcontext.Principal(ctx)
	stub := models.NewWaiverAssessmentSurvey(principal.Account().ID, uuid.Nil)
	stub.ID = id
	stub.CreatedDts = time.Now()
	return stub, nil
}

// WaiverGetByID returns a stub Waiver.
// TODO: implement once waiver DB table is built.
func WaiverGetByID(ctx context.Context, id uuid.UUID) (*models.Waiver, error) {
	principal := appcontext.Principal(ctx)
	stub := models.NewWaiver(principal.Account().ID, uuid.Nil, uuid.Nil)
	stub.ID = id
	stub.CreatedDts = time.Now()
	return stub, nil
}

// WaiverUpdate updates a waiver.
// TODO: implement once waiver DB table is built.
func WaiverUpdate(ctx context.Context, id uuid.UUID, changes map[string]interface{}) (*models.Waiver, error) {
	return WaiverGetByID(ctx, id)
}

// WaiversGetByModelPlanID returns stub waivers for a model plan.
// TODO: implement once waiver DB table is built.
func WaiversGetByModelPlanID(_ context.Context, _ uuid.UUID) ([]*models.Waiver, error) {
	return []*models.Waiver{}, nil
}

// SuggestedWaiversGetByModelPlanID returns stub suggested waivers for a model plan.
// TODO: implement once suggested_waiver DB table is built.
func SuggestedWaiversGetByModelPlanID(_ context.Context, _ uuid.UUID) ([]*models.SuggestedWaiver, error) {
	return []*models.SuggestedWaiver{}, nil
}

// CommonWaiverGetByID returns a stub CommonWaiver.
// TODO: implement once common_waiver DB table is built.
func CommonWaiverGetByID(ctx context.Context, id uuid.UUID) (*models.CommonWaiver, error) {
	principal := appcontext.Principal(ctx)
	stub := models.NewCommonWaiver(principal.Account().ID, "")
	stub.ID = id
	stub.CreatedDts = time.Now()
	return stub, nil
}
