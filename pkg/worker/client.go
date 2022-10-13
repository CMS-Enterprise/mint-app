package worker

import (
	"fmt"

	faktory "github.com/contribsys/faktory/client"
)

// NewClient returns a new faktory Client.
func NewClient() (*faktory.Client, error) {
	cl, err := faktory.Open()
	if err != nil {
		return nil, fmt.Errorf("error opening faktory client: %w", err)
	}
	return cl, nil
}
