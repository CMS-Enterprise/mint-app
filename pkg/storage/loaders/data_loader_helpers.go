package loaders

import (
	"encoding/json"
	"fmt"

	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/mint-app/pkg/storage"
)

// CompoundKey implements the DataLoader Key interface
type CompoundKey struct {
	Args map[string]interface{}
}

// NewCompoundKey instantiates a compound key
func NewCompoundKey() CompoundKey {
	return CompoundKey{
		Args: map[string]interface{}{},
	}
}

// CompoundKeys represents an Array of CompoundKeys
type CompoundKeys []CompoundKey

// ToJSONArray converts CompoundKeys to JSON array notation
func (ck CompoundKeys) ToJSONArray() (string, *error) {

	mapSlice := []map[string]interface{}{}
	for _, v := range ck {
		mapSlice = append(mapSlice, v.Args)
	}
	byteArr, err := json.Marshal(mapSlice)
	if err != nil {
		return "", &err
	}
	return string(byteArr), nil
}

// CompoundKeyArray casts a dataloader.Keys object to a CompoundKeys object
func CompoundKeyArray(Keys dataloader.Keys) (CompoundKeys, *error) {

	cKeys := []CompoundKey{}
	for _, ck := range Keys {
		converted, ok := ck.Raw().(CompoundKey)
		if ok {
			cKeys = append(cKeys, converted)
		}

	}
	return cKeys, nil

}

// String is an identity method. Used to implement String interface
func (k CompoundKey) String() string { return fmt.Sprint(k.Args) }

// Raw is an identity method. Used to implement Key Raw
func (k CompoundKey) Raw() interface{} { return k }

// WrappedDataLoader wraps a DataLoader so it has access to an optional Map
type WrappedDataLoader struct {
	Loader *dataloader.Loader
}

func newWrappedDataLoader(batchFn dataloader.BatchFunc) *WrappedDataLoader {

	return &WrappedDataLoader{
		Loader: dataloader.NewBatchedLoader(batchFn, dataloader.WithClearCacheOnBatch()),
	}
}

// DataReader reads Users from a database
type DataReader struct {
	Store *storage.Store
}
