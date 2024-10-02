package loaders

import "errors"

// ErrNoLoaderOnContext is returned when a dataloader isn't wrapped on the context
var ErrNoLoaderOnContext = errors.New("dataLoader: no dataloader found on context")
