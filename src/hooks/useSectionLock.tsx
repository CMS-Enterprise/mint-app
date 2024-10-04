import React, { useContext } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { LockableSection } from 'gql/generated/graphql';

import SectionLockComponent from 'components/SectionLock';
import { SubscriptionContext } from 'contexts/PageLockContext';

type SectionLockType = {
  section: LockableSection;
};

const useSectionLock = ({ section }: SectionLockType) => {
  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  const { lockableSectionLocks } = useContext(SubscriptionContext);

  const sectionLock = lockableSectionLocks?.find(
    lock => lock.section === section
  );

  const selfLocked = sectionLock?.lockedByUserAccount.username === euaId;

  const SectionLock = () => {
    return <SectionLockComponent section={section} />;
  };

  return { SectionLock, isLocked: !!sectionLock && !selfLocked };
};

export default useSectionLock;
