import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Menu } from '@trussworks/react-uswds';
import classNames from 'classnames';
import i18next from 'i18next';

import { EditMTOMilestoneContext } from 'contexts/EditMTOMilestoneContext';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useMessage from 'hooks/useMessage';

import { MTORowType } from '../MatrixTable/columns';

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { clearMessage } = useMessage();

  const { setMTOModalOpen, setMTOModalState } = useContext(MTOModalContext);

  const { openEditMilestoneModal, setMilestoneID } = useContext(
    EditMTOMilestoneContext
  );

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

  const isUncategorized =
    primaryCategoryID === '00000000-0000-0000-0000-000000000000' ||
    subCategoryID === '00000000-0000-0000-0000-000000000000';

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
            // Add Model Milestone
            <Button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setMTOModalState({
                  modalType: 'milestone',
                  categoryID: primaryCategoryID,
                  subCategoryID: subCategoryID ?? ''
                });
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className="share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item"
              unstyled
            >
              {i18next.t('modelToOperationsMisc:table.menu.addMilestone')}
            </Button>,
            // Add Subcategory or Move to Another Category
            <Button
              type="button"
              disabled={isUncategorized}
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                if (rowType === 'category') {
                  setMTOModalState({
                    modalType: 'category',
                    categoryID: primaryCategoryID
                  });
                } else {
                  setMTOModalState({
                    modalType: 'moveSubCategory',
                    categoryID: primaryCategoryID,
                    subCategoryID,
                    categoryName: name || ''
                  });
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
            // Edit Category/Subcategory Title
            <Button
              type="button"
              disabled={isUncategorized}
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setMTOModalState({
                  modalType: 'editCategoryTitle',
                  categoryName: name ?? '',
                  rowType,
                  categoryID: primaryCategoryID,
                  subCategoryID
                });
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
            // Remove Category/Subcategory
            <Button
              type="button"
              disabled={isUncategorized}
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(false);
                clearMessage();
                setMTOModalOpen(true);
                setMTOModalState({
                  modalType:
                    rowType === 'category'
                      ? 'removeCategory'
                      : 'removeSubcategory',
                  rowType,
                  categoryID: primaryCategoryID,
                  subCategoryID
                });
              }}
              onKeyPress={e => {
                e.stopPropagation();
              }}
              className={classNames(
                'share-export-modal__menu-item padding-y-1 padding-x-2 action-menu-item ',
                {
                  'text-red': !isUncategorized
                }
              )}
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

  return (
    <div style={{ textAlign: 'right' }}>
      <Button
        type="button"
        unstyled
        onClick={() => {
          setMilestoneID(milestoneID);
          openEditMilestoneModal(milestoneID);
        }}
      >
        {i18next.t('modelToOperationsMisc:table.editDetails')}
      </Button>
    </div>
  );
};

export default ActionMenu;
