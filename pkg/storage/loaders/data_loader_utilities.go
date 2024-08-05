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
