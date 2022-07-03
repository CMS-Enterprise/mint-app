package resolvers

import (
	"fmt"
	"sync"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/model/subscribers"
	"github.com/cmsgov/mint-app/pkg/models/pubsubevents"
	"github.com/cmsgov/mint-app/pkg/shared/pubsub"
)

type (
	sectionMap      map[model.TaskListSection]model.TaskListSectionLockStatus
	modelSectionMap map[uuid.UUID]sectionMap

	sessionLockController struct {
		modelSections modelSectionMap
		sync.Mutex
	}
)

var (
	planTaskListSessionLocks sessionLockController
)

func init() {
	planTaskListSessionLocks = sessionLockController{modelSections: make(modelSectionMap)}
}

// PlanTaskListSectionLocks defines an interface to implement or mock
type PlanTaskListSectionLocks interface {
	GetTaskListSectionLocks(modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error)
	SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error)
	LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) (bool, error)
	UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) (bool, error)
	UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) []model.TaskListSectionLockStatus
}

// PlanTaskListSectionLocksResolverImplementation is an implementation of the PlanTaskListSectionLocks interface
type PlanTaskListSectionLocksResolverImplementation struct {
}

// NewPlanTaskListSectionLocksResolverImplementation is a constructor to create an instance of PlanTaskListSectionLocksResolverImplementation
func NewPlanTaskListSectionLocksResolverImplementation() *PlanTaskListSectionLocksResolverImplementation {
	return &PlanTaskListSectionLocksResolverImplementation{}
}

// GetTaskListSectionLocks returns the list of locked task list sections. Any sections not included should be considered as unlocked.
func (p PlanTaskListSectionLocksResolverImplementation) GetTaskListSectionLocks(modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	sectionsLockedMap, found := planTaskListSessionLocks.modelSections[modelPlanID]
	if !found {
		return nil, nil
	}

	var sectionsLocked []*model.TaskListSectionLockStatus
	for key := range sectionsLockedMap {
		status := sectionsLockedMap[key]
		sectionsLocked = append(sectionsLocked, &status)
	}

	return sectionsLocked, nil
}

// SubscribeTaskListSectionLockChanges creates a Subscriber and registers it for the pubsubevents.TaskListSectionLocksChanged event
func (p PlanTaskListSectionLocksResolverImplementation) SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	subscriber := subscribers.NewTaskListSectionLockChangedSubscriber(principal)

	ps.Subscribe(modelPlanID, pubsubevents.TaskListSectionLocksChanged, subscriber, onDisconnect)

	return subscriber.GetChannel(), nil
}

// LockTaskListSection will lock the provided task list section on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section model.TaskListSection, principal string) (bool, error) {

	modelLocks, foundModelLocks := planTaskListSessionLocks.modelSections[modelPlanID]
	if !foundModelLocks {
		planTaskListSessionLocks.modelSections[modelPlanID] = make(sectionMap)
		modelLocks = planTaskListSessionLocks.modelSections[modelPlanID]
	}

	lockStatus, sectionIsLocked := modelLocks[section]
	if sectionIsLocked && lockStatus.LockedBy != principal {
		return false, fmt.Errorf("failed to lock section [%v], already locked by [%v]", lockStatus.Section, lockStatus.LockedBy)
	}

	status := model.TaskListSectionLockStatus{
		Section:  section,
		LockedBy: principal,
		RefCount: lockStatus.RefCount + 1,
	}

	planTaskListSessionLocks.Lock()
	planTaskListSessionLocks.modelSections[modelPlanID][section] = status
	planTaskListSessionLocks.Unlock()

	if status.RefCount == 1 {
		ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
			ChangeType: model.ChangeTypeAdded,
			LockStatus: &status,
		})
	}

	return true, nil
}

// UnlockTaskListSection will unlock the provided task list section on the provided model
//	This method will fail if the provided principal is not the person who locked the task list section
func (p PlanTaskListSectionLocksResolverImplementation) UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section model.TaskListSection, principal string) (bool, error) {
	if !isSectionLocked(modelPlanID, section) {
		return false, nil
	}

	status := planTaskListSessionLocks.modelSections[modelPlanID][section]
	if !isUserAuthorizedToEditLock(status, principal) {
		return false, fmt.Errorf("failed to unlock section [%v], user [%v] not authorized to unlock section locked by user [%v]", status.Section, principal, status.LockedBy)
	}

	status.RefCount -= 1

	if status.RefCount > 0 {
		planTaskListSessionLocks.modelSections[modelPlanID][section] = status
	} else {
		deleteTaskListLockSection(ps, modelPlanID, section, status)
	}

	return true, nil
}

func deleteTaskListLockSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section model.TaskListSection, status model.TaskListSectionLockStatus) {
	planTaskListSessionLocks.Lock()
	delete(planTaskListSessionLocks.modelSections[modelPlanID], section)
	planTaskListSessionLocks.Unlock()

	ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeRemoved,
		LockStatus: &status,
	})
}

func isUserAuthorizedToEditLock(status model.TaskListSectionLockStatus, principal string) bool {
	return principal == status.LockedBy
}

// UnlockAllTaskListSections will unlock all task list sections on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	var deletedSections []*model.TaskListSectionLockStatus
	for section, status := range planTaskListSessionLocks.modelSections[modelPlanID] {
		dupe := status
		deletedSections = append(deletedSections, &dupe)
		deleteTaskListLockSection(ps, modelPlanID, section, status)
	}

	delete(planTaskListSessionLocks.modelSections, modelPlanID)
	return deletedSections, nil
}

func isSectionLocked(modelPlanID uuid.UUID, section model.TaskListSection) bool {
	session, found := planTaskListSessionLocks.modelSections[modelPlanID]
	if !found {
		return false
	}

	_, found = session[section]
	return found
}

// GetTaskListSectionLocks is a convenience relay method to call the corresponding method on a resolver implementation
func GetTaskListSectionLocks(modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().GetTaskListSectionLocks(modelPlanID)
}

// SubscribeTaskListSectionLockChanges is a convenience relay method to call the corresponding method on a resolver implementation
func SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().SubscribeTaskListSectionLockChanges(ps, modelPlanID, principal, onDisconnect)
}

// LockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section model.TaskListSection, principal string) (bool, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().LockTaskListSection(ps, modelPlanID, section, principal)
}

// UnlockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section model.TaskListSection, principal string) (bool, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().UnlockTaskListSection(ps, modelPlanID, section, principal)
}

// UnlockAllTaskListSections is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().UnlockAllTaskListSections(ps, modelPlanID)
}
