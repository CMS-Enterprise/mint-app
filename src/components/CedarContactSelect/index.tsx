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
import { IconWarning } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Spinner from 'components/Spinner';
import useCedarContactLookup from 'hooks/useCedarContactLookup';
import color from 'utils/uswdsColor';

import './index.scss';

/** Cedar contact properties */
export type CedarContactProps = {
  euaUserId: string;
  commonName: string;
  email?: string;
};

type CedarContactSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaDescribedBy?: string;
  value?: CedarContactProps | null;
  onChange: (contact: CedarContactProps | null) => void;
  disabled?: boolean;
  autoSearch?: boolean;
};

type CedarContactSelectOption = {
  value: CedarContactProps;
  label: string;
};

// Override React Select input to fix hidden input on select bug
const Input = (props: InputProps<CedarContactSelectOption, false>) => {
  return (
    <components.Input
      {...props}
      isHidden={false}
      data-testid="cedar-contact-select"
    />
  );
};

// Custom option component
const Option = (props: OptionProps<CedarContactSelectOption, false>) => {
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

const Menu = (props: MenuProps<CedarContactSelectOption, false>) => {
  const {
    selectProps: { inputValue }
  } = props;
  if (inputValue.length < 2) return null;
  return <components.Menu {...props} />;
};

const ClearIndicator = (
  props: ClearIndicatorProps<CedarContactSelectOption, false>
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
  props: IndicatorsContainerProps<CedarContactSelectOption, false>
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
        <IconWarning className="text-warning" size={3} />
      )}
      {loading && <Spinner size="small" className="margin-right-1" />}
      {children}
    </components.IndicatorsContainer>
  );
};

/** Returns formatted contact label */
const formatLabel = (contact: CedarContactProps) =>
  `${contact.commonName}${contact?.euaUserId && `, ${contact.euaUserId}`}`;

/**
 * Combobox to look up contact by name from CEDAR
 */
export default function CedarContactSelect({
  className,
  id,
  name,
  ariaDescribedBy,
  value,
  onChange,
  disabled,
  autoSearch
}: CedarContactSelectProps) {
  const { t } = useTranslation();
  // If autoSearch, set name as initial search term
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    value ? formatLabel(value) : undefined
  );

  const [userSelected, setUserSelected] = useState(false);

  const [didMount, setDidMount] = useState(false);

  const { debounceValue, debounceLoading } = useDebounce(
    searchTerm,
    1500,
    userSelected
  );

  // If autoSearch, run initial query from name
  const { contacts, queryCedarContacts, loading } = useCedarContactLookup(
    debounceValue
  );

  // Selected contact
  const selectedContact = useRef(value?.euaUserId);

  // Show warning if autosearch returns multiple or no results
  const showWarning = autoSearch && !value?.euaUserId && contacts.length !== 1;

  /** Query CEDAR by common name and update contacts */
  const queryContacts = (query: string) => {
    setSearchTerm(query);
    if (query.length > 1) {
      queryCedarContacts(query.split(',')[0]);
    }
  };

  /** Update contact and reset search term */
  const updateContact = (contact?: CedarContactProps | null) => {
    onChange(contact || null);
    selectedContact.current = contact?.euaUserId;
    queryContacts(contact ? formatLabel(contact) : '');
  };

  useEffect(() => {
    if (!didMount) {
      // required to not call API on initial render
      // https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
      setDidMount(true);
      return;
    }
    if (debounceValue && debounceValue.length > 1) {
      queryCedarContacts(debounceValue.split(',')[0]);
    }
  }, [debounceValue, queryCedarContacts, didMount]);

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

  // Update contact when value changes
  // Fix for 'same as requester' checkboxes in system intake form
  useEffect(() => {
    if (!autoSearch && value?.euaUserId !== selectedContact.current) {
      updateContact(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Select
      id={id}
      name={name}
      className={classNames(
        'margin-top-1',
        'cedar-contact-select',
        'maxw-none',
        'usa-combo-box',
        { 'cedar-contact-select__warning': showWarning },
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
      aria-label="Cedar-Users"
      components={{ Input, IndicatorsContainer, ClearIndicator, Option, Menu }}
      options={contacts.map((contact: CedarContactProps) => ({
        label: `${contact.commonName}, ${contact.euaUserId}`,
        value: contact
      }))}
      styles={customStyles}
      defaultValue={
        value
          ? {
              value,
              label: `${value?.commonName}${
                value?.euaUserId && `, ${value?.euaUserId}`
              }`
            }
          : undefined
      }
      value={value ? { value, label: formatLabel(value) } : undefined}
      onChange={item => updateContact(item?.value || null)}
      onBlur={e => {
        // Automatically select on blur if search returns single result
        if (autoSearch && contacts.length === 1) {
          updateContact(contacts[0]);
        }
      }}
      onInputChange={(newValue, { action }) => {
        if (action !== 'input-blur' && action !== 'menu-close') {
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
      noOptionsMessage={() => t('No results')}
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

function useDebounce(value: string | undefined, wait: number, stop: boolean) {
  const [oldValue, setOldValue] = useState(value); // Used to compare again incoming value to reset loading state
  const [debounceValue, setDebounceValue] = useState(value);
  const [debounceLoading, setDebounceLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!debounceLoading && value !== oldValue && !stop) {
      // If value changes start loading
      setDebounceLoading(true);
    }
    const timer = setTimeout(() => {
      setDebounceValue(value);
      setOldValue(value);
      setDebounceLoading(false);
    }, wait);
    return () => clearTimeout(timer); // cleanup when unmounted
  }, [value, wait, debounceLoading, oldValue, stop]);

  return { debounceValue, debounceLoading };
}
