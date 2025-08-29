import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Button, Checkbox, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import DateTimePicker from 'components/DateTimePicker';

import getAllContributors, {
  TypeOfChange,
  TypeOfOtherChange
} from '../../filterUtil';
import { ChangeRecordType } from '../../util';

export type FilterType = {
  contributors: string[];
  typeOfChange: (TypeOfChange | TypeOfOtherChange)[];
  startDate: string;
  endDate: string;
};

const Filter = ({
  changes,
  filters,
  setFilters,
  isOpen,
  closeModal
}: {
  changes: ChangeRecordType[][];
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [selectedContributors, setSelectedContributors] = useState<string[]>([
    ...filters.contributors
  ]);

  const [selectedTypeOfChange, setSelectedTypeOfChange] = useState<
    (TypeOfChange | TypeOfOtherChange)[]
  >([...filters.typeOfChange]);

  const [startDate, setStartDate] = useState<string>(filters.startDate);
  const [endDate, setEndDate] = useState<string>(filters.endDate);

  // Reset local state when modal closes without applying
  useEffect(() => {
    if (!isOpen) {
      setSelectedContributors([...filters.contributors]);
      setSelectedTypeOfChange([...filters.typeOfChange]);
      setStartDate(filters.startDate);
      setEndDate(filters.endDate);
    }
  }, [isOpen, filters]);

  const contributors = getAllContributors(changes);

  const handleContributorChange = (contributor: string) => {
    if (selectedContributors.includes(contributor)) {
      setSelectedContributors(prev => prev.filter(c => c !== contributor));
    } else {
      setSelectedContributors(prev => [...prev, contributor]);
    }
  };

  const handleTypeOfChangeChange = (type: TypeOfChange | TypeOfOtherChange) => {
    if (selectedTypeOfChange.includes(type)) {
      setSelectedTypeOfChange(prev => prev.filter(t => t !== type));
    } else {
      setSelectedTypeOfChange(prev => [...prev, type]);
    }
  };

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
      {/* HEADING */}
      <div
        className={classNames(
          'display-flex flex-align-center text-base padding-y-1 padding-left-4 padding-right-2 border-bottom-1px border-base-lighter'
        )}
      >
        <h4 className="margin-0 flex-1">Filter</h4>

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
      <div className="padding-y-2 padding-x-4">
        {/* Contributors */}
        <div>
          <label htmlFor="contributors">Contributors</label>
          {contributors.map(contributor => (
            <Checkbox
              id={`contributor-${contributor}`}
              key={contributor}
              name={contributor}
              value={contributor}
              label={contributor}
              checked={selectedContributors.includes(contributor)}
              onChange={() => handleContributorChange(contributor)}
            />
          ))}
        </div>

        {/* Type of Change */}
        <div>
          <label htmlFor="typeOfChange">Type of Change</label>
        </div>

        {Object.values(TypeOfChange).map(type => (
          <Checkbox
            id={`typeOfChange-${type}`}
            key={type}
            name={type}
            value={type}
            label={type}
            checked={selectedTypeOfChange.includes(type)}
            onChange={() => handleTypeOfChangeChange(type)}
          />
        ))}

        {/* Other Types of Change */}
        <div>
          <label htmlFor="otherTypesOfChange">Other Types of Change</label>
        </div>

        {Object.values(TypeOfOtherChange).map(type => (
          <Checkbox
            id={`typeOfChange-${type}`}
            key={type}
            name={type}
            value={type}
            label={type}
            checked={selectedTypeOfChange.includes(type)}
            onChange={() => handleTypeOfChangeChange(type)}
          />
        ))}

        {/* Date Range */}
        <div>
          <label htmlFor="dateRange">Date Range</label>
        </div>

        <DateTimePicker
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={date => {
            handleDateRangeChange('startDate', date || '');
          }}
          alertText={false}
          alertIcon={false}
        />

        <DateTimePicker
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={date => {
            handleDateRangeChange('endDate', date || '');
          }}
          alertText={false}
          alertIcon={false}
        />
      </div>

      {/* FOOTER */}
      <div className="border-top-1px border-base-lighter padding-y-2 padding-x-4 display-flex flex-justify">
        <Button
          type="button"
          unstyled
          onClick={() => {
            setSelectedContributors([]);
            setSelectedTypeOfChange([]);
            setStartDate('');
            setEndDate('');
          }}
        >
          Clear all
        </Button>

        <Button
          type="button"
          onClick={() => {
            setFilters({
              contributors: selectedContributors,
              typeOfChange: selectedTypeOfChange,
              startDate,
              endDate
            });
            closeModal();
          }}
        >
          Apply filter
        </Button>
      </div>
    </ModalComponent>
  );
};

export default Filter;
