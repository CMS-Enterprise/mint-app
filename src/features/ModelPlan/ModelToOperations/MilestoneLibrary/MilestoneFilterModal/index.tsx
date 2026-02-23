import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoFacilitator } from 'gql/generated/graphql';

import { MilestoneFilters } from './getMilestoneFilters';
import MilestoneFilterGroup from './MilestoneFilterGroup';

import './index.scss';

export type MilestoneSelectedFilters = {
  categoryName: string[];
  facilitatedByRole: MtoFacilitator[];
};

type MilestoneFilterModalProps = {
  filters: MilestoneFilters;
  appliedFilters: MilestoneSelectedFilters;
  setAppliedFilters: (filters: MilestoneSelectedFilters) => void;
};

/**
 * This component displays a modal that allows the user to filter data by a given set of categories and filter options.
 *
 * Includes the "Filter" button to open the modal.
 */
const MilestoneFilterModal = ({
  filters,
  appliedFilters,
  setAppliedFilters
}: MilestoneFilterModalProps) => {
  const { t } = useTranslation('general');
  const [isOpen, setIsOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] =
    useState<MilestoneSelectedFilters>(appliedFilters);

  useEffect(() => {
    if (isOpen) {
      setSelectedFilters(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(selectedFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: MilestoneSelectedFilters = {
      categoryName: [],
      facilitatedByRole: []
    };
    setSelectedFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setIsOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} outline>
        <Icon.FilterList aria-hidden />
        {t('filter.title')}
      </Button>

      <ReactModal
        isOpen={isOpen}
        overlayClassName={classNames('mint-modal__overlay')}
        className={classNames('mint-modal__content', 'mint-filter-modal')}
        onRequestClose={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
          >
            <Icon.Close size={4} aria-label="close" />
          </button>
        </div>

        <div className="padding-y-2 padding-x-3">
          {filters.map(filter => (
            <MilestoneFilterGroup
              key={filter.key}
              filterGroup={filter}
              selectedFilters={selectedFilters[filter.key]}
              setSelectedFilters={selectedFilterOptions =>
                setSelectedFilters({
                  ...selectedFilters,
                  [filter.key]: selectedFilterOptions
                })
              }
            />
          ))}
        </div>

        <div className="border-top-1px border-base-lighter padding-y-2 padding-x-3 display-flex flex-justify">
          <Button type="button" unstyled onClick={handleClearFilters}>
            {t('filter.clearAll')}
          </Button>

          <Button type="button" onClick={handleApplyFilters}>
            {t('filter.applyFilter')}
          </Button>
        </div>
      </ReactModal>
    </>
  );
};

export default MilestoneFilterModal;
