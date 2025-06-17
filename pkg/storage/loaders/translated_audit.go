package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
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
	// Note, we could also add a limit param to this, but it would be a bit more complex. That would make this return potentially multiple results per key. If we did this, we could reuse for all places we retrieve translated audits
	logger := appcontext.ZLogger(ctx).With(logfields.DataLoaderAppSection)
	loaders, err := Loaders(ctx)
	_ = logger
	if err != nil {
		return errorPerEachKey[storage.MostRecentByModelPlanIDAndTableFilters, *models.TranslatedAudit](keys, err)
	}

	data, err := storage.TranslatedAuditMostRecentGetByModelPlanIDAndTableNamesLoader(loaders.DataReader.Store, logger, keys)
	if err != nil {
		return errorPerEachKey[storage.MostRecentByModelPlanIDAndTableFilters, *models.TranslatedAudit](keys, err)
	}
	getKeyFunc := func(data *models.TranslatedAuditWithFilteredView) storage.MostRecentByModelPlanIDAndTableFilters {
		return storage.MostRecentByModelPlanIDAndTableFilters{
			ModelPlanID:    data.ModelPlanID,
			TableNames:     data.TableNames,
			IsAdmin:        data.IsAdmin,
			ExcludedFields: data.ExcludedFields,
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
