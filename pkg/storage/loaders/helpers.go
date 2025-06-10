package loaders

import (
	"fmt"

	"github.com/graph-gophers/dataloader/v7"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
)

func transformToDataLoaderResult[V any](val V, valueFound bool) *dataloader.Result[V] {
	if valueFound {
		return &dataloader.Result[V]{Data: val, Error: nil}
	}

	return &dataloader.Result[V]{Data: val, Error: fmt.Errorf("issue getting result for type %T, err: %w", val, ErrRecordNotFoundForKey)}
}

// transformToDataLoaderResultAllowNils transforms an output to a dataloader result. It doesn't error if there is not a value for the given key.
func transformToDataLoaderResultAllowNils[V any](val V, valueFound bool) *dataloader.Result[V] {
	return &dataloader.Result[V]{Data: val, Error: nil}
}

func oneToOneDataLoader[K comparable, V any](keys []K, values []V, getKey func(V) K) []*dataloader.Result[V] {

	return helpers.OneToOne(keys, values, getKey, transformToDataLoaderResult)
}

// // oneToOneDataLoaderAllowNil is a version of oneToOneDataLoader that allows nil values to be returned without erroring.
// func oneToOneDataLoaderAllowNil[K comparable, V any](keys []K, values []V, getKey func(V) K) []*dataloader.Result[V] {
// 	return helpers.OneToOne(keys, values, getKey, transformToDataLoaderResultAllowNils)
// }

// oneToOneWithCustomKeyDataLoaderAllowNil is a version of oneToOneDataLoader that allows nil values to be returned without erroring.
func oneToOneWithCustomKeyDataLoaderAllowNil[K comparable, V any, mapKey comparable, mapType any](keys []K, values []mapType, getKey func(mapType) mapKey, getRes func(K, map[mapKey]mapType) (V, bool)) []*dataloader.Result[V] {
	return helpers.OneToOneWithCustomKey(keys, values, getKey, getRes, transformToDataLoaderResultAllowNils)
}
func oneToManyWithCustomKeyDataLoader[K comparable, V any, mapKey comparable, mapType any](keys []K, values []mapType, getKey func(mapType) mapKey, getRes func(K, map[mapKey][]mapType) ([]V, bool)) []*dataloader.Result[[]V] {
	return helpers.OneToManyWithCustomKey(keys, values, getKey, getRes, transformToDataLoaderResultAllowNils)
}
func oneToManyDataLoader[K comparable, V any](keys []K, values []V, getKey func(V) K) []*dataloader.Result[[]V] {
	return helpers.OneToMany[K, V, V](keys, values, getKey, transformToDataLoaderResultAllowNils)
}

func errorPerEachKey[K comparable, V any](keys []K, err error) []*dataloader.Result[V] {
	var empty V
	output := make([]*dataloader.Result[V], len(keys))
	for index := range keys {
		output[index] = &dataloader.Result[V]{Data: empty, Error: err}
	}
	return output
}
