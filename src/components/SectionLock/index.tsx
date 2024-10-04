import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { LockableSection } from 'gql/generated/graphql';

import { AvatarCircle } from 'components/Avatar';
import { SubscriptionContext } from 'contexts/PageLockContext';

type SectionLockProps = {
  section: LockableSection;
};

const SectionLock = ({ section }: SectionLockProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  const { lockableSectionLocks } = useContext(SubscriptionContext);

  const sectionLock = lockableSectionLocks?.find(
    lock => lock.section === section
  );

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
