package resolvers

import (
	"fmt"
	"sync"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/graph/model/subscribers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/models/pubsubevents"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub"
)

type (
	sectionMap      map[models.TaskListSection]model.TaskListSectionLockStatus
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
func (p PlanTaskListSectionLocksResolverImplementation) SubscribeTaskListSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, subscriber *subscribers.TaskListSectionLockChangedSubscriber, onDisconnect <-chan struct{}) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	ps.Subscribe(modelPlanID, pubsubevents.TaskListSectionLocksChanged, subscriber, onDisconnect)
	return subscriber.GetChannel(), nil
}

// LockTaskListSection will lock the provided task list section on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.TaskListSection, principal authentication.Principal) (bool, error) {

	modelLocks, foundModelLocks := planTaskListSessionLocks.modelSections[modelPlanID]
	if !foundModelLocks {
		planTaskListSessionLocks.modelSections[modelPlanID] = make(sectionMap)
		modelLocks = planTaskListSessionLocks.modelSections[modelPlanID]
	}

	lockStatus, sectionWasLocked := modelLocks[section]
	if sectionWasLocked && lockStatus.LockedByUserAccount.ID != principal.Account().ID {
		return false, fmt.Errorf("failed to lock section [%v], already locked by [%v]", lockStatus.Section, lockStatus.LockedByUserAccount.ID)
	}

	account := principal.Account()
	if account == nil {
		return false, fmt.Errorf("failed to lock section [%v], unable to retrieve user account [%v]", lockStatus.Section, lockStatus.LockedByUserAccount.ID)
	}

	status := model.TaskListSectionLockStatus{
		ModelPlanID:         modelPlanID,
		Section:             section,
		LockedByUserAccount: *account,
		IsAssessment:        principal.AllowASSESSMENT(),
	}

	planTaskListSessionLocks.Lock()
	planTaskListSessionLocks.modelSections[modelPlanID][section] = status
	planTaskListSessionLocks.Unlock()

	if !sectionWasLocked {
		ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
			ChangeType: model.ChangeTypeAdded,
			LockStatus: status,
			ActionType: model.ActionTypeNormal,
		})
	}

	return true, nil
}

// UnlockTaskListSection will unlock the provided task list section on the provided model
//
//	This method will fail if the provided principal is not the person who locked the task list section
func (p PlanTaskListSectionLocksResolverImplementation) UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.TaskListSection, userID uuid.UUID, actionType model.ActionType) (bool, error) {
	if !isSectionLocked(modelPlanID, section) {
		return false, nil
	}

	status := planTaskListSessionLocks.modelSections[modelPlanID][section]
	if !isUserAuthorizedToEditLock(status, userID) {
		return false, fmt.Errorf("failed to unlock section [%v], user [%v] not authorized to unlock section locked by user [%v]", status.Section, userID, status.LockedByUserAccount.ID)
	}

	deleteTaskListLockSection(ps, modelPlanID, section, status, actionType)
	return true, nil
}

func deleteTaskListLockSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.TaskListSection, status model.TaskListSectionLockStatus, actionType model.ActionType) {
	planTaskListSessionLocks.Lock()
	delete(planTaskListSessionLocks.modelSections[modelPlanID], section)
	planTaskListSessionLocks.Unlock()

	ps.Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, model.TaskListSectionLockStatusChanged{
		ChangeType: model.ChangeTypeRemoved,
		LockStatus: status,
		ActionType: actionType,
	})
}

func isUserAuthorizedToEditLock(status model.TaskListSectionLockStatus, userID uuid.UUID) bool {
	return userID == status.LockedByUserAccount.ID
}

// UnlockAllTaskListSections will unlock all task list sections on the provided model
func (p PlanTaskListSectionLocksResolverImplementation) UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	var deletedSections []*model.TaskListSectionLockStatus
	for section, status := range planTaskListSessionLocks.modelSections[modelPlanID] {
		dupe := status
		deletedSections = append(deletedSections, &dupe)
		deleteTaskListLockSection(ps, modelPlanID, section, status, model.ActionTypeAdmin)
	}

	delete(planTaskListSessionLocks.modelSections, modelPlanID)
	return deletedSections, nil
}

func isSectionLocked(modelPlanID uuid.UUID, section models.TaskListSection) bool {
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

// internalSubscribeToTaskListSectionLockChanges creates a new
// subscriber and subscribes it to the pubsubevents.TaskListSectionLocksChanged
// event. It returns the subscriber's channel and any error that occurred.
func internalSubscribeToTaskListSectionLockChanges(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
	onUnsubscribedCallback subscribers.OnTaskListSectionLockChangedUnsubscribedCallback,
) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	subscriber, err := subscribers.NewTaskListSectionLockChangedSubscriber(principal)
	if err != nil {
		return nil, err
	}

	subscriber.SetOnUnsubscribedCallback(onUnsubscribedCallback)

	return NewPlanTaskListSectionLocksResolverImplementation().SubscribeTaskListSectionLockChanges(
		ps,
		modelPlanID,
		subscriber,
		onDisconnect,
	)
}

// getOwnedSections returns a list of task list sections owned by a specific principal
func getOwnedSections(modelSectionLocks sectionMap, subscriber pubsub.Subscriber) []models.TaskListSection {
	var ownedSections []models.TaskListSection

	for section, status := range modelSectionLocks {
		if status.LockedByUserAccount.ID == subscriber.GetPrincipal().Account().ID {
			ownedSections = append(ownedSections, section)
		}
	}

	return ownedSections
}

// SubscribeTaskListSectionLockChanges is a convenience relay method to call the
// corresponding method on a resolver implementation
func SubscribeTaskListSectionLockChanges(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	return internalSubscribeToTaskListSectionLockChanges(
		ps,
		modelPlanID,
		principal,
		onDisconnect,
		nil,
	)
}

// OnLockTaskListSectionContext maintains a webhook monitoring changes to task
// list sections. Once that webhook dies it will auto-unlock any section locked
// by that EUAID.
func OnLockTaskListSectionContext(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *model.TaskListSectionLockStatusChanged, error) {
	return internalSubscribeToTaskListSectionLockChanges(
		ps,
		modelPlanID,
		principal,
		onDisconnect,
		onLockTaskListSectionUnsubscribeComplete,
	)
}

func onLockTaskListSectionUnsubscribeComplete(
	ps pubsub.PubSub,
	subscriber pubsub.Subscriber,
	modelPlanID uuid.UUID,
) {
	ownedSectionLocks := getOwnedSections(planTaskListSessionLocks.modelSections[modelPlanID], subscriber)

	for _, section := range ownedSectionLocks {
		_, err := UnlockTaskListSection(ps, modelPlanID, section, subscriber.GetPrincipal().Account().ID, model.ActionTypeNormal)

		if err != nil {
			fmt.Printf("Uncapturable error on websocket disconnect: %v\n", err.Error()) //TODO: can we pass a reference to the logger to the pubsub?
		}
	}
}

// LockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func LockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.TaskListSection, principal authentication.Principal) (bool, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().LockTaskListSection(ps, modelPlanID, section, principal)
}

// UnlockTaskListSection is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockTaskListSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.TaskListSection, userID uuid.UUID, actionType model.ActionType) (bool, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().UnlockTaskListSection(ps, modelPlanID, section, userID, actionType)
}

// UnlockAllTaskListSections is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockAllTaskListSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.TaskListSectionLockStatus, error) {
	return NewPlanTaskListSectionLocksResolverImplementation().UnlockAllTaskListSections(ps, modelPlanID)
}
