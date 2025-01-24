import React, { createContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import EditSolutionForm from 'features/ModelPlan/ModelToOperations/_components/EditSolutionForm';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';

interface EditMTOSolutionContextType {
  openEditSolutionModal: (solutionID: string) => void;
  setSolutionID: (solutionID: string) => void;
}

const EditMTOSolutionContext = createContext<EditMTOSolutionContextType>({
  openEditSolutionModal: () => {},
  setSolutionID: () => {}
});

const EditMTOSolutionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const params = new URLSearchParams(history.location.search);

  const solutionParam = params.get('edit-solution');

  const [isModalOpen, setIsModalOpen] = useState(!!solutionParam);

  const [solutionID, setSolutionID] = useState<string>('');

  useEffect(() => {
    if (solutionParam === solutionID) {
      setIsModalOpen(true);
    }
  }, [solutionParam, solutionID, setIsModalOpen]);

  const submitted = useRef<boolean>(false);

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [leavePage, setLeavePage] = useState<boolean>(false);

  const closeModal = () => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else if (!isDirty || submitted.current) {
      params.delete('edit-solution');
      params.delete('select-milestones');
      history.push({ search: params.toString() });
      setLeavePage(false);
      setIsModalOpen(false);
      submitted.current = false;
    }
  };

  const openEditSolutionModal = (id: string) => {
    params.set('edit-solution', id);
    history.push({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <EditMTOSolutionContext.Provider
      value={{
        openEditSolutionModal,
        setSolutionID
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editSolution.solutionTitle')}
          testid="edit-solution-sidepanel"
          modalHeading={modelToOperationsMiscT(
            'modal.editSolution.solutionTitle'
          )}
          noScrollable
        >
          <EditSolutionForm
            closeModal={closeModal}
            setIsDirty={setIsDirty}
            submitted={submitted}
          />
        </Sidepanel>

        <Modal
          isOpen={leavePage && !submitted.current}
          closeModal={() => setLeavePage(false)}
          className="confirmation-modal"
        >
          <PageHeading
            headingLevel="h3"
            className="margin-top-neg-2 margin-bottom-1"
          >
            {modelToOperationsMiscT('modal.editSolution.leaveConfim.heading')}
          </PageHeading>

          <p className="margin-top-2 margin-bottom-3">
            {modelToOperationsMiscT(
              'modal.editSolution.leaveConfim.description'
            )}
          </p>

          <Button
            type="button"
            className="margin-right-4 bg-error"
            onClick={() => {
              params.delete('edit-solution');
              history.replace({ search: params.toString() });
              setIsModalOpen(false);
              setIsDirty(false);
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT('modal.editSolution.leaveConfim.confirm')}
          </Button>

          <Button
            type="button"
            unstyled
            onClick={() => {
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT('modal.editSolution.leaveConfim.dontLeave')}
          </Button>
        </Modal>
      </>
      {children}
    </EditMTOSolutionContext.Provider>
  );
};

export { EditMTOSolutionContext, EditMTOSolutionProvider };
