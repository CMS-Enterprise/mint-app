package testpubsub

import (
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub/mockpubsub"
)

func TestPubSubImplementation_Publish(t *testing.T) {
	ps, subscriber, eventType, payload, modelPlanID, _, disconnectChannel := setupPubSubTest(t)

	subscriber.EXPECT().GetID().Return("MOCK_SUBSCRIBER").Times(2)
	subscriber.EXPECT().Notify(payload)

	ps.Subscribe(modelPlanID, eventType, subscriber, disconnectChannel)
	ps.Publish(modelPlanID, eventType, payload)
}

func setupPubSubTest(t *testing.T) (*pubsub.ServicePubSub, *mockpubsub.MockSubscriber, pubsub.EventType, string, uuid.UUID, string, chan struct{}) {
	mockController := gomock.NewController(t)
	ps := pubsub.NewServicePubSub()
	subscriber := mockpubsub.NewMockSubscriber(mockController)
	eventType := mockpubsub.MockEvent
	payload := "test"
	modelPlanID, _ := uuid.Parse("ce3405a0-3399-4e3a-88d7-3cfc613d2905")
	subscriberID := "MOCK_SUBSCRIBER"
	disconnectChannel := make(chan struct{})
	return ps, subscriber, eventType, payload, modelPlanID, subscriberID, disconnectChannel
}
