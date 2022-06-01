package resolvers

/*import (
	"github.com/cmsgov/mint-app/pkg/graph/model/subscribers"
	"github.com/cmsgov/mint-app/pkg/models/pubsubevents"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// SubscriptionRegisterCollaboratorChanged subscribes the caller to changes in a model plan by id
func SubscriptionRegisterCollaboratorChanged(ps *pubsub.PubSub, onDisconnect <-chan struct{}, principal string, modelPlanID uuid.UUID) (<-chan *model.CollaboratorChanged, error) {
	subscriber := subscribers.NewCollaboratorSubscriber(principal)

	ps.Subscribe(modelPlanID, pubsubevents.CollaboratorsChangedEvent, subscriber, onDisconnect)
	go unregisterCollaboratorChangedOnDisconnect(ps, onDisconnect, principal, modelPlanID)

	return subscriber.GetChannel(), nil
}

//SubscriptionUnregisterCollaboratorChanged unsubscribes the caller to changes in a model plan
func SubscriptionUnregisterCollaboratorChanged(ps *pubsub.PubSub, modelPlanID uuid.UUID, principal string) {
	ps.Unsubscribe(modelPlanID, pubsubevents.CollaboratorsChangedEvent, principal)
}

func unregisterCollaboratorChangedOnDisconnect(ps *pubsub.PubSub, onDisconnect <-chan struct{}, principal string, modelPlanID uuid.UUID) {
	<-onDisconnect
	SubscriptionUnregisterCollaboratorChanged(ps, modelPlanID, principal)
}

// NotifySubscribersEventCollaboratorChanged is a utility method to simplify updating observers of a collaborator change
func NotifySubscribersEventCollaboratorChanged(pubsub *pubsub.PubSub, collaborator *models.PlanCollaborator, changeType model.CollaboratorChangedAction) {
	payload := &model.CollaboratorChanged{
		ChangeType:   changeType,
		Collaborator: collaborator,
	}

	pubsub.Publish(collaborator.ModelPlanID, pubsubevents.CollaboratorsChangedEvent, payload)
}
*/
