package logfields

import "go.uber.org/zap"

// these constants represents the keys to get these data fields out of a zap logger.
const (
	AppSectionKey string = "app_section"

	FaktorySectionKey    string = "faktory"
	DataLoaderSectionKey string = "dataLoader"
)

// FaktoryAppSection provides the zap field for specifying the part of the application is faktory
var FaktoryAppSection = zap.String(AppSectionKey, FaktorySectionKey)
var DataLoaderAppSection = zap.String(AppSectionKey, DataLoaderSectionKey)
