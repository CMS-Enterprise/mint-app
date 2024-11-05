package pubsubevents

import "github.com/cms-enterprise/mint-app/pkg/shared/pubsub"

const (
	// LockableSectionLocksChanged is an event sent to subscribers indicating a change that has occurred
	LockableSectionLocksChanged pubsub.EventType = "lockable_section.changed"
)
