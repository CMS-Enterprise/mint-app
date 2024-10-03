package loaders

import "errors"

// ErrNoLoaderOnContext is returned when a dataloader isn't wrapped on the context
var ErrNoLoaderOnContext = errors.New("dataLoader: no dataloader found on context")

// ErrLoaderOfWrongType is returned when a dataloader on the context can't be cast to the appropriate type
var ErrLoaderOfWrongType = errors.New("dataLoader: dataloader returned from the context is not of the correct type")
