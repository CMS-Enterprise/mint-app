import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import { SelectedWaiver } from '../SelectedWaiversTable';

const WaiverUsageReasonModal = ({
  isOpen,
  closeModal,
  selectedWaiver
}: {
  isOpen: boolean;
  closeModal: () => void;
  selectedWaiver: SelectedWaiver;
}) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { t: generalT } = useTranslation('general');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
      testId={`waiver-${selectedWaiver.id}-usage-reason-modal`}
    >
      <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-2">
        {waiverAssessmentSurveyMiscT('waiverUsageReasonModal.heading')}
      </PageHeading>

      <div className="margin-bottom-2">
        <div>
          <Trans
            i18nKey="waiverAssessmentSurveyMisc:waiverUsageReasonModal.waiverTitle"
            values={{ waiverTitle: selectedWaiver.name }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        </div>

        <div>
          <Trans
            i18nKey="waiverAssessmentSurveyMisc:waiverUsageReasonModal.usageReason"
            values={{
              usageReason:
                selectedWaiver.usingReason || miscellaneousT('notAnswered')
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        </div>
      </div>

      <Alert type="info" className="margin-bottom-6">
        {waiverAssessmentSurveyMiscT('waiverUsageReasonModal.alertText')}
      </Alert>

      <div className="margin-top-2 mint-modal__footer">
        <Button
          type="button"
          unstyled
          className="margin-right-3 margin-top-0 deep-underline"
          onClick={closeModal}
        >
          {generalT('close')}
        </Button>
      </div>
    </Modal>
  );
};

export default WaiverUsageReasonModal;
