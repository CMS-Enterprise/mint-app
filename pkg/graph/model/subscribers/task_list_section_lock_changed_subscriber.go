package subscribers

import "github.com/cmsgov/mint-app/pkg/graph/model"

// TaskListSectionLockChangedSubscriber is a Subscriber definition to receive TaskListSectionLockStatusChanged payloads
type TaskListSectionLockChangedSubscriber struct {
	ID      string
	Channel chan *model.TaskListSectionLockStatusChanged
}

// NewTaskListSectionLockChangedSubscriber is a constructor to create a new TaskListSectionLockChangedSubscriber
func NewTaskListSectionLockChangedSubscriber(ID string) *TaskListSectionLockChangedSubscriber {
	return &TaskListSectionLockChangedSubscriber{ID: ID, Channel: make(chan *model.TaskListSectionLockStatusChanged)}
}

// GetID returns this Subscriber's unique identifying token
func (t TaskListSectionLockChangedSubscriber) GetID() string {
	return t.ID
}

// Notify will be called by the PubSub service when an event this Subscriber is registered for is dispatched
func (t TaskListSectionLockChangedSubscriber) Notify(payload interface{}) {
	typedPayload := payload.(model.TaskListSectionLockStatusChanged)
	t.Channel <- &typedPayload
}

// GetChannel provides this Subscriber's feedback channel
func (t TaskListSectionLockChangedSubscriber) GetChannel() <-chan *model.TaskListSectionLockStatusChanged {
	return t.Channel
}
