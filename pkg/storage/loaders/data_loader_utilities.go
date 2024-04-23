package loaders

import "github.com/graph-gophers/dataloader"

// setEachOutputToError iterates through each dataloader result and sets an error message
// this is useful in situations where the same error message applies to every result
func setEachOutputToError(err error, output []*dataloader.Result) {
	for _, result := range output {
		result.Error = err
		result.Data = nil
	}
}
