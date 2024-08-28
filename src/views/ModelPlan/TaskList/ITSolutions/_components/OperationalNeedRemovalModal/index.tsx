import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { useUpdateCustomOperationalNeedByIdMutation } from 'gql/gen/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';

type OperationalNeedRemovalModalTypes = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  modelID: string;
  id: string;
  nameOther: string;
};

const OperationalNeedRemovalModal = ({
  isModalOpen,
  setIsModalOpen,
  modelID,
  id,
  nameOther
}: OperationalNeedRemovalModalTypes) => {
  const { t } = useTranslation('opSolutionsMisc');
  const [removeNeed] = useUpdateCustomOperationalNeedByIdMutation();

  const history = useHistory();
  const { showMessage, showMessageOnNextPage } = useMessage();

  const handleRemove = () => {
    removeNeed({
      variables: {
        id,
        customNeedType: nameOther,
        needed: false
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessageOnNextPage(
            <Alert type="success" slim className="margin-y-4">
              <span className="mandatory-fields-alert__text">
                {t('successMessage.operationalNeedRemoval', {
                  operationalNeedName: nameOther
                })}
              </span>
            </Alert>
          );
          history.push(
            `/models/${modelID}/collaboration-area/task-list/it-solutions`
          );
          setIsModalOpen(false);
        }
      })
      .catch(errors => {
        showMessage(
          <Alert type="error" slim className="margin-y-4">
            <span className="mandatory-fields-alert__text">
              {t('errorMessage.operationalNeedRemoval', {
                operationalNeedName: nameOther
              })}
            </span>
          </Alert>
        );
        setIsModalOpen(false);
      });
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {t('removeNeedModal.heading', {
            operationalNeedName: nameOther
          })}
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">
          {t('removeNeedModal.warning')}
        </p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => handleRemove()}
        >
          {t('removeNeedModal.confirmButton')}
        </Button>
        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          {t('removeNeedModal.cancel')}
        </Button>
      </Modal>
    </>
  );
};

export default OperationalNeedRemovalModal;
