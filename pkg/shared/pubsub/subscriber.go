package pubsub

// Subscriber is an abstract interface defining the necessary functionality for a subscription model
//
//	It is intended for the user to define their own version of a Subscriber to assign when subscribing to an EventType
type Subscriber interface {
	GetID() string
	GetPrincipal() string
	Notify(payload interface{})
}
