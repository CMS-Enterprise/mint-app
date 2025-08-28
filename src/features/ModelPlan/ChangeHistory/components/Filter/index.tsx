import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Button, Checkbox, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

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
        <form>
          <div>
            <label htmlFor="contributors">Contributors</label>
            {contributors.map(contributor => (
              <Checkbox
                id={`contributor-${contributor}`}
                name={contributor}
                value={contributor}
                label={contributor}
                checked={selectedContributors.includes(contributor)}
                onChange={() => handleContributorChange(contributor)}
              />
            ))}
          </div>

          <div>
            <label htmlFor="typeOfChange">Type of Change</label>
          </div>
          {Object.values(TypeOfChange).map(type => (
            <Checkbox
              id={`typeOfChange-${type}`}
              name={type}
              value={type}
              label={type}
              checked={selectedTypeOfChange.includes(type)}
              onChange={() => handleTypeOfChangeChange(type)}
            />
          ))}
        </form>
      </div>

      {/* FOOTER */}
      <div className="border-top-1px border-base-lighter padding-y-2 padding-x-4 display-flex flex-justify">
        <Button
          type="button"
          unstyled
          onClick={() => {
            setSelectedContributors([]);
            setSelectedTypeOfChange([]);
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
              startDate: filters.startDate,
              endDate: filters.endDate
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
