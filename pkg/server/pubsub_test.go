package server

import (
	"context"
	"fmt"
	"log"
	"testing"

	"github.com/lileio/pubsub"
	"github.com/lileio/pubsub/middleware/defaults"
	"github.com/lileio/pubsub/providers/nats"
	"github.com/stretchr/testify/suite"
)

type LileIOPubSubTestSuite struct {
	suite.Suite
}

type Subscriber struct{}

func (s *Subscriber) Setup(c *pubsub.Client) {
	c.On(pubsub.HandlerOptions{
		Topic:   HelloTopic,
		Name:    "print-hello",
		Handler: s.printHello,
		AutoAck: true,
		JSON:    true,
	})
}

func (s *Subscriber) printHello(_ context.Context, msg *HelloMsg, m *pubsub.Msg) error {
	fmt.Printf("Message received %+v\n\n", m)
	fmt.Printf(msg.Greeting + " " + msg.Name + "\n")
	return nil
}

const HelloTopic = "hello.topic"

type HelloMsg struct {
	Greeting string
	Name     string
}

func TestLileIOPubSubTestSuite(t *testing.T) {
	lileIOPubSubTestSuite := &LileIOPubSubTestSuite{
		Suite: suite.Suite{},
	}
	suite.Run(t, lileIOPubSubTestSuite)
}

func (s LileIOPubSubTestSuite) TestPubSubLileIO() {
	n, err := nats.NewNats("test-cluster")
	if err != nil {
		log.Fatal(err)
	}

	pubsub.SetClient(&pubsub.Client{
		ServiceName: "test-cluster",
		Provider:    n,
		Middleware:  defaults.Middleware,
	})

	fmt.Println("Subscribing to queues")
	pubsub.Subscribe(&Subscriber{})

	fmt.Println("Publishing new message")
	pubsub.PublishJSON(nil, HelloTopic, HelloMsg{
		Greeting: "Salutations!",
		Name:     "Good day old chap, best of luck on your adventures!",
	})

	pubsub.Shutdown()
}
