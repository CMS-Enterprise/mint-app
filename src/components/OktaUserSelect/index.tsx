import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, {
  ClearIndicatorProps,
  components,
  IndicatorsContainerProps,
  InputProps,
  MenuProps,
  OptionProps
} from 'react-select';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Spinner from 'components/Spinner';
import useDebounce from 'hooks/useDebounce';
import useOktaUserLookup, { OktaUserType } from 'hooks/useOktaUserLookup';
import color from 'utils/uswdsColor';

import './index.scss';

type OktaUserSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  value?: OktaUserType | null;
  onChange: (contact: OktaUserType | null) => void;
  disabled?: boolean;
  autoSearch?: boolean;
};

type OktaUserSelectOption = {
  value: OktaUserType;
  label: string;
};

// Override React Select input to fix hidden input on select bug
const Input = (props: InputProps<OktaUserSelectOption, false>) => {
  return (
    <components.Input
      {...props}
      isHidden={false}
      data-testid="cedar-contact-select"
    />
  );
};

// Custom option component
const Option = (props: OptionProps<OktaUserSelectOption, false>) => {
  const { isFocused } = props;
  return (
    <components.Option
      {...props}
      className={classNames('usa-combo-box__list-option', {
        'usa-combo-box__list-option--focused': isFocused
      })}
    />
  );
};

const NoOptionsMessage = (props: any) => {
  const { t } = useTranslation('general');
  return (
    <components.NoOptionsMessage {...props}>
      <button
        type="button"
        id="no-results"
        tabIndex={0}
        className="usa-button--unstyled text-no-underline text-black"
        aria-label={t('noResults')}
      >
        {t('noResults')}
      </button>
    </components.NoOptionsMessage>
  );
};

const Menu = (props: MenuProps<OktaUserSelectOption, false>) => {
  const {
    selectProps: { inputValue }
  } = props;
  if (inputValue.length < 2) return null;
  return <components.Menu {...props} />;
};

const ClearIndicator = (
  props: ClearIndicatorProps<OktaUserSelectOption, false>
) => {
  const {
    selectProps: { inputValue, id },
    clearValue
  } = props;
  // Fix bug in 'same as requester' checkboxes where clear indicator shows with no input value
  if (!inputValue) return null;
  return (
    <button
      type="button"
      id="clear-selection"
      tabIndex={0}
      onClick={() => {
        clearValue();
        document?.getElementById(`react-select-${id}-input`)?.focus();
      }}
      className="usa-button--unstyled"
      aria-label="Clear selection"
    >
      <components.ClearIndicator {...props} />
    </button>
  );
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<OktaUserSelectOption, false>
) => {
  const {
    children,
    selectProps: { className, isDisabled },
    hasValue
  } = props;

  // Whether to show spinner based on className
  const loading = className!
    .split(' ')
    .includes('cedar-contact-select__loading');
  // Whether to show warning icon based in className
  const resultsWarning =
    hasValue && className!.split(' ').includes('cedar-contact-select__warning');

  // Hide indicators if field is disabled
  if (isDisabled) return null;

  return (
    <components.IndicatorsContainer {...props}>
      {!loading && resultsWarning && (
        <Icon.Warning className="text-warning" size={3} />
      )}
      {loading && <Spinner size="small" className="margin-right-1" />}
      {children}
    </components.IndicatorsContainer>
  );
};

/** Returns formatted contact label */
const formatLabel = (contact: OktaUserType) =>
  `${contact.displayName}${contact?.username && `, ${contact.username}`}`;

/**
 * Combobox to look up contact by name from Okta
 */
export default function OktaUserSelect({
  className,
  id,
  name,
  ariaLabelledBy,
  ariaDescribedBy,
  value,
  onChange,
  disabled,
  autoSearch
}: OktaUserSelectProps) {
  // If autoSearch, set name as initial search term
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    value ? formatLabel(value) : undefined
  );

  const [userSelected, setUserSelected] = useState(false);

  const { debounceValue, debounceLoading } = useDebounce(
    searchTerm,
    250,
    userSelected
  );

  const { contacts, queryOktaUsers, loading } = useOktaUserLookup(
    debounceValue,
    userSelected
  );

  // Selected contact
  const selectedContact = useRef(value?.username);

  /** Update contact and reset search term */
  const updateContact = (contact?: OktaUserType | null) => {
    onChange(contact || null);
    selectedContact.current = contact?.username;
    setSearchTerm(contact ? formatLabel(contact) : '');
  };

  useEffect(() => {
    if (debounceValue) {
      queryOktaUsers(debounceValue.split(',')[0]);
    }
  }, [debounceValue, queryOktaUsers]);

  // React Select styles object
  const customStyles: {
    [index: string]: (
      provided: CSSProperties,
      state: { isFocused: boolean }
    ) => CSSProperties;
  } = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      borderColor: color('base-dark'),
      outline: state.isFocused ? `.25rem solid ${color('blue-vivid-40')}` : '',
      borderRadius: 0,
      transition: 'none',
      '&:hover': {
        borderColor: color('base-dark'),
        cursor: 'text'
      }
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: color('base-dark'),
      padding: '8px 6px',
      '&:hover': {
        color: color('base-dark'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '22px',
        height: '22px'
      }
    }),
    clearIndicator: provided => ({
      ...provided,
      color: color('base-dark'),
      padding: '8px 6px',
      '&:hover': {
        color: color('base-dark'),
        cursor: 'pointer'
      },
      '> svg': {
        width: '22px',
        height: '22px'
      }
    }),
    indicatorSeparator: provided => ({
      ...provided,
      marginTop: '8px',
      marginBottom: '8px'
    }),
    menu: provided => ({
      ...provided,
      marginTop: '0px',
      borderRadius: 0,
      border: `1px solid ${color('base-dark')}`,
      borderTop: 'none',
      boxShadow: 'none'
    }),
    menuList: provided => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0
    }),
    noOptionsMessage: provided => ({
      ...provided,
      textAlign: 'left'
    }),
    input: provided => ({
      ...provided,
      visibility: 'visible'
    }),
    option: provided => ({
      ...provided,
      backgroundColor: 'transparent',
      color: 'inherit'
    })
  };

  return (
    <Select
      id={id}
      name={name}
      className={classNames(
        'margin-top-1',
        'cedar-contact-select',
        'maxw-none',
        'usa-combo-box',
        {
          'cedar-contact-select__loading':
            (loading || debounceLoading) &&
            ((searchTerm && searchTerm.length > 0) || loading) &&
            !userSelected
        },
        { 'opacity-70': disabled },
        className
      )}
      isDisabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      aria-labelledby={ariaLabelledBy}
      // Conditional on menu open to override "No results" selection being tabbable/not closed on focus lost
      // Menu is closed on user selection
      menuIsOpen={
        ((contacts.length === 0 && (searchTerm?.length || 0) > 2) ||
          !!contacts.length) &&
        !userSelected
      }
      components={{
        Input,
        IndicatorsContainer,
        ClearIndicator,
        Option,
        Menu,
        NoOptionsMessage
      }}
      options={contacts.map((contact: OktaUserType) => ({
        label: `${contact.displayName}, ${contact.username}`,
        value: contact
      }))}
      styles={customStyles}
      defaultValue={
        value
          ? {
              value,
              label: `${value?.displayName}${
                value?.username && `, ${value?.username}`
              }`
            }
          : undefined
      }
      value={value ? { value, label: formatLabel(value) } : undefined}
      onChange={(item: OktaUserSelectOption) =>
        updateContact(item?.value || null)
      }
      onInputChange={(
        newValue: string | undefined,
        { action }: { action: string }
      ) => {
        if (action !== 'input-blur' && action !== 'menu-close') {
          // If user selected a value, no need to query and debounce again
          if (action === 'set-value') {
            setUserSelected(true);
          } else {
            setUserSelected(false);
            setSearchTerm(newValue);
          }
        }
      }}
      defaultInputValue={searchTerm}
      inputValue={searchTerm}
      classNamePrefix="cedar-contact-select"
      instanceId={id}
      placeholder={false}
      backspaceRemovesValue={false}
      controlShouldRenderValue={false}
      isSearchable
      isClearable
    />
  );
}
