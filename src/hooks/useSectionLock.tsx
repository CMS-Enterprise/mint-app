import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LockableSection } from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import SectionLockComponent from 'components/SectionLock';
import { SubscriptionContext } from 'contexts/PageLockContext';

type SectionLockType = {
  section: LockableSection;
};

/**
 * Custom hook to manage the lock state of a section.
 * * @param {LockableSection} param.section - The section to check the lock state for.
 *
 * @returns {React.ReactElement | null} SectionLock - The component to render the lock state.
 * @returns {boolean} isLocked - A boolean indicating if the section is locked by another user.
 */

const useSectionLock = ({ section }: SectionLockType) => {
  const { euaId } = useSelector((state: AppState) => state.auth);

  // Get the lockable sections from the SubscriptionContext
  const { lockableSectionLocks } = useContext(SubscriptionContext);

  // Find the lock for the specified section
  const sectionLock = lockableSectionLocks?.find(
    lock => lock.section === section
  );

  // Determine if the section is self-locked by the current user
  const selfLocked = sectionLock?.lockedByUserAccount.username === euaId;

  const SectionLock = () => {
    return <SectionLockComponent section={section} />;
  };

  return { SectionLock, isLocked: !!sectionLock && !selfLocked };
};

export default useSectionLock;
