import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { useDeleteCustomDateMutation } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { getStatusAlertBody } from 'contexts/ErrorContext';
import { setCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';

const RemoveCustomDateModal = ({
  isModalOpen,
  closeModal,
  customDateID,
  onDeleteSuccess
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  customDateID: string;
  onDeleteSuccess?: () => void;
}) => {
  const { t: customDateMiscT } = useTranslation('customDateMisc');

  const [deleteCustomDate] = useDeleteCustomDateMutation();

  const removeCustomDate = (id: string) => {
    setCurrentErrorMeta({
      overrideMessage: getStatusAlertBody({
        type: 'error',
        message: customDateMiscT('remove.error')
      })
    });

    deleteCustomDate({
      variables: {
        id
      }
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey="customDateMisc:remove.success"
            values={{
              name: response.data?.deleteCustomTimelineDate?.title || ''
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );
        if (onDeleteSuccess) onDeleteSuccess();
        closeModal();
      }
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
      testId="remove-custom-date-modal"
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {customDateMiscT('remove.title')}
        </PageHeading>

        <p className="margin-y-2">{customDateMiscT('remove.text')}</p>

        <div className="display-flex mint-modal__footer">
          <Button
            type="submit"
            className="margin-right-3 margin-top-0 bg-error"
            onClick={() => removeCustomDate(customDateID)}
          >
            {customDateMiscT('remove.cta')}
          </Button>

          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {customDateMiscT('remove.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RemoveCustomDateModal;
