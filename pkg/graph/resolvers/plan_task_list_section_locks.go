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

// PlanTaskListSectionLocks defines an interface to implement or mock
type PlanTaskListSectionLocks interface {
	GetTaskListSectionLocks(modelPlanID uuid.UUID) []*model.TaskListSectionLockStatus
	SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error)
	LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string)
	UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string)
	UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID)
}

// PlanTaskListSectionLocksResolverImplementation is an implementation of the PlanTaskListSectionLocks interface
type PlanTaskListSectionLocksResolverImplementation struct {
}

// NewPlanTaskListSectionLocksResolverImplementation is a constructor to create an instance of PlanTaskListSectionLocksResolverImplementation
func NewPlanTaskListSectionLocksResolverImplementation() *PlanTaskListSectionLocksResolverImplementation {
	return &PlanTaskListSectionLocksResolverImplementation{}
}

// GetTaskListSectionLocks returns the list of locked task list sections. Any sections not included should be considered as unlocked.
func (p PlanTaskListSectionLocksResolverImplementation) GetTaskListSectionLocks(modelPlanID uuid.UUID) []*model.TaskListSectionLockStatus {
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
func (p PlanTaskListSectionLocksResolverImplementation) SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	subscriber := subscribers.NewTaskListSectionLockChangedSubscriber(principal)

	ps.Subscribe(modelPlanID, pubsubevents.TaskListSectionLocksChanged, subscriber, onDisconnect)

	return subscriber.GetChannel(), nil
}

// LockTaskListSection will lock the provided task list section on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
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

	ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeAdded,
		LockStatus: &status,
	})
}

// UnlockTaskListSection will unlock the provided task list section on the provided model
//	This method will fail if the provided principal is not the person who locked the task list section
func (p PlanTaskListSectionLocksResolverImplementation) UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
	if !isSectionLocked(modelPlanID, section) {
		return
	}

	status := taskListSectionLocks[modelPlanID][section]
	if !isUserAuthorized(status, principal) {
		return
	}

	internalUnlockTaskListSection(ps, modelPlanID, section, status)
}

func internalUnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, status model.TaskListSectionLockStatus) {
	taskListSectionLockMutex.Lock()
	delete(taskListSectionLocks[modelPlanID], section)
	taskListSectionLockMutex.Unlock()

	ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeRemoved,
		LockStatus: &status,
	})
}

func isUserAuthorized(status model.TaskListSectionLockStatus, principal string) bool {
	return principal == status.LockedBy
}

// UnlockAllTaskListSections will unlock all task list sections on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) {
	for section, status := range taskListSectionLocks[modelPlanID] {
		internalUnlockTaskListSection(ps, modelPlanID, section, status)
	}

	delete(taskListSectionLocks, modelPlanID)
}

func isSectionLocked(modelPlanID uuid.UUID, section string) bool {
	session, found := taskListSectionLocks[modelPlanID]
	if !found {
		return false
	}

	_, found = session[section]
	return found
}

// GetTaskListSectionLocks is a convenience relay method to call the corresponding method on a resolver implementation
func GetTaskListSectionLocks(modelPlanID uuid.UUID) []*model.TaskListSectionLockStatus {
	return NewPlanTaskListSectionLocksResolverImplementation().GetTaskListSectionLocks(modelPlanID)
}

// SubscribeTaskListSectionLockChanges is a convenience relay method to call the corresponding method on a resolver implementation
func SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().SubscribeTaskListSectionLockChanges(ps, modelPlanID, principal, onDisconnect)
}

// LockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
	NewPlanTaskListSectionLocksResolverImplementation().LockTaskListSection(ps, modelPlanID, section, principal)
}

// UnlockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) {
	NewPlanTaskListSectionLocksResolverImplementation().UnlockTaskListSection(ps, modelPlanID, section, principal)
}

// UnlockAllTaskListSections is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) {
	NewPlanTaskListSectionLocksResolverImplementation().UnlockAllTaskListSections(ps, modelPlanID)
}
