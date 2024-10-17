package subscribers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

// OnLockableSectionLockChangedUnsubscribedCallback is a callback that will be called when a LockableSectionLockChangedSubscriber is unsubscribed
type OnLockableSectionLockChangedUnsubscribedCallback func(ps pubsub.PubSub, subscriber pubsub.Subscriber, modelPlanID uuid.UUID)

// LockableSectionLockChangedSubscriber is a Subscriber definition to receive LockableSectionLockStatusChanged payloads
type LockableSectionLockChangedSubscriber struct {
	ID             uuid.UUID
	Principal      authentication.Principal
	Channel        chan *model.LockableSectionLockStatusChanged
	onUnsubscribed OnLockableSectionLockChangedUnsubscribedCallback
}

// NewLockableSectionLockChangedSubscriber is a constructor to create a new LockableSectionLockChangedSubscriber
func NewLockableSectionLockChangedSubscriber(Principal authentication.Principal) (*LockableSectionLockChangedSubscriber, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}

	subscriber := &LockableSectionLockChangedSubscriber{
		ID:        id,
		Principal: Principal,
		Channel:   make(chan *model.LockableSectionLockStatusChanged)}

	return subscriber, nil
}

// GetID returns this Subscriber's unique identifying token
func (t *LockableSectionLockChangedSubscriber) GetID() string {
	return t.ID.String()
}

// GetPrincipal returns this Subscriber's associated EUAID
func (t *LockableSectionLockChangedSubscriber) GetPrincipal() authentication.Principal {
	return t.Principal
}

// Notify will be called by the PubSub service when an event this Subscriber is registered for is dispatched
func (t *LockableSectionLockChangedSubscriber) Notify(payload interface{}) {
	typedPayload := payload.(model.LockableSectionLockStatusChanged)
	t.Channel <- &typedPayload
}

// NotifyUnsubscribed will be called by the PubSub service when this Subscriber is unsubscribed
func (t *LockableSectionLockChangedSubscriber) NotifyUnsubscribed(ps *pubsub.ServicePubSub, sessionID uuid.UUID) {
	if t.onUnsubscribed != nil {
		t.onUnsubscribed(ps, t, sessionID)
	}
}

// GetChannel provides this Subscriber's feedback channel
func (t *LockableSectionLockChangedSubscriber) GetChannel() <-chan *model.LockableSectionLockStatusChanged {
	return t.Channel
}

// SetOnUnsubscribedCallback is an optional callback that will be called when this Subscriber is unsubscribed
func (t *LockableSectionLockChangedSubscriber) SetOnUnsubscribedCallback(onUnsubscribed OnLockableSectionLockChangedUnsubscribedCallback) {
	t.onUnsubscribed = onUnsubscribed
}
