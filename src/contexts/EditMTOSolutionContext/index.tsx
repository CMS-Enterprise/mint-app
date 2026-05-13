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
  openEditSolutionModal: ({
    selectedSolutionID,
    scrollToBottom,
    source
  }: {
    selectedSolutionID: string;
    scrollToBottom?: boolean;
    source?: 'milestone';
  }) => void;
}

const EditMTOSolutionContext = createContext<EditMTOSolutionContextType>({
  openEditSolutionModal: () => {}
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
  const sourceParam = params.get('source');

  // The modal is open whenever `edit-solution` is present in the query string.
  const isModalOpen = !!solutionParam;

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
        setParams(prevParams => {
          const nextParams = new URLSearchParams(prevParams);
          nextParams.delete('edit-solution');
          nextParams.delete('source');
          nextParams.delete('scroll-to-bottom');
          nextParams.delete('select-milestones');
          return nextParams;
        });
      }
      setLeavePage(false);
      submitted.current = false;
    }
  }, [isDirty, submitted, closeDestination, navigate, setParams]);

  useEffect(() => {
    if (closeDestination) {
      closeModal();
    }
  }, [closeDestination, closeModal]);

  const openEditSolutionModal = ({
    selectedSolutionID,
    scrollToBottom = false,
    source
  }: {
    selectedSolutionID: string;
    scrollToBottom?: boolean;
    source?: 'milestone';
  }) => {
    setParams(prevParams => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set('edit-solution', selectedSolutionID);

      if (scrollToBottom) {
        nextParams.set('scroll-to-bottom', 'true');
      } else {
        nextParams.delete('scroll-to-bottom');
      }

      if (source) {
        nextParams.set('source', source);
      } else {
        nextParams.delete('source');
      }

      return nextParams;
    });
  };

  return (
    <EditMTOSolutionContext.Provider
      value={{
        openEditSolutionModal
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editSolution.heading', {
            context: sourceParam || ''
          })}
          testid="edit-solution-sidepanel"
          modalHeading={modelToOperationsMiscT('modal.editSolution.heading', {
            context: sourceParam || ''
          })}
          noScrollable
          fixed
          footer={footer}
          backButton={!!sourceParam}
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
          zTop
        >
          <PageHeading
            headingLevel="h3"
            className="margin-top-neg-2 margin-bottom-1"
          >
            {modelToOperationsMiscT('modal.editSolution.leaveConfirm.heading', {
              context: sourceParam || ''
            })}
          </PageHeading>

          <p className="margin-top-2 margin-bottom-3">
            {modelToOperationsMiscT(
              'modal.editSolution.leaveConfirm.description'
            )}
          </p>

          <Button
            type="button"
            className="margin-right-4 bg-error"
            onClick={() => {
              if (closeDestination) {
                navigate(closeDestination);
              } else {
                setParams(
                  prevParams => {
                    const nextParams = new URLSearchParams(prevParams);
                    nextParams.delete('edit-solution');
                    nextParams.delete('source');
                    return nextParams;
                  },
                  { replace: true }
                );
              }
              setIsDirty(false);
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT('modal.editSolution.leaveConfirm.confirm')}
          </Button>

          <Button
            type="button"
            unstyled
            onClick={() => {
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT(
              'modal.editSolution.leaveConfirm.dontLeave'
            )}
          </Button>
        </Modal>
      </>
      {children}
    </EditMTOSolutionContext.Provider>
  );
};

export { EditMTOSolutionContext, EditMTOSolutionProvider };
