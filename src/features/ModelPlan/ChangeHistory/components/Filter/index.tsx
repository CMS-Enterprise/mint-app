import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Button, Checkbox, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CollapsableLink from 'components/CollapsableLink';
import DateTimePicker from 'components/DateTimePicker';

import getAllContributors, {
  TypeOfChange,
  TypeOfOtherChange
} from '../../filterUtil';
import { ChangeRecordType } from '../../util';

export type FilterType = {
  users: string[];
  typeOfChange: (TypeOfChange | TypeOfOtherChange)[];
  startDate: string;
  endDate: string;
};

// Component to filter change history by contributors, type of change, and date range
const Filter = ({
  changes,
  filters,
  setFilters,
  isOpen,
  closeModal,
  collaborators
}: {
  changes: ChangeRecordType[][];
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  isOpen: boolean;
  closeModal: () => void;
  collaborators: string[];
}) => {
  const { t } = useTranslation('changeHistory');

  // Maintains internal state, on submission gets set into parent with setFilters
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    ...filters.users
  ]);

  const [selectedTypeOfChange, setSelectedTypeOfChange] = useState<
    (TypeOfChange | TypeOfOtherChange)[]
  >([...filters.typeOfChange]);

  const [startDate, setStartDate] = useState<string>(filters.startDate);
  const [endDate, setEndDate] = useState<string>(filters.endDate);

  // Reset local state when modal closes without applying
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([...filters.users]);
      setSelectedTypeOfChange([...filters.typeOfChange]);
      setStartDate(filters.startDate);
      setEndDate(filters.endDate);
    }
  }, [isOpen, filters]);

  // Get all unique contributors from existing audit changes
  const contributors = getAllContributors(changes, collaborators);

  // Handle contributor change checkbox
  const handleContributorChange = (contributor: string) => {
    if (selectedUsers.includes(contributor)) {
      setSelectedUsers(prev => prev.filter(c => c !== contributor));
    } else {
      setSelectedUsers(prev => [...prev, contributor]);
    }
  };

  // Handle type of change change checkbox
  const handleTypeOfChangeChange = (type: TypeOfChange | TypeOfOtherChange) => {
    if (selectedTypeOfChange.includes(type)) {
      setSelectedTypeOfChange(prev => prev.filter(y => y !== type));
    } else {
      setSelectedTypeOfChange(prev => [...prev, type]);
    }
  };

  // Handle date range change input
  const handleDateRangeChange = (date: string, value: string) => {
    if (date === 'startDate') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  // Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
  const ModalComponent = ReactModal as any;

  return (
    <ModalComponent
      isOpen={isOpen}
      overlayClassName={classNames('mint-modal__overlay')}
      className={classNames('mint-modal__content')}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById('root')!}
    >
      <div className="mint-body-normal">
        {/* HEADING */}
        <div
          className={classNames(
            'display-flex flex-align-center text-base padding-y-1 padding-left-4 padding-right-2 border-bottom-1px border-base-lighter'
          )}
        >
          <h4 className="margin-0 flex-1">{t('filter')}</h4>

          <button
            type="button"
            className="mint-modal__x-button text-base"
            aria-label="Close Modal"
            onClick={closeModal}
          >
            <Icon.Close size={4} aria-label="close" />
          </button>
        </div>

        {/* BODY/FORM */}
        <div
          className="padding-y-2 padding-x-4 overflow-y-auto"
          style={{ maxHeight: '600px' }}
        >
          {/* Collaborators */}
          <div className="padding-bottom-2 border-bottom-1px border-base-lighter">
            <h3 className="margin-y-1">{t('users')}</h3>

            <p className="margin-0 text-base margin-bottom-3">
              {t('usersHint')}
            </p>

            <label htmlFor="collaborators" className="text-bold">
              {t('currentTeam')}
            </label>

            <div className="margin-bottom-2">
              {collaborators.map(collaborator => (
                <Checkbox
                  id="collaborators"
                  key={collaborator}
                  name={collaborator}
                  value={collaborator}
                  label={collaborator}
                  checked={selectedUsers.includes(collaborator)}
                  onChange={() => handleContributorChange(collaborator)}
                />
              ))}
            </div>

            {/* Other Contributors */}
            <CollapsableLink
              id="contributors"
              label={t('viewMore')}
              closeLabel={t('viewLess')}
              labelPosition="bottom"
              styleLeftBar={false}
              className="margin-bottom-2"
            >
              <label htmlFor="contributors" className="text-bold">
                {t('otherContributors')}
              </label>

              <div className="margin-bottom-2">
                {contributors.map(contributor => (
                  <Checkbox
                    id="contributors"
                    key={contributor}
                    name={contributor}
                    value={contributor}
                    label={contributor}
                    checked={selectedUsers.includes(contributor)}
                    onChange={() => handleContributorChange(contributor)}
                  />
                ))}
              </div>
            </CollapsableLink>
          </div>

          {/* Type of Change */}
          <div className="padding-y-4 border-bottom-1px border-base-lighter">
            <h3 className="margin-top-0 margin-bottom-3">
              {t('typeOfChange')}
            </h3>

            <label htmlFor="modelPlanSection" className="text-bold">
              {t('modelPlanSection')}
            </label>

            <div className="margin-bottom-4 margin-top-1">
              {Object.values(TypeOfChange).map(type => (
                <Checkbox
                  id={`typeOfChange-${type}`}
                  key={type}
                  name={type}
                  value={type}
                  label={t(`filterSections.${type}`)}
                  checked={selectedTypeOfChange.includes(type)}
                  onChange={() => handleTypeOfChangeChange(type)}
                />
              ))}{' '}
            </div>

            {/* Other Types of Change */}
            <label htmlFor="otherTypesOfChange" className="text-bold">
              {t('otherTypes')}
            </label>

            <div className="margin-top-1">
              {Object.values(TypeOfOtherChange).map(type => (
                <Checkbox
                  id={`typeOfChange-${type}`}
                  key={type}
                  name={type}
                  value={type}
                  label={t(`filterSections.${type}`)}
                  checked={selectedTypeOfChange.includes(type)}
                  onChange={() => handleTypeOfChangeChange(type)}
                />
              ))}{' '}
            </div>
          </div>

          {/* Date Range */}
          <div className="padding-y-4">
            <h3 className="margin-top-0 margin-bottom-1">{t('dateRange')}</h3>

            <p className="margin-0 text-base margin-bottom-3">
              {t('dateRangeHint')}
            </p>

            <Grid row gap={2} className="margin-bottom-2">
              <Grid col={6}>
                <DateTimePicker
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={date => {
                    handleDateRangeChange('startDate', date || '');
                  }}
                />
              </Grid>
              <Grid col={6}>
                <DateTimePicker
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={date => {
                    handleDateRangeChange('endDate', date || '');
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-top-1px border-base-lighter padding-y-2 padding-x-4 display-flex flex-justify">
          <Button
            type="button"
            unstyled
            onClick={() => {
              setSelectedUsers([]);
              setSelectedTypeOfChange([]);
              setStartDate('');
              setEndDate('');
            }}
          >
            {t('clearAll')}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setFilters({
                users: selectedUsers,
                typeOfChange: selectedTypeOfChange,
                startDate,
                endDate
              });
              closeModal();
            }}
          >
            {t('applyFilter')}
          </Button>
        </div>
      </div>
    </ModalComponent>
  );
};

export default Filter;
