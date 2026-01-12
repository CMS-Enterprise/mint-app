package loaders

import "github.com/graph-gophers/dataloader"

// createErrorOutput creates an error message for a given length of data loader results
// this is useful in situations where the same error message applies to every result
func createErrorOutput(err error, count int) []*dataloader.Result {
	output := []*dataloader.Result{}

	for i := 0; i < count; i++ {
		output[i] = &dataloader.Result{
			Data:  nil,
			Error: err,
		}
	}
	return output

}
