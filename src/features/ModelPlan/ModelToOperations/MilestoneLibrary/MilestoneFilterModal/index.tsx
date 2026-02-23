import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { MilestoneFilters } from './getMilestoneFilters';
import MilestoneFilterGroup from './MilestoneFilterGroup';

import './index.scss';

type MilestoneFilterModalProps = {
  filters: MilestoneFilters;
  setFilters: (filters: Partial<MilestoneFilters>) => void;
};

/**
 * This component displays a modal that allows the user to filter data by a given set of categories and filter options.
 *
 * Includes the "Filter" button to open the modal.
 */
const MilestoneFilterModal = ({
  filters,
  setFilters
}: MilestoneFilterModalProps) => {
  const { t } = useTranslation('general');
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} outline>
        <Icon.FilterList />
        {t('filter.title')}
      </Button>

      <ReactModal
        isOpen={isOpen}
        overlayClassName={classNames('mint-modal__overlay')}
        className={classNames('mint-modal__content', 'mint-filter-modal')}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        appElement={document.getElementById('root')!}
      >
        <div
          className={classNames(
            'display-flex flex-align-center text-base padding-y-1 padding-left-3 padding-right-1 border-bottom-1px border-base-lighter'
          )}
        >
          <h4 className="margin-bottom-0 margin-top-05">{t('filter.title')}</h4>

          <button
            type="button"
            className="mint-modal__x-button text-base"
            aria-label="Close Modal"
            data-testid="close-icon"
            onClick={closeModal}
          >
            <Icon.Close size={4} aria-label="close" />
          </button>
        </div>

        <div className="padding-y-2 padding-x-3">
          {filters.map(filter => (
            <MilestoneFilterGroup key={filter.key} filterGroup={filter} />
          ))}
        </div>

        <div className="border-top-1px border-base-lighter padding-y-2 padding-x-3 display-flex flex-justify">
          <Button type="button" unstyled>
            {t('filter.clearAll')}
          </Button>

          <Button type="button" onClick={closeModal}>
            {t('filter.applyFilter')}
          </Button>
        </div>
      </ReactModal>
    </>
  );
};

export default MilestoneFilterModal;
