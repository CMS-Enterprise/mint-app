package loaders

import "errors"

// ErrNoLoaderOnContext is returned when a dataloader isn't wrapped on the context
var ErrNoLoaderOnContext = errors.New("dataLoader: no dataloader found on context")

// ErrLoaderOfWrongType is returned when a dataloader on the context can't be cast to the appropriate type
var ErrLoaderOfWrongType = errors.New("dataLoader: dataloader returned from the context is not of the correct type")

// ErrLoaderIsNotInstantiated is returned when a dataloader hasn't been instantiated properly, and is nil
var ErrLoaderIsNotInstantiated = errors.New("dataLoader: dataloader has not been instantiated. make sure to assign the loader to the config on instantiation")
