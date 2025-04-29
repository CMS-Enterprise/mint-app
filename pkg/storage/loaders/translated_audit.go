package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type translatedAuditLoaders struct {
	MostRecentByModelPlanIDAndTableFilters LoaderWrapper[storage.MostRecentByModelPlanIDAndTableFilters, *models.TranslatedAudit]
}

var TranslatedAudit = &translatedAuditLoaders{
	MostRecentByModelPlanIDAndTableFilters: NewLoaderWrapper(batchTranslatedAuditGetMostRecentByModelPlanIDAndTableFilters),
}

func batchTranslatedAuditGetMostRecentByModelPlanIDAndTableFilters(ctx context.Context, keys []storage.MostRecentByModelPlanIDAndTableFilters) []*dataloader.Result[*models.TranslatedAudit] {
	logger := appcontext.ZLogger(ctx)
	loaders, err := Loaders(ctx)
	_ = loaders
	_ = logger
	if err != nil {
		return errorPerEachKey[storage.MostRecentByModelPlanIDAndTableFilters, *models.TranslatedAudit](keys, err)
	}

	//TODO implement. You might need to update the return type to also return with the filter as well for the sake of getting the result
	return nil

}
