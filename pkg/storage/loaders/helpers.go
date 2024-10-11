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

func oneToOneDataLoaderFunc[K comparable, V any](keys []K, values []V, getKey func(V) K) []*dataloader.Result[V] {

	return helpers.OneToOneFunc(keys, values, getKey, transformToDataLoaderResult)
}
func oneToManyDataLoaderFunc[K comparable, V any, mapKey comparable](keys []K, values []V, getKey func(V) mapKey, getRes func(K, map[mapKey][]V) ([]V, bool)) []*dataloader.Result[[]V] {
	return helpers.OneToManyFunc(keys, values, getKey, getRes, transformToDataLoaderResultAllowNils)
}
func oneToManyDataLoaderFuncSimplified[K comparable, V any](keys []K, values []V, getKey func(V) K) []*dataloader.Result[[]V] {
	return helpers.OneToManyFuncSimplified(keys, values, getKey, transformToDataLoaderResultAllowNils)
}

func errorPerEachKey[K comparable, V any](keys []K, err error) []*dataloader.Result[V] {
	var empty V
	output := make([]*dataloader.Result[V], len(keys))
	for index := range keys {
		output[index] = &dataloader.Result[V]{Data: empty, Error: err}
	}
	return output
}
