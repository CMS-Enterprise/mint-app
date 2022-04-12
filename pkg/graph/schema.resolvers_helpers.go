package graph

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func ConvertToModelPlan(mpi *model.ModelPlanInput) *models.ModelPlan {
	plan := models.ModelPlan{
		// ID:                      *mpi.ID,
		Requester:               mpi.Requester,
		RequesterComponent:      mpi.RequesterComponent,
		MainPointOfContact:      mpi.MainPointOfContact,
		PointOfContactComponent: mpi.PointOfContactComponent,
		CreatedBy:               mpi.CreatedBy,
		CreatedDts:              mpi.CreatedDts,
		ModifiedBy:              mpi.ModifiedBy,
		ModifiedDts:             mpi.ModifiedDts,

		/*
			Requester:               null.StringFromPtr(mpi.Requester),
			RequesterComponent:      null.StringFromPtr(mpi.RequesterComponent),
			MainPointOfContact:      null.StringFromPtr(mpi.MainPointOfContact),
			PointOfContactComponent: null.StringFromPtr(mpi.PointOfContactComponent),
			CreatedBy:               null.StringFromPtr(mpi.CreatedBy),
			CreatedDts:              mpi.CreatedDts,
			ModifiedBy:              null.StringFromPtr(mpi.ModifiedBy),
			ModifiedDts:             mpi.ModifiedDts,

		*/
	}
	if mpi.ID != nil {
		plan.ID = *mpi.ID
	}
	return &plan

}
