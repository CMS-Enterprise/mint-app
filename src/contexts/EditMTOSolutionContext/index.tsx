import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

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

  const [closeDestination, setCloseDestination] = useState<string | null>(null);

  const [footer, setFooter] = useState<React.ReactNode | null>(null);

  const closeModal = useCallback(() => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else if (!isDirty || submitted.current) {
      if (closeDestination) {
        navigate(closeDestination, {
          state: {
            scroll: true
          }
        });
        setCloseDestination(null);
      } else {
        params.delete('edit-solution');
        params.delete('scroll-to-bottom');
        params.delete('select-milestones');
        setParams(params);
      }
      setLeavePage(false);
      setIsModalOpen(false);
      submitted.current = false;
    }
  }, [isDirty, submitted, params, closeDestination, navigate, setParams]);

  useEffect(() => {
    if (closeDestination) {
      closeModal();
    }
  }, [closeDestination, closeModal]);

  const openEditSolutionModal = (id: string) => {
    params.set('edit-solution', id);
    setParams(params);
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
          fixed
          footer={footer}
        >
          <EditSolutionForm
            closeModal={closeModal}
            setIsDirty={setIsDirty}
            submitted={submitted}
            setCloseDestination={setCloseDestination}
            setFooter={setFooter}
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
              if (closeDestination) {
                navigate(closeDestination);
              } else {
                params.delete('edit-solution');
                navigate({ search: params.toString() }, { replace: true });
              }
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
