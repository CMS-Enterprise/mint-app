package pubsub

import (
	"sync"

	"github.com/google/uuid"
)

// PubSub is a service to facilitate a lightweight, thread-safe subscription model
type PubSub struct {
	sessions SessionMap
	lock     sync.Mutex
}

// NewPubSub is a constructor to create a new instance of a PubSub service
func NewPubSub() *PubSub {
	return &PubSub{sessions: SessionMap{}}
}

// Subscribe will register the subscriber for notifications of a given eventType within a session
func (ps *PubSub) Subscribe(sessionID uuid.UUID, eventType Event, subscriber Subscriber, onDisconnect <-chan struct{}) {
	session, found := ps.sessions[sessionID]
	if !found {
		session = ps.createSession(sessionID)
	}

	subscriberMap, found := session[eventType]
	if !found {
		subscriberMap = ps.createSubscriberMap(session, eventType)
	}

	ps.assignSubscriber(subscriberMap, subscriber)
	ps.awaitDisconnectUnregister(sessionID, subscriber.GetID(), eventType, onDisconnect)
}

// Unsubscribe unregisters a subscriber from notifications of a given eventType within a session
func (ps *PubSub) Unsubscribe(sessionID uuid.UUID, eventType Event, subscriberID string) {
	session, wasSessionFound := ps.findSession(sessionID)
	if !wasSessionFound {
		return
	}

	subscriberMap, wasSubscriberMapFound := session[eventType]
	if !wasSubscriberMapFound {
		return
	}

	ps.deleteSubscriber(subscriberMap, subscriberID)

	if len(subscriberMap) == 0 {
		delete(session, eventType)
	}

	if len(session) == 0 {
		delete(ps.sessions, sessionID)
	}
}

// Publish dispatches an event and corresponding payload to all registered Subscriber entities
func (ps *PubSub) Publish(sessionID uuid.UUID, eventType Event, payload interface{}) {
	session, wasSessionFound := ps.findSession(sessionID)
	if !wasSessionFound {
		return
	}

	subscriberMap, wasSubscriberMapFound := session[eventType]
	if !wasSubscriberMapFound {
		return
	}

	for _, subscriber := range subscriberMap {
		subscriber.Notify(payload)
	}
}

func (ps *PubSub) createSession(sessionID uuid.UUID) Session {
	session := make(Session)
	ps.lock.Lock()
	ps.sessions[sessionID] = session
	ps.lock.Unlock()
	return session
}

func (ps *PubSub) findSession(sessionID uuid.UUID) (Session, bool) {
	session, found := ps.sessions[sessionID]
	return session, found
}

func (ps *PubSub) assignSubscriber(subscriberMap SubscriberMap, subscriber Subscriber) {
	ps.lock.Lock()
	subscriberMap[subscriber.GetID()] = subscriber
	ps.lock.Unlock()
}

func (ps *PubSub) createSubscriberMap(session Session, eventType Event) SubscriberMap {
	eventListeners := make(SubscriberMap)
	ps.lock.Lock()
	session[eventType] = eventListeners
	ps.lock.Unlock()
	return eventListeners
}

func (ps *PubSub) deleteSubscriber(subscriberMap SubscriberMap, subscriberID string) {
	ps.lock.Lock()
	delete(subscriberMap, subscriberID)
	ps.lock.Unlock()
}

func (ps *PubSub) awaitDisconnectUnregister(sessionID uuid.UUID, subscriberID string, eventType Event, onDisconnect <-chan struct{}) {
	go func() {
		<-onDisconnect
		ps.Unsubscribe(sessionID, eventType, subscriberID)
	}()
}
