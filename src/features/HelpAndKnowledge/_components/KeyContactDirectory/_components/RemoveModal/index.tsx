import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import {
  KeyContactCategory,
  useDeleteKeyContactMutation
} from 'gql/generated/graphql';
import GetAllKeyContacts from 'gql/operations/KeyContactDirectory/GetAllKeyContacts';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import { SmeType } from '../..';

const RemoveModal = ({
  isModalOpen,
  closeModal,
  removedObject
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  removedObject: SmeType | KeyContactCategory;
}) => {
  const { t: keyContactT } = useTranslation('keyContactMisc');
  const isKeyContact = removedObject.__typename === 'KeyContact';

  const useMutation = useDeleteKeyContactMutation;

  const [deleteObject] = useMutation();

  const removeObject = (id: string) => {
    deleteObject({
      variables: {
        id
      },
      refetchQueries: [GetAllKeyContacts]
    }).then(response => {
      if (!response?.errors) {
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
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {keyContactT('removeSme.title')}
        </PageHeading>

        <p>{keyContactT('removeSme.actionWarning')}</p>

        <Trans
          i18nKey={keyContactT('removeSme.text')}
          values={{
            name: isKeyContact ? removedObject.name : removedObject.category
          }}
          components={{
            bold: <span className="text-bold" />
          }}
        />

        <div className="margin-top-2 display-flex mint-modal__footer">
          <Button
            type="submit"
            className="margin-right-3 margin-top-0 bg-error"
            onClick={() => removeObject(removedObject.id)}
          >
            {keyContactT('removeSme.cta')}
          </Button>

          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {keyContactT('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RemoveModal;
