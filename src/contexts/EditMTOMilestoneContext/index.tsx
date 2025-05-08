import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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

  const history = useHistory();

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history.location.search]
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

  const closeModal = useCallback(() => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else if (!isDirty || submitted.current) {
      if (closeDestination) {
        history.push(closeDestination);
        setCloseDestination(null);
      } else {
        params.delete('edit-milestone');
        params.delete('select-solutions');
        history.push({ search: params.toString() });
      }
      setLeavePage(false);
      setIsModalOpen(false);
      submitted.current = false;
    }
  }, [isDirty, submitted, closeDestination, history, params]);

  useEffect(() => {
    if (closeDestination) {
      closeModal();
    }
  }, [closeDestination, closeModal]);

  const openEditMilestoneModal = (id: string) => {
    params.set('edit-milestone', id);
    history.push({ search: params.toString() });
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
          noScrollable
        >
          <EditMilestoneForm
            closeModal={closeModal}
            setIsDirty={setIsDirty}
            submitted={submitted}
            setCloseDestination={setCloseDestination}
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
                history.push(closeDestination);
              } else {
                params.delete('edit-milestone');
                history.replace({ search: params.toString() });
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
