package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type planFavoriteLoaders struct {
	IsFavorited LoaderWrapper[storage.IsFavoriteKey, bool]
}

var PlanFavorites = &planFavoriteLoaders{
	IsFavorited: NewLoaderWrapper(batchPlanFavoriteIsFavorited),
}

func batchPlanFavoriteIsFavorited(ctx context.Context, keys []storage.IsFavoriteKey) []*dataloader.Result[bool] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[storage.IsFavoriteKey, bool](keys, err)
	}

	results, err := storage.PlanFavoriteIsFavoritedLOADER(loaders.DataReader.Store, keys)
	if err != nil {
		return errorPerEachKey[storage.IsFavoriteKey, bool](keys, err)
	}

	getKeyFunc := func(r *storage.IsFavoriteResult) storage.IsFavoriteKey {
		return storage.IsFavoriteKey{
			ModelPlanID: r.ModelPlanID,
			UserID:      r.UserID,
		}
	}
	getResFunc := func(key storage.IsFavoriteKey, resMap map[storage.IsFavoriteKey]*storage.IsFavoriteResult) (bool, bool) {
		res, ok := resMap[key]
		if ok {
			return res.IsFavorite, true
		}
		return false, true
	}
	return oneToOneWithCustomKeyDataLoaderAllowNil(keys, results, getKeyFunc, getResFunc)
}
