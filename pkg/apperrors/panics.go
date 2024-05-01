package apperrors

import "fmt"

// RecoverPanicAsErrorFunction recovers from a panic and sets the error passed by reference
func RecoverPanicAsErrorFunction(retErr *error) {
	if r := recover(); r != nil {
		*retErr = fmt.Errorf("recovered from panic. Error: %v", r)
	}
}
