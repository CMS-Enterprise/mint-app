import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import EditMilestoneForm from 'features/ModelPlan/ModelToOperations/_components/EditMilestoneForm';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';

interface EditMTOMilestoneContextType {
  openEditMilestoneModal: (milestoneID: string) => void;
  setMilestoneID: (milestoneID: string) => void;
}

const EditMTOMilestoneContext = createContext<EditMTOMilestoneContextType>({
  openEditMilestoneModal: () => {},
  setMilestoneID: () => {}
});

const EditMTOMilestoneProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const milestoneParam = params.get('edit-milestone');

  const [isModalOpen, setIsModalOpen] = useState(!!milestoneParam);

  const [milestoneID, setMilestoneID] = useState<string>('');

  useEffect(() => {
    if (milestoneParam === milestoneID) {
      setIsModalOpen(true);
    }
  }, [milestoneParam, milestoneID, setIsModalOpen]);

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
        const url = new URL(closeDestination, window.location.origin); // Parse the URL
        const baseRoute = url.pathname; // Extract the base route
        const queryParams = url.search; // Extract the query parameters (if needed)

        navigate(baseRoute + queryParams, {
          state: {
            scroll: true
          }
        });
        setCloseDestination(null);
      } else {
        params.delete('edit-milestone');
        params.delete('select-solutions');
        navigate({ search: params.toString() });
      }
      setLeavePage(false);
      setIsModalOpen(false);
      submitted.current = false;
    }
  }, [isDirty, submitted, closeDestination, params, navigate]);

  useEffect(() => {
    if (closeDestination) {
      closeModal();
    }
  }, [closeDestination, closeModal]);

  const openEditMilestoneModal = (id: string) => {
    params.set('edit-milestone', id);
    navigate({ search: params.toString() });
    setIsModalOpen(true);
  };

  return (
    <EditMTOMilestoneContext.Provider
      value={{
        openEditMilestoneModal,
        setMilestoneID
      }}
    >
      <>
        <Sidepanel
          isOpen={isModalOpen}
          closeModal={closeModal}
          ariaLabel={modelToOperationsMiscT(
            'milestoneLibrary.milestoneDetails'
          )}
          testid="edit-milestone-sidepanel"
          modalHeading={modelToOperationsMiscT(
            'milestoneLibrary.milestoneDetails'
          )}
          fixed
          footer={footer}
          noScrollable
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
            {modelToOperationsMiscT('modal.editMilestone.leaveConfim.heading')}
          </PageHeading>

          <p className="margin-top-2 margin-bottom-3">
            {modelToOperationsMiscT(
              'modal.editMilestone.leaveConfim.description'
            )}
          </p>

          <Button
            type="button"
            className="margin-right-4 bg-error"
            onClick={() => {
              if (closeDestination) {
                navigate(closeDestination);
              } else {
                params.delete('edit-milestone');
                navigate({ search: params.toString() }, { replace: true });
              }
              setIsModalOpen(false);
              setIsDirty(false);
              setLeavePage(false);
            }}
          >
            {modelToOperationsMiscT('modal.editMilestone.leaveConfim.confirm')}
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
              'modal.editMilestone.leaveConfim.dontLeave'
            )}
          </Button>
        </Modal>
      </>
      {children}
    </EditMTOMilestoneContext.Provider>
  );
};

export { EditMTOMilestoneContext, EditMTOMilestoneProvider };
