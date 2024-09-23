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

	GetModelPlanByModelPlanID *dataloadgen.Loader[uuid.UUID, *models.ModelPlan]
}

func NewDataLoadgens(store *storage.Store) *DataLoadgens {
	loadgen := &DataLoadgens{
		dataReader: &dataReader{
			Store: store,
		},
	}

	loadgen.GetModelPlanByModelPlanID = dataloadgen.NewLoader(loadgen.batchModelPlanByModelPlanID)

	return loadgen

}
