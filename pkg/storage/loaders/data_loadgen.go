package loaders

import (
	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type (
	// BuildDataloadgens builds and returns a set of dataloaders - useful for supplying each new HTTP request with its
	// own set of dataloaders
	BuildDataloadgens func() *DataLoadgens
)

// DataLoadgens is a collection of dataloaders using the dataLoadgen library
type DataLoadgens struct {
	dataReader *dataReader

	//TODO: perhaps these methods should remain unimported?
	ModelPlanByModelPlanID  *dataloadgen.Loader[uuid.UUID, *models.ModelPlan]
	PlanBasicsByModelPlanID *dataloadgen.Loader[uuid.UUID, *models.PlanBasics]
}

func NewDataLoadgens(store *storage.Store) *DataLoadgens {
	loadgen := &DataLoadgens{
		dataReader: &dataReader{
			Store: store,
		},
	}

	loadgen.ModelPlanByModelPlanID = dataloadgen.NewLoader(loadgen.batchModelPlanByModelPlanID)
	loadgen.PlanBasicsByModelPlanID = dataloadgen.NewLoader(loadgen.batchPlanBasicsGetByModelPlanID)

	return loadgen

}
