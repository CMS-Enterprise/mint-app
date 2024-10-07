package helpers

// Mapper can be implemented so that it can use OneToMany below to map a flat list of values
// to a flat list of their relative keys
type Mapper[keyT comparable, valT any] interface {
	GetMappingKey() keyT
	GetMappingVal() valT // in cases where the return value is not embedded, this should simply be a pointer to the original struct
}

// OneToMany takes a list of keys and a list of values which map one-to-many (key-to-value)
// ex: vals could be a list of contract numbers where more than one value has the same mapped ID
func OneToMany[valT Mapper[keyT, retT], keyT comparable, retT any](keys []keyT, vals []valT) [][]retT {
	// create a map to store values grouped by key (of type keyT)
	// each key will map to a slice of values (of type valT)
	store := map[keyT][]retT{}

	// iterate over each value in the flat slice and append it to the correct key in the map,
	// based on the value's GetMappingKey() method
	for _, val := range vals {
		id := val.GetMappingKey()
		// populate with empty slice if not present
		if _, ok := store[id]; !ok {
			store[id] = []retT{}
		}
		// call return value in case it is an embedded struct or something different than the starting value
		returnValue := val.GetMappingVal()
		store[id] = append(store[id], returnValue)
	}

	// now we have a map of keys to slices of values, but we want to convert that to
	// a 2D slice of values, where each slice is a list of values that share the same key
	//
	// to do this, we iterate over the keys slice and append the corresponding value slice from the map
	var out [][]retT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}

// OneToOne takes a list of keys and a list of values which map one-to-one (key-to-value)
func OneToOne[valT Mapper[keyT, retT], keyT comparable, retT any](keys []keyT, vals []valT) []retT {
	store := map[keyT]retT{}

	for _, val := range vals {
		id := val.GetMappingKey()
		store[id] = val.GetMappingVal()
	}

	var out []retT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}

// OneToOneFunc takes a list of keys and a list of values which map one-to-one (key-to-value).
// it relies on the transformOutput func to return the result in expected format
func OneToOneFunc[K comparable, V any, Output any](keys []K, vals []V, getKey func(V) K, transformOutput func(V, bool) Output) []Output {
	store := map[K]V{}

	for _, val := range vals {
		id := getKey(val)
		store[id] = val
	}
	output := make([]Output, len(keys))

	for index, key := range keys {
		data, ok := store[key]
		output[index] = transformOutput(data, ok)
	}

	return output
}

// OneToManyFunc takes a list of keys and a list of values which map one-to-many (key-to-value)
// ex: vals could be a list of collaborators where more than one collaborator exists for the same model plan id
// getKey: this function takes a value, and gets mapKey key for the intermediate map of data. This is needed for cases where you can't directly infer a key from a value
// getRes: this function takes an original key, and the intermediate response and returns a value and bool if hte value exists
// transform output lets you cast a data result to final expected data type returned
/* EXAMPLE
type SolutionAndPossibleKey struct {
	// OperationalNeedID is the ID of the need that a solution is associated with
	OperationalNeedID uuid.UUID `json:"operational_need_id"`
	// IncludeNotNeeded specifies if the query should return solutions with a status of not needed, or if possible solutions (not discrete records) should be included
	IncludeNotNeeded bool `json:"include_not_needed"`
}
keys []storage.SolutionAndPossibleKey
data := []*models.OperationalSolution {lots of operational solutions}

	getKeyFunc := func(data *models.OperationalSolution) uuid.UUID {
		// The key for the loader is more complicated, but can't be inferred by each individual value. Instead, we can use the get res function to further transform the data as needed
		return data.OperationalNeedID
	}

	getResFunc := func(key storage.SolutionAndPossibleKey, resMap map[uuid.UUID][]*models.OperationalSolution) ([]*models.OperationalSolution, bool) {
	res, ok := resMap[key.OperationalNeedID]
		if !key.IncludeNotNeeded {
			lo.Filter(res, func(sol *models.OperationalSolution, _ int) bool {
				if sol.Needed == nil{
					return false
				}
				return *sol.Needed
			})
		// }

	return res, ok

	}

	transformFunc := func transformToDataLoaderResultAllowNils[V any](val V, valueFound bool) *dataloader.Result[V] {
	return &dataloader.Result[V]{Data: val, Error: nil}
}

	return OneToManyFunc(keys, sols, getKeyFunc, getResFunc, transformFunc)


*/
func OneToManyFunc[K comparable, V any, mapKey comparable, Output any](keys []K, vals []V, getKey func(V) mapKey, getRes func(K, map[mapKey][]V) ([]V, bool), transformOutput func([]V, bool) Output) []Output {
	// create a map to store values grouped by key (of type K)
	// each key will map to a slice of values (of type V)
	store := map[mapKey][]V{}

	for _, val := range vals {
		id := getKey(val)
		if _, ok := store[id]; !ok {
			store[id] = []V{}
		}
		store[id] = append(store[id], val)
	}
	output := make([]Output, len(keys))
	for index, key := range keys {
		data, ok := getRes(key, store)
		output[index] = transformOutput(data, ok)
	}

	return output
}
