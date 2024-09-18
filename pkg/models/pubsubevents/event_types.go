package pubsubevents

import "github.com/cms-enterprise/mint-app/pkg/shared/pubsub"

const (
	// TaskListSectionLocksChanged is an event sent to subscribers indicating a change that has occurred
	TaskListSectionLocksChanged pubsub.EventType = "task_list.section_locks.changed"
)
