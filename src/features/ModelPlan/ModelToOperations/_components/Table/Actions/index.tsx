import React, { useState } from 'react';
import { Button } from '@trussworks/react-uswds';

import useMessage from 'hooks/useMessage';

import MTOModal from '../../Modal';

const MTOTableActions = () => {
  const { clearMessage } = useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalType, setModalType] = useState<
    'category' | 'milestone' | 'solution'
  >('category');

  return (
    <>
      <MTOModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        modalType={modalType}
      />
      <div className="margin-top-4">
        <div className="width-fit-content">
          <Button
            type="button"
            onClick={() => {
              clearMessage();
              setModalType('category');
              setIsModalOpen(true);
            }}
          >
            Add custom category
          </Button>
          <Button
            type="button"
            onClick={() => {
              clearMessage();
              setModalType('milestone');
              setIsModalOpen(true);
            }}
          >
            Add custom milestone
          </Button>
          <Button
            type="button"
            onClick={() => {
              clearMessage();
              setModalType('solution');
              setIsModalOpen(true);
            }}
            className="margin-bottom-4"
          >
            Add custom solution
          </Button>
        </div>
      </div>
    </>
  );
};

export default MTOTableActions;
