package helpers

import (
	"slices"
	"strings"
)

// JoinStringSlice is a helper function which takes a slice of ~strings, and returns a string representation of the slice.
func JoinStringSlice[T ~string](items []T, sortStrings bool) string {
	strs := make([]string, len(items))
	for i, v := range items {
		strs[i] = string(v)
	}
	if sortStrings {
		slices.Sort(strs)
	}
	return "{" + strings.Join(strs, ",") + "}"
}
