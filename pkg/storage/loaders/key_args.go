package loaders

import (
	"encoding/json"
	"fmt"

	"github.com/graph-gophers/dataloader"
)

// KeyArgs implements the DataLoader Key interface
type KeyArgs struct {
	Args map[string]interface{}
}

// NewKeyArgs instantiates a compound key
func NewKeyArgs() KeyArgs {
	return KeyArgs{
		Args: map[string]interface{}{},
	}
}

// KeyArgsArray represents an Array of KeyArgs
type KeyArgsArray []KeyArgs

// ToJSONArray converts CompoundKeys to JSON array notation
func (ck KeyArgsArray) ToJSONArray() (string, *error) {

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

// ConvertToKeyArgsArray casts a dataloader.Keys object to a KeyArgsArray object
func ConvertToKeyArgsArray(Keys dataloader.Keys) (KeyArgsArray, *error) {

	cKeys := []KeyArgs{}
	for _, ck := range Keys {
		converted, ok := ck.Raw().(KeyArgs)
		if ok {
			cKeys = append(cKeys, converted)
		}

	}
	return cKeys, nil

}

// ConvertKeysToArray converts a dataloader.Keys object to a typed array
func ConvertKeysToArray[T any](Keys dataloader.Keys, valueKey string) ([]T, error) {

	tArray := make([]T, len(Keys))
	for index, key := range Keys {
		keyArgs, ok := key.Raw().(KeyArgs)
		if !ok {
			return nil, fmt.Errorf("could not retrieve %s key from %s", valueKey, key.String())
		}
		resKey := keyArgs.Args[valueKey]
		typedKey, ok := resKey.(T)
		if !ok {
			return nil, fmt.Errorf("could not cast dataloader key to %T", tArray)
		}
		tArray[index] = typedKey
	}

	return tArray, nil

}

// CovertToJSONArray converts dataloader keys to a json string
func CovertToJSONArray(Keys dataloader.Keys) (string, error) {
	arrayCK, err := ConvertToKeyArgsArray(Keys)
	if err != nil {
		return "", fmt.Errorf("issue converting keys data to Key Args type, %w", *err)
	}
	marshaledParams, err := arrayCK.ToJSONArray()
	if err != nil {
		return "", fmt.Errorf("issue converting keys to JSON for data loader in Plan Collaborator, %w", *err)
	}
	return marshaledParams, nil

}

// String is an identity method. Used to implement String interface
func (k KeyArgs) String() string { return fmt.Sprint(k.Args) }

// Raw is an identity method. Used to implement Key Raw
func (k KeyArgs) Raw() interface{} { return k }
