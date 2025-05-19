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

	data, err := storage.TranslatedAuditMostRecentGetByModelPlanIDAndTableNamesLoader(loaders.DataReader.Store, keys)
	if err != nil {
		return errorPerEachKey[storage.MostRecentByModelPlanIDAndTableFilters, *models.TranslatedAudit](keys, err)
	}
	getKeyFunc := func(data *models.TranslatedAuditWithFilteredView) storage.MostRecentByModelPlanIDAndTableFilters {
		return storage.MostRecentByModelPlanIDAndTableFilters{
			ModelPlanID: data.ModelPlanID,
			TableNames:  data.TableNames,
			IsAdmin:     data.IsAdmin,
		}
	}
	getResFunc := func(key storage.MostRecentByModelPlanIDAndTableFilters, resMap map[storage.MostRecentByModelPlanIDAndTableFilters]*models.TranslatedAuditWithFilteredView) (*models.TranslatedAudit, bool) {
		res, ok := resMap[key]
		if ok {
			return res.ToTranslatedAudit(), ok
		}
		return nil, ok
	}
	return oneToOneWithCustomKeyDataLoaderAllowNil(keys, data, getKeyFunc, getResFunc)

}
