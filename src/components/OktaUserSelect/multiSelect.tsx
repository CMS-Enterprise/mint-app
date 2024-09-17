import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import classNames from 'classnames';

import Alert from 'components/Alert';
import {
  ClearIndicator,
  customStyles,
  MultiSelectTag,
  Option
} from 'components/MultiSelect';
import useDebounce from 'hooks/useDebounce';
import useOktaUserLookup, { OktaUserType } from 'hooks/useOktaUserLookup';

import './index.scss';

type MultiSelectOptionProps = {
  value: string;
  label: string;
  email: string;
};

const selectedContainsNonCMS = (
  selectedUsers: MultiSelectOptionProps[]
): boolean => {
  return !!selectedUsers.find(user => !user.email?.includes('cms.hhs.gov'));
};

/**
 * MINT OktaMultiselect.
 * Uses `react-select/Select` and `@trussworks/react-uswds/Tag`.
 *
 * https://www.figma.com/file/5y4EbRmFUB7xRBKUG4qlup/USWDS-Library?node-id=869%3A7346&t=WrUjXtNxIxMgpPss-0
 */
const OktaMultiSelect = ({
  id,
  inputId,
  name,
  selectedLabel,
  onChange,
  className,
  ariaLabel
}: {
  id?: string;
  inputId?: string;
  name: string;
  selectedLabel?: string;
  onChange: (values: string[]) => void;
  className?: string;
  ariaLabel: string;
}) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [selected, setSelected] = useState<MultiSelectOptionProps[]>([]);

  // If autoSearch, set name as initial search term
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const [userWarning, setUserWarning] = useState<boolean>(false);

  const [userSelected, setUserSelected] = useState<boolean>(false);

  const { debounceValue, debounceLoading } = useDebounce(
    searchTerm,
    250,
    userSelected
  );

  const { contacts, queryOktaUsers, loading } = useOktaUserLookup(
    debounceValue,
    userSelected
  );

  useEffect(() => {
    if (debounceValue) {
      queryOktaUsers(debounceValue.split(',')[0]);
    }
  }, [debounceValue, queryOktaUsers]);

  useEffect(() => {
    setUserWarning(selectedContainsNonCMS(selected));
  }, [selected]);

  return (
    <div>
      <Select
        id={id}
        inputId={inputId}
        name={name}
        className={classNames(
          'easi-multiselect usa-combo-box margin-top-1',
          {
            'cedar-contact-select__loading':
              (loading || debounceLoading) &&
              ((searchTerm && searchTerm.length > 0) || loading) &&
              !userSelected
          },
          className
        )}
        isClearable
        menuIsOpen={
          (contacts.length === 0 && (searchTerm?.length || 0) > 2) ||
          (!!contacts.length && !userSelected)
        }
        options={contacts.map(
          (contact: OktaUserType): MultiSelectOptionProps => ({
            label: `${contact.displayName}, ${contact.username} (${contact.email})`,
            value: contact.username,
            email: contact.email
          })
        )}
        onInputChange={(newValue, { action }) => {
          if (action !== 'input-blur' && action !== 'menu-close') {
            // If user selected a value, no need to query and debounce again
            if (action !== 'set-value') {
              setUserSelected(false);
              setSearchTerm(newValue);
            }
          } else {
            setUserSelected(true);
            setSearchTerm(undefined);
          }
        }}
        components={{ ClearIndicator, Option }}
        isMulti
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        tabSelectsValue={false}
        onChange={selectedOptions => {
          // TODO: Figure out what's happening with typescript here
          // @ts-ignore
          setSelected(selectedOptions);
          // @ts-ignore
          onChange(selectedOptions.map(option => option.value));
        }}
        value={selected}
        controlShouldRenderValue={false}
        placeholder={`${selected.length} selected`}
        styles={customStyles}
        aria-labelledby={ariaLabel}
        classNamePrefix="cedar-contact-select"
        instanceId={id}
        backspaceRemovesValue={false}
        isSearchable
      />
      {selected.length > 0 && (
        <div className="easi-multiselect--selected">
          <h4 className="text-normal margin-bottom-1">
            {selectedLabel || 'Selected options'}
          </h4>
          <ul className="usa-list--unstyled" id={`${id}-tags`}>
            {selected.map(({ value, label }) => (
              <li
                className="margin-bottom-05 margin-right-05 display-inline-block"
                key={value}
              >
                <MultiSelectTag
                  id={`selected-${value}`}
                  parentId={`${id}-tags`}
                  key={value}
                  label={label}
                  handleRemove={() => {
                    const updatedValues = selected.filter(
                      option => option.value !== value
                    );
                    setSelected(updatedValues);
                    onChange(updatedValues.map(option => option.value));
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {userWarning && (
        <Alert type="warning" slim>
          {generalReadOnlyT('modal.shareAlert')}
        </Alert>
      )}
    </div>
  );
};

export default OktaMultiSelect;
