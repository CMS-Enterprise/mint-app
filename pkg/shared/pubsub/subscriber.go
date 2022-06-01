package pubsub

// Subscriber is an abstract interface defining the necessary functionality for a subscription model
//	It is intended for the user to define their own version of a Subscriber to assign when subscribing to an Event
type Subscriber interface {
	GetID() string
	Notify(payload interface{})
}
