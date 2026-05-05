package loaders

import (
	"context"

	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/storage"
)

type accessControlLoaders struct {
	IsCollaborator LoaderWrapper[storage.IsCollaboratorKey, bool]
}

var AccessControl = &accessControlLoaders{
	IsCollaborator: NewLoaderWrapper(batchCheckIfCollaborator),
}

func batchCheckIfCollaborator(ctx context.Context, keys []storage.IsCollaboratorKey) []*dataloader.Result[bool] {
	loaders, err := Loaders(ctx)
	if err != nil {
		return errorPerEachKey[storage.IsCollaboratorKey, bool](keys, err)
	}

	results, err := storage.CheckIfCollaboratorLOADER(loaders.DataReader.Store, keys)
	if err != nil {
		return errorPerEachKey[storage.IsCollaboratorKey, bool](keys, err)
	}

	getKeyFunc := func(r *storage.IsCollaboratorResult) storage.IsCollaboratorKey {
		return storage.IsCollaboratorKey{
			ModelPlanID: r.ModelPlanID,
			UserID:      r.UserID,
		}
	}
	getResFunc := func(key storage.IsCollaboratorKey, resMap map[storage.IsCollaboratorKey]*storage.IsCollaboratorResult) (bool, bool) {
		res, ok := resMap[key]
		if ok {
			return res.IsCollaborator, true
		}
		return false, true
	}
	return oneToOneWithCustomKeyDataLoaderAllowNil(keys, results, getKeyFunc, getResFunc)
}
