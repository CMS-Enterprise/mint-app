import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import {
  UpdateCustomOperationalNeedById as MutationType,
  UpdateCustomOperationalNeedByIdVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalNeedById';
import UpdateCustomOperationalNeedById from 'queries/ITSolutions/UpdateCustomOperationalNeedById';

type ContextTypes = {
  modelID: string;
  id: string;
  nameOther: string;
};

const OperationalNeedModalContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {},
  operationalNeed: {
    modelID: '',
    id: '',
    nameOther: ''
  },
  setOperationalNeed: (operationalNeed: ContextTypes) => {}
});

const OperationalNeedModalContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation('itSolutions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationalNeed, setOperationalNeed] = useState<ContextTypes>({
    modelID: '',
    id: '',
    nameOther: ''
  });
  const [removeNeed] = useMutation<
    MutationType,
    UpdateCustomOperationalNeedByIdVariables
  >(UpdateCustomOperationalNeedById);

  const history = useHistory();
  const { showMessage, showMessageOnNextPage } = useMessage();

  const handleRemove = () => {
    removeNeed({
      variables: {
        id: operationalNeed.id,
        customNeedType: operationalNeed.nameOther,
        needed: false
      }
    })
      .then(response => {
        if (!response?.errors) {
          showMessageOnNextPage(
            <Alert type="success" slim className="margin-y-4">
              <span className="mandatory-fields-alert__text">
                {t('successMessage.operationalNeedRemoval', {
                  operationalNeedName: operationalNeed.nameOther
                })}
              </span>
            </Alert>
          );
          history.push(
            `/models/${operationalNeed.modelID}/task-list/it-solutions`
          );
          setIsModalOpen(false);
        }
      })
      .catch(errors => {
        showMessage(
          <Alert type="error" slim className="margin-y-4">
            <span className="mandatory-fields-alert__text">
              {t('errorMessage.operationalNeedRemoval', {
                operationalNeedName: operationalNeed.nameOther
              })}
            </span>
          </Alert>
        );
        setIsModalOpen(false);
      });
  };

  return (
    <>
      <OperationalNeedModalContext.Provider
        value={{
          isModalOpen,
          setIsModalOpen,
          operationalNeed,
          setOperationalNeed
        }}
      >
        {children}
      </OperationalNeedModalContext.Provider>
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-y . rdfgv -0">
          hello world
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">Lorem ipsum dolor sit.</p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => handleRemove()}
        >
          Confirm
        </Button>
        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          cancel
        </Button>
      </Modal>
    </>
  );
};

export { OperationalNeedModalContext, OperationalNeedModalContextProvider };
