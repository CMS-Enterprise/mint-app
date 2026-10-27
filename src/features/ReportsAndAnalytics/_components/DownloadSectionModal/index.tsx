import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import type { ReportsType } from 'features/ReportsAndAnalytics';
import { ModelShareSection } from 'gql/generated/graphql';

import FilterGroup from 'components/FilterGroup';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useFetchCSVData from 'hooks/useFetchCSVData';

import { getAllModelFilters, getBasicModelFilters } from './getFilterOptions';

const DownloadSectionModal = ({
  isModalOpen,
  closeModal,
  reportType
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  reportType: ReportsType;
}) => {
  const { t: analyticsT } = useTranslation('analytics');
  const { t: generalT } = useTranslation('general');

  // Fetch all data for CSV export of all model plans
  const { fetchAllData } = useFetchCSVData();

  const getFilterOptions = () => {
    switch (reportType) {
      case 'basicModelInfo':
        return getBasicModelFilters();
      default:
        return getAllModelFilters();
    }
  };

  const filterOptions = getFilterOptions();

  const selectedFilterConfig: Record<string, string[]> = filterOptions.reduce(
    (config, filter) => ({
      ...config,
      [filter.key]: []
    }),
    {}
  );

  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, string[]>>(selectedFilterConfig);

  const isDownloadDisabled = Object.values(selectedFilters).every(
    selected => selected.length === 0
  );

  const handleDownload = () => {
    if (reportType === 'allModels') {
      fetchAllData(ModelShareSection.ALL, selectedFilters);
    } else if (reportType === 'basicModelInfo') {
      fetchAllData('basicModelInfo', selectedFilters);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="padding-bottom-8">
        <div className="margin-bottom-2">
          <PageHeading
            headingLevel="h3"
            className="margin-top-0 margin-bottom-2"
          >
            {analyticsT('configureDownload.heading')}
          </PageHeading>

          <p className="text-base-darkest margin-y-0">
            {analyticsT('configureDownload.description')}
          </p>
        </div>

        {filterOptions.map(filter => (
          <FilterGroup
            key={filter.key}
            filterGroup={filter}
            selectedFilters={selectedFilters[filter.key]}
            setSelectedFilters={selectedFilterOptions =>
              setSelectedFilters(prevSelectedFilters => ({
                ...prevSelectedFilters,
                [filter.key]: selectedFilterOptions
              }))
            }
            className="border-bottom-0 margin-bottom-3 padding-bottom-0"
            labelClass="font-body-sm margin-top-0 margin-bottom-neg-2"
          />
        ))}

        <div className="margin-top-2 display-flex mint-modal__footer">
          <Button
            type="button"
            className="margin-right-3 margin-top-0"
            disabled={isDownloadDisabled}
            onClick={handleDownload}
          >
            {analyticsT('download')}
          </Button>
          <Button
            type="button"
            className="margin-top-0 deep-underline"
            unstyled
            onClick={closeModal}
          >
            {generalT('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DownloadSectionModal;
