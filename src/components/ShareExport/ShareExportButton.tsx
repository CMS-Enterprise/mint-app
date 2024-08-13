import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import { StatusMessageType } from 'views/ModelPlan/TaskList';

import ShareExportModal, { NavModelElemet } from '.';

import './index.scss';

const ShareExportButton = ({
  modelID,
  setStatusMessage
}: {
  modelID: string;
  setStatusMessage: (message: StatusMessageType) => void;
}) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const [defaultTab, setDefaultTab] = useState<NavModelElemet>('share');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Modal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        className="padding-0 radius-md share-export-modal__container"
        navigation
        shouldCloseOnOverlayClick
      >
        <ShareExportModal
          closeModal={() => setIsExportModalOpen(false)}
          modelID={modelID}
          setStatusMessage={setStatusMessage}
          defaultTab={defaultTab}
        />
      </Modal>

      <div ref={menuRef} style={{ all: 'inherit' }}>
        <Button
          onClick={() => setIsMenuOpen(true)}
          type="button"
          className="margin-left-1 bg-primary-lighter padding-y-1 padding-x-105 text-bold text-no-underline"
          unstyled
        >
          ...
        </Button>
        <Menu
          className="share-export-modal__menu padding-y-05 bg-white text-black position-absolute"
          items={[
            <Button
              type="button"
              onClick={() => {
                setDefaultTab('share');
                setIsExportModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-black"
              unstyled
            >
              {generalReadOnlyT('modal.shareModel')}
            </Button>,
            <Button
              type="button"
              onClick={() => {
                setDefaultTab('export');
                setIsExportModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-black"
              unstyled
            >
              {generalReadOnlyT('modal.exportModel')}
            </Button>,
            <Button
              type="button"
              onClick={() => {
                setIsExportModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="share-export-modal__menu-item text-left padding-y-1 padding-x-2 width-full text-no-underline text-red"
              unstyled
            >
              {generalReadOnlyT('modal.removeModel')}
            </Button>
          ]}
          isOpen={isMenuOpen}
        />
      </div>
    </>
  );
};
export default ShareExportButton;
