package logfields

import "go.uber.org/zap"

// these constants represents the keys to get these data fields out of a zap logger.
const (
	appSectionKey string = "app_section"

	faktorySection    string = "faktory"
	dataLoaderSection string = "dataLoader"
)

// FaktoryAppSection provides the zap field for specifying the part of the application is faktory
var FaktoryAppSection = zap.String(appSectionKey, faktorySection)
var DataLoaderAppSection = zap.String(appSectionKey, dataLoaderSection)
