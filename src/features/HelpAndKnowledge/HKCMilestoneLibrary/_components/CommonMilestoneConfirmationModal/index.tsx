import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type ActionType = 'edit' | 'remove';

const CommonMilestoneConfirmationModal = ({
  isModalOpen,
  closeModal,
  actionType,
  onConfirmClick
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  actionType: ActionType;
  onConfirmClick: () => void;
}) => {
  const { t: mtoCommonMilestoneMiscT } = useTranslation(
    'mtoCommonMilestoneMisc'
  );

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
      testId="remove-contact-modal"
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {mtoCommonMilestoneMiscT(`confirmationModal.${actionType}.heading`)}
        </PageHeading>

        <p className="margin-bottom-0">
          {mtoCommonMilestoneMiscT(`confirmationModal.${actionType}.text`)}
        </p>

        <div className="margin-top-2 display-flex mint-modal__footer">
          <Button
            type="submit"
            className={classNames('margin-right-3 margin-top-0', {
              'bg-error': actionType === 'remove'
            })}
            onClick={onConfirmClick}
          >
            {mtoCommonMilestoneMiscT(`confirmationModal.${actionType}.cta`)}
          </Button>

          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {mtoCommonMilestoneMiscT('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default CommonMilestoneConfirmationModal;
