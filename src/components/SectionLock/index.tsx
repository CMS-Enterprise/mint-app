import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { LockableSection } from 'gql/generated/graphql';

import { AvatarCircle } from 'components/Avatar';
import { SubscriptionContext } from 'contexts/PageLockContext';

type SectionLockProps = {
  section: LockableSection;
};

// Component to display the lock state of a section
const SectionLock = ({ section }: SectionLockProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  // Get the lockable sections from the SubscriptionContext
  const { lockableSectionLocks } = useContext(SubscriptionContext);

  // Find the lock for the specified section
  const sectionLock = lockableSectionLocks?.find(
    lock => lock.section === section
  );

  // If current section lock is not found, return null
  if (!sectionLock) {
    return null;
  }

  const lockMessage = sectionLock.isAssessment
    ? t('assessmentLocked', {
        assessmentUser: sectionLock.lockedByUserAccount?.commonName
      })
    : t('locked', {
        teamMember: sectionLock.lockedByUserAccount?.commonName
      });

  // Determine if the section is self-locked by the current user
  const selfLocked = sectionLock.lockedByUserAccount.username === euaId;

  return (
    <>
      {sectionLock.lockedByUserAccount && (
        <div className="display-inline-flex">
          <AvatarCircle
            user={sectionLock.lockedByUserAccount.commonName}
            isAssessment={sectionLock.isAssessment}
            className="margin-right-1"
          />

          <div className="display-flex flex-align-center line-height-body-4 text-base">
            {selfLocked ? t('selfLocked') : lockMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default SectionLock;
