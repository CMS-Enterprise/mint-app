import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LockableSection } from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import SectionLockComponent from 'components/SectionLock';
import { SubscriptionContext } from 'contexts/PageLockContext';
import { isSectionLockedByOtherUser } from 'utils/lockableSectionLinking';

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

  const SectionLock = () => {
    return <SectionLockComponent section={section} />;
  };

  return {
    SectionLock,
    isLocked: isSectionLockedByOtherUser(lockableSectionLocks, section, euaId)
  };
};

export default useSectionLock;
