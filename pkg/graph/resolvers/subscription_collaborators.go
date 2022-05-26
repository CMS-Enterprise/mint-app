package resolvers

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// CollaboratorChangedSubscriberMap defines the container type for mapping principal names to observers
type CollaboratorChangedSubscriberMap map[string]chan *model.EventCollaboratorChanged

// CollaboratorChangedModelSubscriberMap defines the container type for mapping ModelPlanIds to a subscriber map
type CollaboratorChangedModelSubscriberMap map[uuid.UUID]*CollaboratorChangedSubscriberMap

var observersCollaboratorsChanged CollaboratorChangedModelSubscriberMap

func init() {
	observersCollaboratorsChanged = make(CollaboratorChangedModelSubscriberMap)
}

// SubscriptionRegisterCollaboratorChanged subscribes the caller to changes in a model plan by id
func SubscriptionRegisterCollaboratorChanged(onDisconnect <-chan struct{}, principal string, modelPlanID uuid.UUID) (<-chan *model.EventCollaboratorChanged, error) {
	event := make(chan *model.EventCollaboratorChanged, 1)

	unregisterCollaboratorChangedOnDisconnect(onDisconnect, principal, modelPlanID)

	subscribers, found := observersCollaboratorsChanged[modelPlanID]
	if !found {
		subscribersNew := make(CollaboratorChangedSubscriberMap)
		subscribers = &subscribersNew
		observersCollaboratorsChanged[modelPlanID] = subscribers
	}

	(*subscribers)[principal] = event

	return event, nil
}

//SubscriptionUnregisterCollaboratorChanged unsubscribes the caller to changes in a model plan
func SubscriptionUnregisterCollaboratorChanged(modelPlanID uuid.UUID, principal string) error {
	subscribers, found := observersCollaboratorsChanged[modelPlanID]
	if !found {
		return fmt.Errorf("could not find ModelPlanID [%v] in registered subscribers", modelPlanID)
	}

	_, found = (*subscribers)[principal]
	if !found {
		return fmt.Errorf("could not find principal [%v] in registered observers", modelPlanID)
	}

	delete(*subscribers, principal)
	return nil
}

func unregisterCollaboratorChangedOnDisconnect(onDisconnect <-chan struct{}, principal string, modelPlanID uuid.UUID) {
	<-onDisconnect
	_ = SubscriptionUnregisterCollaboratorChanged(modelPlanID, principal)
}

// NotifySubscribersEventCollaboratorChanged is a utility method to simplify updating observers of a collaborator change
func NotifySubscribersEventCollaboratorChanged(collaborator *models.PlanCollaborator, changeType model.CollaboratorChangedAction) {
	subscribers, found := observersCollaboratorsChanged[collaborator.ModelPlanID]
	if !found {
		return
	}

	for _, observer := range *subscribers {
		observer <- &model.EventCollaboratorChanged{
			ChangeType:   changeType,
			Collaborator: collaborator,
		}
	}
}
