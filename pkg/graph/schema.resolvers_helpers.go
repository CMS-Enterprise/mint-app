package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func ConvertToModelPlan(mpi *model.ModelPlanInput) *models.ModelPlan {
	plan := models.ModelPlan{
		ModelName:     mpi.ModelName,
		ModelCategory: mpi.ModelCategory,
		CMSCenter:     mpi.CmsCenter,
		CMMIGroup:     mpi.CmmiGroup,
		CreatedBy:     mpi.CreatedBy,
		CreatedDts:    mpi.CreatedDts,
		ModifiedBy:    mpi.ModifiedBy,
		ModifiedDts:   mpi.ModifiedDts,
	}

	if mpi.ID != nil {
		plan.ID = *mpi.ID
	}
	return &plan

}

func ConvertToPlanBasics(mpi *model.PlanBasicsInput) *models.PlanBasics {
	basics := models.PlanBasics{

		ModelPlanID:    *mpi.ModelPlanID,
		ModelType:      mpi.ModelType,
		Problem:        mpi.Problem,
		Goal:           mpi.Goal,
		TestInventions: mpi.TestInventions,
		Note:           mpi.Note,

		CreatedBy:   mpi.CreatedBy,
		CreatedDts:  mpi.CreatedDts,
		ModifiedBy:  mpi.ModifiedBy,
		ModifiedDts: mpi.ModifiedDts,
	}

	if mpi.ID != nil {
		basics.ID = *mpi.ID
	}
	return &basics

}
