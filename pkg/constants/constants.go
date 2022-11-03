package constants

import "github.com/google/uuid"

const sampleModelUUIDString = "f25d8f70-6470-47e6-a6d9-debc10f26567"

// SampleModelName is the name of the sample model
const SampleModelName = "Enhancing Oncology Model"

// GetSampleUUID returns a UUID my model plan ID
func GetSampleUUID() uuid.UUID {
	return uuid.MustParse(sampleModelUUIDString)
}
