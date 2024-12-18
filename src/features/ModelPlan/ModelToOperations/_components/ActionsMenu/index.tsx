import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Menu } from '@trussworks/react-uswds';
import classNames from 'classnames';
import i18next from 'i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';

import EditMilestoneForm from '../EditMilestoneForm';
import { MTORowType } from '../Table/columns';

const ActionMenu = ({
  rowType,
  MoveUp,
  MoveDown,
  milestoneID,
  primaryCategoryID,
  subCategoryID,
  name
}: {
  rowType: MTORowType;
  MoveUp: React.ReactChild;
  MoveDown: React.ReactChild;
  milestoneID: string;
  primaryCategoryID: string;
  subCategoryID?: string;
  name?: string;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { clearMessage } = useMessage();

  const history = useHistory();

  const {
    setMTOModalOpen,
    setMTOModalType,
    setCategoryID,
    setSubCategoryID,
    setCategoryName
  } = useContext(MTOModalContext);

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  const milestoneParam = params.get('edit-milestone');

  const [isModalOpen, setIsModalOpen] = useState(
    milestoneParam === milestoneID
  );

  const submitted = useRef<boolean>(false);

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [leavePage, setLeavePage] = useState<boolean>(false);

  useEffect(() => {
    if (milestoneParam === milestoneID) {
      setIsModalOpen(true);
    }
  }, [milestoneParam, milestoneID, setIsModalOpen]);

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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

  if (rowType !== 'milestone')
    return (
      <div ref={menuRef}>
        <Button
          type="button"
          style={{ fontSize: '1.25rem' }}
          className="width-auto padding-right-1 text-primary text-decoration-none text-bold float-right"
          aria-label={i18next.t('modelToOperationsMisc:table.openActionMenu')}
          unstyled
          onClick={e => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          onKeyPress={e => {
            e.stopPropagation();
          }}
        >
          &#8230;
        </Button>
        <Menu
          className={classNames(
            'share-export-modal__menu padding-top-05 padding-bottom-0 bg-white text-primary width-card-lg action-menu',
            {
              'position-absolute': !isTablet
            }
          )}
          items={[
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t('modelToOperationsMisc:table.menu.close')}
            </Button>,
            MoveUp,
            MoveDown,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setMTOModalType('milestone');
                setCategoryID(primaryCategoryID);
                if (subCategoryID) setSubCategoryID(subCategoryID);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t('modelToOperationsMisc:table.menu.addMilestone')}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setCategoryID(primaryCategoryID);
                if (rowType === 'category') {
                  setMTOModalType('category');
                } else {
                  setMTOModalType('moveSubCategory');
                  if (subCategoryID) setSubCategoryID(subCategoryID);
                }
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'addSubCategory' : 'moveToAnotherCategory'}`
              )}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setMTOModalType('editCategoryTitle');
                setCategoryName(name || '');
                if (rowType === 'category') {
                  setCategoryID(primaryCategoryID);
                } else {
                  setSubCategoryID(subCategoryID);
                }
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'editCategoryTitle' : 'editSubCategoryTitle'}`
              )}
            </Button>,
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item text-red"
              unstyled
            >
              {i18next.t(
                `modelToOperationsMisc:table.menu.${rowType === 'category' ? 'removeCategory' : 'removeSubCategory'}`
              )}
            </Button>
          ]}
          isOpen={isMenuOpen}
        />
      </div>
    );

  const closeModal = () => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else if (!isDirty || submitted.current) {
      params.delete('edit-milestone');
      history.replace({ search: params.toString() });
      setLeavePage(false);
      setIsModalOpen(false);
      submitted.current = false;
    }
  };

  return (
    <div style={{ textAlign: 'right' }}>
      <Sidepanel
        isOpen={isModalOpen}
        closeModal={closeModal}
        ariaLabel={i18next.t(
          'modelToOperationsMisc:milestoneLibrary.aboutThisMilestone'
        )}
        testid="edit-milestone-sidepanel"
        modalHeading={i18next.t(
          'modelToOperationsMisc:milestoneLibrary.aboutThisMilestone'
        )}
        noScrollable
      >
        <EditMilestoneForm
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
            params.delete('edit-milestone');
            history.replace({ search: params.toString() });
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
          {modelToOperationsMiscT('modal.editMilestone.leaveConfim.dontLeave')}
        </Button>
      </Modal>

      <Button
        type="button"
        unstyled
        className="margin-right-2"
        onClick={() => {
          params.set('edit-milestone', milestoneID);
          history.replace({ search: params.toString() });
          setIsModalOpen(true);
        }}
      >
        {i18next.t('modelToOperationsMisc:table.editDetails')}
      </Button>
    </div>
  );
};

export default ActionMenu;
