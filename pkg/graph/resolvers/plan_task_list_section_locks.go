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
	sectionMap      map[models.LockableSection]model.LockableSectionLockStatus
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

// LockableSectionLocks defines an interface to implement or mock
type LockableSectionLocks interface {
	GetLockableSectionLocks(modelPlanID uuid.UUID) ([]*model.LockableSectionLockStatus, error)
	SubscribeLockableSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, principal string, onDisconnect <-chan struct{}) (<-chan *model.LockableSectionLockStatusChanged, error)
	LockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) (bool, error)
	UnlockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section string, principal string) (bool, error)
	UnlockAllLockableSections(ps pubsub.PubSub, modelPlanID uuid.UUID) []model.LockableSectionLockStatus
}

// LockableSectionLocksResolverImplementation is an implementation of the LockableSectionLocks interface
type LockableSectionLocksResolverImplementation struct {
}

// NewLockableSectionLocksResolverImplementation is a constructor to create an instance of LockableSectionLocksResolverImplementation
func NewLockableSectionLocksResolverImplementation() *LockableSectionLocksResolverImplementation {
	return &LockableSectionLocksResolverImplementation{}
}

// GetLockableSectionLocks returns the list of locked task list sections. Any sections not included should be considered as unlocked.
func (p LockableSectionLocksResolverImplementation) GetLockableSectionLocks(modelPlanID uuid.UUID) ([]*model.LockableSectionLockStatus, error) {
	sectionsLockedMap, found := planTaskListSessionLocks.modelSections[modelPlanID]
	if !found {
		return nil, nil
	}

	var sectionsLocked []*model.LockableSectionLockStatus
	for key := range sectionsLockedMap {
		status := sectionsLockedMap[key]
		sectionsLocked = append(sectionsLocked, &status)
	}

	return sectionsLocked, nil
}

// SubscribeLockableSectionLockChanges creates a Subscriber and registers it for the pubsubevents.LockableSectionLocksChanged event
func (p LockableSectionLocksResolverImplementation) SubscribeLockableSectionLockChanges(ps pubsub.PubSub, modelPlanID uuid.UUID, subscriber *subscribers.LockableSectionLockChangedSubscriber, onDisconnect <-chan struct{}) (<-chan *model.LockableSectionLockStatusChanged, error) {
	ps.Subscribe(modelPlanID, pubsubevents.LockableSectionLocksChanged, subscriber, onDisconnect)
	return subscriber.GetChannel(), nil
}

// LockLockableSection will lock the provided task list section on the provided model
func (p LockableSectionLocksResolverImplementation) LockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.LockableSection, principal authentication.Principal) (bool, error) {

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

	status := model.LockableSectionLockStatus{
		ModelPlanID:         modelPlanID,
		Section:             section,
		LockedByUserAccount: *account,
		IsAssessment:        principal.AllowASSESSMENT(),
	}

	planTaskListSessionLocks.Lock()
	planTaskListSessionLocks.modelSections[modelPlanID][section] = status
	planTaskListSessionLocks.Unlock()

	if !sectionWasLocked {
		ps.Publish(modelPlanID, pubsubevents.LockableSectionLocksChanged, model.LockableSectionLockStatusChanged{
			ChangeType: model.ChangeTypeAdded,
			LockStatus: status,
			ActionType: model.ActionTypeNormal,
		})
	}

	return true, nil
}

// UnlockLockableSection will unlock the provided task list section on the provided model
//
//	This method will fail if the provided principal is not the person who locked the task list section
func (p LockableSectionLocksResolverImplementation) UnlockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.LockableSection, userID uuid.UUID, actionType model.ActionType) (bool, error) {
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

func deleteTaskListLockSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.LockableSection, status model.LockableSectionLockStatus, actionType model.ActionType) {
	planTaskListSessionLocks.Lock()
	delete(planTaskListSessionLocks.modelSections[modelPlanID], section)
	planTaskListSessionLocks.Unlock()

	ps.Publish(modelPlanID, pubsubevents.LockableSectionLocksChanged, model.LockableSectionLockStatusChanged{
		ChangeType: model.ChangeTypeRemoved,
		LockStatus: status,
		ActionType: actionType,
	})
}

func isUserAuthorizedToEditLock(status model.LockableSectionLockStatus, userID uuid.UUID) bool {
	return userID == status.LockedByUserAccount.ID
}

// UnlockAllLockableSections will unlock all task list sections on the provided model
func (p LockableSectionLocksResolverImplementation) UnlockAllLockableSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.LockableSectionLockStatus, error) {
	var deletedSections []*model.LockableSectionLockStatus
	for section, status := range planTaskListSessionLocks.modelSections[modelPlanID] {
		dupe := status
		deletedSections = append(deletedSections, &dupe)
		deleteTaskListLockSection(ps, modelPlanID, section, status, model.ActionTypeAdmin)
	}

	delete(planTaskListSessionLocks.modelSections, modelPlanID)
	return deletedSections, nil
}

func isSectionLocked(modelPlanID uuid.UUID, section models.LockableSection) bool {
	session, found := planTaskListSessionLocks.modelSections[modelPlanID]
	if !found {
		return false
	}

	_, found = session[section]
	return found
}

// GetLockableSectionLocks is a convenience relay method to call the corresponding method on a resolver implementation
func GetLockableSectionLocks(modelPlanID uuid.UUID) ([]*model.LockableSectionLockStatus, error) {
	return NewLockableSectionLocksResolverImplementation().GetLockableSectionLocks(modelPlanID)
}

// internalSubscribeToLockableSectionLockChanges creates a new
// subscriber and subscribes it to the pubsubevents.LockableSectionLocksChanged
// event. It returns the subscriber's channel and any error that occurred.
func internalSubscribeToLockableSectionLockChanges(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
	onUnsubscribedCallback subscribers.OnLockableSectionLockChangedUnsubscribedCallback,
) (<-chan *model.LockableSectionLockStatusChanged, error) {
	subscriber, err := subscribers.NewLockableSectionLockChangedSubscriber(principal)
	if err != nil {
		return nil, err
	}

	subscriber.SetOnUnsubscribedCallback(onUnsubscribedCallback)

	return NewLockableSectionLocksResolverImplementation().SubscribeLockableSectionLockChanges(
		ps,
		modelPlanID,
		subscriber,
		onDisconnect,
	)
}

// getOwnedSections returns a list of task list sections owned by a specific principal
func getOwnedSections(modelSectionLocks sectionMap, subscriber pubsub.Subscriber) []models.LockableSection {
	var ownedSections []models.LockableSection

	for section, status := range modelSectionLocks {
		if status.LockedByUserAccount.ID == subscriber.GetPrincipal().Account().ID {
			ownedSections = append(ownedSections, section)
		}
	}

	return ownedSections
}

// SubscribeLockableSectionLockChanges is a convenience relay method to call the
// corresponding method on a resolver implementation
func SubscribeLockableSectionLockChanges(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *model.LockableSectionLockStatusChanged, error) {
	return internalSubscribeToLockableSectionLockChanges(
		ps,
		modelPlanID,
		principal,
		onDisconnect,
		nil,
	)
}

// OnLockLockableSectionContext maintains a webhook monitoring changes to task
// list sections. Once that webhook dies it will auto-unlock any section locked
// by that EUAID.
func OnLockLockableSectionContext(
	ps pubsub.PubSub,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
	onDisconnect <-chan struct{},
) (<-chan *model.LockableSectionLockStatusChanged, error) {
	return internalSubscribeToLockableSectionLockChanges(
		ps,
		modelPlanID,
		principal,
		onDisconnect,
		onLockLockableSectionUnsubscribeComplete,
	)
}

func onLockLockableSectionUnsubscribeComplete(
	ps pubsub.PubSub,
	subscriber pubsub.Subscriber,
	modelPlanID uuid.UUID,
) {
	ownedSectionLocks := getOwnedSections(planTaskListSessionLocks.modelSections[modelPlanID], subscriber)

	for _, section := range ownedSectionLocks {
		_, err := UnlockLockableSection(ps, modelPlanID, section, subscriber.GetPrincipal().Account().ID, model.ActionTypeNormal)

		if err != nil {
			fmt.Printf("Uncapturable error on websocket disconnect: %v\n", err.Error()) //TODO: can we pass a reference to the logger to the pubsub?
		}
	}
}

// LockLockableSection is a convenience relay method to call the corresponding method on a resolver implementation
func LockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.LockableSection, principal authentication.Principal) (bool, error) {
	return NewLockableSectionLocksResolverImplementation().LockLockableSection(ps, modelPlanID, section, principal)
}

// UnlockLockableSection is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockLockableSection(ps pubsub.PubSub, modelPlanID uuid.UUID, section models.LockableSection, userID uuid.UUID, actionType model.ActionType) (bool, error) {
	return NewLockableSectionLocksResolverImplementation().UnlockLockableSection(ps, modelPlanID, section, userID, actionType)
}

// UnlockAllLockableSections is a convenience relay method to call the corresponding method on a resolver implementation
func UnlockAllLockableSections(ps pubsub.PubSub, modelPlanID uuid.UUID) ([]*model.LockableSectionLockStatus, error) {
	return NewLockableSectionLocksResolverImplementation().UnlockAllLockableSections(ps, modelPlanID)
}
