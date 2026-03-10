/**
  Subscription handler for checking lock statuses, adding locks, and removing locks
  Utilizes the SubscriptionContext to listen for updates made from locking/unlocking mutations
  Uses app location to identify the model plan and current task list section of the model plan
  Redirects locked and errors states to /locked-model-plan-section view
 */

import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  GetLockedModelPlanSectionsQuery,
  LockableSection,
  useLockModelPlanSectionMutation,
  useUnlockModelPlanSectionMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import { SubscriptionContext } from 'contexts/PageLockContext';
import { RouterContext } from 'contexts/RouterContext';
import { isUUID } from 'utils/modelPlan';

type LockSectionType =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

type SubscriptionHandlerProps = {
  children: React.ReactNode;
};

export enum LockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OCCUPYING = 'OCCUPYING',
  CANT_LOCK = 'CANT_LOCK'
}

type LockableSectionMapType = {
  [key: string]: LockableSection;
};

// Map used to connect url route to Subscription Task List Section
export const modelPlanSectionMap: LockableSectionMapType = {
  basics: LockableSection.BASICS,
  beneficiaries: LockableSection.BENEFICIARIES,
  characteristics: LockableSection.GENERAL_CHARACTERISTICS,
  'ops-eval-and-learning': LockableSection.OPERATIONS_EVALUATION_AND_LEARNING,
  'participants-and-providers': LockableSection.PARTICIPANTS_AND_PROVIDERS,
  payment: LockableSection.PAYMENT,
  'data-exchange-approach': LockableSection.DATA_EXCHANGE_APPROACH,
  'iddoc-questionnaire': LockableSection.IDDOC_QUESTIONNAIRE,
  'model-to-operations': LockableSection.MODELS_TO_OPERATION_MATRIX,
  'model-timeline': LockableSection.TIMELINE
};

// Find lock and sets the LockStatus of the current task list section
// Returns - LOCKED || UNLOCKED || OCCUPYING
export const findLockedSection = (
  locks: LockSectionType[],
  route: LockableSection,
  userEUA?: string
): LockStatus => {
  const foundLockedSection = locks.find(
    (section: LockSectionType) => section.section === route
  );

  // If the locked section is not found, set to UNLOCKED, then send mutation to lock
  if (!foundLockedSection) {
    return LockStatus.UNLOCKED;
  }
  if (
    foundLockedSection &&
    foundLockedSection.lockedByUserAccount.username !== userEUA
  ) {
    // If the locked section is found - render locked screen
    return LockStatus.LOCKED;
  }
  // user currently has the lock
  return LockStatus.OCCUPYING;
};

// Parses task list route to map to modelPlanSectionMap
const lockedRouteParser = (route: string): string => {
  const modelPlanRoute: string = route.split('/')[4];

  if (
    modelPlanRoute === 'model-to-operations' ||
    modelPlanRoute === 'model-timeline'
  ) {
    return modelPlanRoute;
  }
  return route.split('/')[5];
};

const PageLockWrapper = ({ children }: SubscriptionHandlerProps) => {
  // Context used to get/set previous routes
  const { to, from, setRoute } = useContext(RouterContext);

  // Get the subscription context - messages (locks, unlocks), loading
  const { lockableSectionLocks, loading } = useContext(SubscriptionContext);

  const navigate = useNavigate();

  const modelID: string = to.split('/')[2];
  const modelPlanRoute: string = to.split('/')[4];
  const isReadView: boolean = to.split('/')[3] === 'read-view';

  const isLockable: boolean =
    modelPlanRoute === 'model-plan' ||
    modelPlanRoute === 'additional-questionnaires' ||
    (modelPlanRoute === 'model-timeline' && !isReadView) ||
    (modelPlanRoute === 'model-to-operations' && !isReadView);

  const taskListRoute = lockedRouteParser(to);

  const { euaId } = useSelector((state: AppState) => state.auth);

  const validModelID: boolean = isUUID(modelID);

  const modelPlanSection: LockableSection = modelPlanSectionMap[taskListRoute];

  const [addLock, { loading: addLockLoading }] =
    useLockModelPlanSectionMutation();

  const [removeLock, { loading: removeLockLoading }] =
    useUnlockModelPlanSectionMutation();

  let lockState: LockStatus;

  // Checks to see the status of task list section
  // Returns - 'LOCKED', 'UNLOCKED', 'OCCUPYING', or 'CANT_LOCK' (pages that don't require locking)
  // 'OCCUPYING' refers to the current user already occupying the page
  if (
    modelPlanSection &&
    lockableSectionLocks &&
    euaId &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading
  ) {
    lockState = findLockedSection(
      lockableSectionLocks,
      modelPlanSection,
      euaId as string
    );
  } else {
    lockState = LockStatus.CANT_LOCK;
  }

  if (lockState === LockStatus.LOCKED) {
    return (
      <Navigate
        to={`/models/${modelID}/locked-model-plan-section`}
        state={{ route: taskListRoute }}
        replace
      />
    );
  }

  // Removes a section that is locked
  const removeLockedSection = (section: LockSectionType) => {
    removeLock({
      variables: {
        modelPlanID: section.modelPlanID,
        section: section.section
      }
    })
      .then(() => {
        setRoute((prev: any) => ({
          to,
          from: prev.to
        }));
      })
      .catch(() => {
        navigate(`/models/${modelID}/locked-model-plan-section`, {
          // Passing error status to default error page
          state: { route: taskListRoute, error: true }
        });
      });
  };

  // Removes a section that is locked
  const addLockedSection = (section: LockableSection) => {
    addLock({
      variables: {
        modelPlanID: modelID,
        section
      }
    }).catch(() => {
      navigate(`/models/${modelID}/locked-model-plan-section`, {
        // Passing error status to default error page
        state: { route: taskListRoute, error: true }
      });
    });
  };

  // Checks to see if section should be unlocked
  if (
    validModelID &&
    !modelPlanSection &&
    lockableSectionLocks?.length > 0 &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading &&
    from && // from will be undefined or empty string if refreshed
    from !== to
  ) {
    // Located section to be removed
    const lockedSection = lockableSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedByUserAccount.username === euaId &&
        section.section === modelPlanSectionMap[lockedRouteParser(from)]
    );

    if (lockedSection) removeLockedSection(lockedSection);
  }

  // Checks to see if section should be locked and calls mutation to add lock
  if (
    (lockState === LockStatus.UNLOCKED || lockState === LockStatus.OCCUPYING) &&
    isLockable &&
    modelPlanSection &&
    validModelID &&
    !addLockLoading &&
    !removeLockLoading &&
    !loading
  ) {
    // Check if need to unlock previous section before adding new section
    // i.e. end of task list section or any react-router redirect from one section directly to another
    const prevLockedSection = lockableSectionLocks.find(
      (section: LockSectionType) =>
        section.lockedByUserAccount.username === euaId &&
        modelPlanSectionMap[lockedRouteParser(from)] === section.section &&
        modelPlanSectionMap[lockedRouteParser(to)] !== section.section &&
        from !== to
    );

    if (prevLockedSection) {
      removeLockedSection(prevLockedSection);
    }

    if (lockState === LockStatus.UNLOCKED) {
      addLockedSection(modelPlanSection);
    }
  }

  return <div>{children}</div>;
};

export default PageLockWrapper;
