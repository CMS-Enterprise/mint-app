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
import classNames from 'classnames';
import EditMilestoneForm from 'features/ModelPlan/ModelToOperations/_components/EditMilestoneForm';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';

interface EditMTOMilestoneContextType {
  openEditMilestoneModal: ({
    selectedMilestoneID,
    source
  }: {
    selectedMilestoneID: string;
    source?: 'solution';
  }) => void;
}

const EditMTOMilestoneContext = createContext<EditMTOMilestoneContextType>({
  openEditMilestoneModal: () => {}
});

const EditMTOMilestoneProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

  const milestoneParam = params.get('edit-milestone');
  const solutionParam = params.get('edit-solution');
  const sourceParam = params.get('source');

  // The modal is open whenever `edit-milestone` is present in the query string.
  const isModalOpen = !!milestoneParam;

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
        const url = new URL(closeDestination, window.location.origin);
        const baseRoute = url.pathname;
        const queryParams = url.search;

        navigate(baseRoute + queryParams, {
          state: {
            scroll: true
          }
        });
        setCloseDestination(null);
      } else {
        setParams(prevParams => {
          const nextParams = new URLSearchParams(prevParams);
          nextParams.delete('edit-milestone');
          nextParams.delete('source');
          nextParams.delete('select-solutions');
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

  const openEditMilestoneModal = ({
    selectedMilestoneID,
    source
  }: {
    selectedMilestoneID: string;
    source?: 'solution';
  }) => {
    setParams(prevParams => {
      const nextParams = new URLSearchParams(prevParams);
      nextParams.set('edit-milestone', selectedMilestoneID);

      if (source) {
        nextParams.set('source', source);
      } else {
        nextParams.delete('source');
      }

      return nextParams;
    });
  };

  return (
    <EditMTOMilestoneContext.Provider
      value={{
        openEditMilestoneModal
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT('modal.editMilestone.heading', {
            context: sourceParam || ''
          })}
          testid="edit-milestone-sidepanel"
          modalHeading={modelToOperationsMiscT('modal.editMilestone.heading', {
            context: sourceParam || ''
          })}
          fixed
          footer={footer}
          noScrollable
          overlayClassName={classNames({
            'bg-transparent': !!sourceParam,
            'z-500': sourceParam === 'solution' && !!solutionParam
          })}
          backButton={!!sourceParam}
        >
          <EditMilestoneForm
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
            {modelToOperationsMiscT(
              'modal.editMilestone.leaveConfirm.heading',
              {
                context: sourceParam || ''
              }
            )}
          </PageHeading>

          <p className="margin-top-2 margin-bottom-3">
            {modelToOperationsMiscT(
              'modal.editMilestone.leaveConfirm.description'
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
                    nextParams.delete('edit-milestone');
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
            {modelToOperationsMiscT('modal.editMilestone.leaveConfirm.confirm')}
          </Button>

          <Button
            type="button"
            unstyled
            onClick={() => {
              setCloseDestination(null);
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT(
              'modal.editMilestone.leaveConfirm.dontLeave'
            )}
          </Button>
        </Modal>
      </>
      {children}
    </EditMTOMilestoneContext.Provider>
  );
};

export { EditMTOMilestoneContext, EditMTOMilestoneProvider };
