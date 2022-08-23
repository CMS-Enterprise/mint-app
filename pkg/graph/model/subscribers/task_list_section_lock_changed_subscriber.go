package subscribers

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

// TaskListSectionLockChangedSubscriber is a Subscriber definition to receive TaskListSectionLockStatusChanged payloads
type TaskListSectionLockChangedSubscriber struct {
	ID        uuid.UUID
	Principal string
	Channel   chan *model.TaskListSectionLockStatusChanged
}

// NewTaskListSectionLockChangedSubscriber is a constructor to create a new TaskListSectionLockChangedSubscriber
func NewTaskListSectionLockChangedSubscriber(Principal string) (*TaskListSectionLockChangedSubscriber, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}

	subscriber := &TaskListSectionLockChangedSubscriber{
		ID:        id,
		Principal: Principal,
		Channel:   make(chan *model.TaskListSectionLockStatusChanged)}

	return subscriber, nil
}

// GetID returns this Subscriber's unique identifying token
func (t TaskListSectionLockChangedSubscriber) GetID() string {
	return t.ID.String()
}

// GetPrincipal returns this Subscriber's associated EUAID
func (t TaskListSectionLockChangedSubscriber) GetPrincipal() string {
	return t.Principal
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
