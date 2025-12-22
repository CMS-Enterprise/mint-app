import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import {
  useDeleteKeyContactCategoryMutation,
  useDeleteKeyContactMutation
} from 'gql/generated/graphql';
import GetAllKeyContactCategories from 'gql/operations/KeyContactDirectory/GetAllKeyContactCategories';
import GetAllKeyContacts from 'gql/operations/KeyContactDirectory/GetAllKeyContacts';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';

import { SmeType } from '../..';
import { KeyContactCategoryType } from '../CategoryModal';

const RemoveModal = ({
  isModalOpen,
  closeModal,
  removedObject
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  removedObject: SmeType | KeyContactCategoryType;
}) => {
  const { t: keyContactT } = useTranslation('keyContactMisc');
  const { t: keyContactCategoryT } = useTranslation('keyContactCategoryMisc');

  const { setErrorMeta } = useErrorMessage();

  const getModalStrings = (
    field: 'title' | 'actionWarning' | 'text' | 'cta' | 'success' | 'error'
  ) => {
    switch (removedObject.__typename) {
      case 'KeyContact':
        return {
          i18nKey: `keyContactMisc:remove.${field}`,
          text: keyContactT(`remove.${field}`)
        };
      case 'KeyContactCategory':
        return {
          i18nKey: `keyContactCategoryMisc:remove.${field}`,
          text: keyContactCategoryT(`remove.${field}`)
        };
      default:
        throw new Error(
          `remove object ${JSON.stringify(removedObject)}is incorrect`
        );
    }
  };

  const useMutation =
    removedObject.__typename === 'KeyContact'
      ? useDeleteKeyContactMutation
      : useDeleteKeyContactCategoryMutation;

  const [deleteObject] = useMutation();

  const removeObject = (id: string) => {
    setErrorMeta({
      overrideMessage: getModalStrings('error').text
    });

    deleteObject({
      variables: {
        id
      },
      refetchQueries:
        removedObject.__typename === 'KeyContact'
          ? [GetAllKeyContacts]
          : [GetAllKeyContactCategories, GetAllKeyContacts]
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey={getModalStrings('success').i18nKey}
            values={{
              name: removedObject.name
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );

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
      testId="remove-key-contact-directory-modal"
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {getModalStrings('title').text}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {getModalStrings('actionWarning').text}
        </p>

        <Trans
          i18nKey={getModalStrings('text').i18nKey}
          values={{
            name: removedObject.name
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
            {getModalStrings('cta').text}
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
