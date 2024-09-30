package subscribers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

// OnTaskListSectionLockChangedUnsubscribedCallback is a callback that will be called when a TaskListSectionLockChangedSubscriber is unsubscribed
type OnTaskListSectionLockChangedUnsubscribedCallback func(ps pubsub.PubSub, subscriber pubsub.Subscriber, modelPlanID uuid.UUID)

// TaskListSectionLockChangedSubscriber is a Subscriber definition to receive TaskListSectionLockStatusChanged payloads
type TaskListSectionLockChangedSubscriber struct {
	ID             uuid.UUID
	Principal      authentication.Principal
	Channel        chan *model.TaskListSectionLockStatusChanged
	onUnsubscribed OnTaskListSectionLockChangedUnsubscribedCallback
}

// NewTaskListSectionLockChangedSubscriber is a constructor to create a new TaskListSectionLockChangedSubscriber
func NewTaskListSectionLockChangedSubscriber(Principal authentication.Principal) (*TaskListSectionLockChangedSubscriber, error) {
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
func (t *TaskListSectionLockChangedSubscriber) GetID() string {
	return t.ID.String()
}

// GetPrincipal returns this Subscriber's associated EUAID
func (t *TaskListSectionLockChangedSubscriber) GetPrincipal() authentication.Principal {
	return t.Principal
}

// Notify will be called by the PubSub service when an event this Subscriber is registered for is dispatched
func (t *TaskListSectionLockChangedSubscriber) Notify(payload interface{}) {
	typedPayload := payload.(model.TaskListSectionLockStatusChanged)
	t.Channel <- &typedPayload
}

// NotifyUnsubscribed will be called by the PubSub service when this Subscriber is unsubscribed
func (t *TaskListSectionLockChangedSubscriber) NotifyUnsubscribed(ps *pubsub.ServicePubSub, sessionID uuid.UUID) {
	if t.onUnsubscribed != nil {
		t.onUnsubscribed(ps, t, sessionID)
	}
}

// GetChannel provides this Subscriber's feedback channel
func (t *TaskListSectionLockChangedSubscriber) GetChannel() <-chan *model.TaskListSectionLockStatusChanged {
	return t.Channel
}

// SetOnUnsubscribedCallback is an optional callback that will be called when this Subscriber is unsubscribed
func (t *TaskListSectionLockChangedSubscriber) SetOnUnsubscribedCallback(onUnsubscribed OnTaskListSectionLockChangedUnsubscribedCallback) {
	t.onUnsubscribed = onUnsubscribed
}
