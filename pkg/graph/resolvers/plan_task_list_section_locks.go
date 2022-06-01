package resolvers

import (
	"sync"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/model/subscribers"
	"github.com/cmsgov/mint-app/pkg/models/pubsubevents"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"
)

var (
	taskListSectionLocks     map[uuid.UUID]map[string]model.TaskListSectionLockStatus
	taskListSectionLockMutex sync.Mutex
)

func init() {
	taskListSectionLocks = make(map[uuid.UUID]map[string]model.TaskListSectionLockStatus)
	taskListSectionLockMutex = sync.Mutex{}
}

// GetTaskListSectionLocks returns the list of locked task list sections. Any sections not included should be considered as unlocked.
func GetTaskListSectionLocks(modelPlanID uuid.UUID) []*model.TaskListSectionLockStatus {
	sectionsLockedMap, found := taskListSectionLocks[modelPlanID]
	if !found {
		return nil
	}

	var sectionsLocked []*model.TaskListSectionLockStatus
	for key := range sectionsLockedMap {
		status := sectionsLockedMap[key]
		sectionsLocked = append(sectionsLocked, &status)
	}

	return sectionsLocked
}

// SubscribeTaskListSectionLockChanges creates a Subscriber and registers it for the pubsubevents.TaskListSectionLocksChanged event
func SubscribeTaskListSectionLockChanges(pubsub *pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	subscriber := subscribers.NewTaskListSectionLockChangedSubscriber(principal)

	pubsub.Subscribe(modelPlanID, pubsubevents.TaskListSectionLocksChanged, subscriber, onDisconnect)

	return subscriber.GetChannel(), nil
}

// LockTaskListSection will lock the provided task list section on the provided model
func LockTaskListSection(pubsub *pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
	if isSectionLocked(modelPlanID, section) {
		return
	}

	status := model.TaskListSectionLockStatus{
		Section:  section,
		LockedBy: principal,
	}

	_, found := taskListSectionLocks[modelPlanID]
	if !found {
		taskListSectionLocks[modelPlanID] = make(map[string]model.TaskListSectionLockStatus)
	}

	taskListSectionLockMutex.Lock()
	taskListSectionLocks[modelPlanID][section] = status
	taskListSectionLockMutex.Unlock()

	pubsub.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeAdded,
		LockStatus: &status,
	})
}

// UnlockTaskListSection will unlock the provided task list section on the provided model
//	This method will fail if the provided principal is not the person who locked the task list section
//	TODO: Allow authorized personnel to unlock task list section which were locked by someone else
func UnlockTaskListSection(pubsub *pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
	if !isSectionLocked(modelPlanID, section) {
		return
	}

	status := taskListSectionLocks[modelPlanID][section]
	if principal == status.LockedBy {
		taskListSectionLockMutex.Lock()
		delete(taskListSectionLocks[modelPlanID], section)
		taskListSectionLockMutex.Unlock()
	}

	pubsub.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeRemoved,
		LockStatus: &status,
	})
}

func isSectionLocked(modelPlanID uuid.UUID, section string) bool {
	session, found := taskListSectionLocks[modelPlanID]
	if !found {
		return false
	}

	_, found = session[section]
	return found
}
