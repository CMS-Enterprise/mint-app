import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  IconClose,
  IconExpandMore,
  Tag
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type OptionProp = {
  value: string;
  label: string;
};

type OptionsProps = {
  options: OptionProp[];
  selected: string[];
  optionClick: (option: string) => void;
};

const Options = ({ options, selected, optionClick }: OptionsProps) => {
  const { t } = useTranslation();
  return (
    <ul className="easi-multiselect__options usa-list--unstyled padding-y-05 border-1px border-top-0 maxh-card overflow-scroll position-absolute right-0 left-0 z-top bg-white">
      {options.map(option => {
        return (
          <Checkbox
            className="padding-left-1 padding-y-05 hover:bg-base-lightest"
            key={option.value}
            defaultChecked={selected.includes(option.value)}
            id={`easi-multiselect__option-${option.value}`}
            name={`easi-multiselect-${option.value}`}
            label={option.label}
            onChange={() => optionClick(option.value)}
          />
        );
      })}
    </ul>
  );
};

type MultiSelectProps = {
  className?: string;
  id?: string;
  options: OptionProp[];
  selectedLabel?: string;
  onChange: (value: string[]) => void;
  initialValues: string[];
};

export default function MultiSelect({
  className,
  id,
  options,
  selectedLabel = 'Selected options',
  onChange,
  initialValues
}: MultiSelectProps) {
  const [searchValue, setSearchValue] = useState('');

  const [selected, setSelected] = useState<string[]>(initialValues);
  const [active, setActive] = useState(false);

  const { t } = useTranslation();
  const selectRef = useRef<HTMLInputElement>(null);

  const optionClick = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(selectedOption => selectedOption !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const filterSearchResults = () => {
    const searchIndex = (option: string) => {
      return option.toLowerCase().search(searchValue.toLowerCase());
    };
    return options
      .filter(option => searchIndex(option.label) > -1)
      .sort((a, b) => searchIndex(a.label) - searchIndex(b.label));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setActive(false);
        setSearchValue('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    setSelected(initialValues);
  }, [initialValues]);

  const findOptions = (key: string) => {
    return options.find(option => option.value === key);
  };

  return (
    <div
      className={classNames(
        'easi-multiselect maxw-mobile-lg position-relative',
        className
      )}
      id={id}
    >
      <div className="easi-multiselect__field" role="listbox" ref={selectRef}>
        <div className="usa-select maxw-none padding-0">
          <input
            type="search"
            className="usa-input padding-1 height-full border-0"
            value={searchValue}
            placeholder={t(`${selected.length} selected`)}
            onClick={() => setActive(true)}
            onChange={e => setSearchValue(e.target.value)}
          />
          <div className="easi-multiselect__controls">
            {selected.length > 0 && (
              <div className="easi-multiselect__controls-button">
                <IconClose
                  onClick={() => setSelected([])}
                  size={3}
                  role="button"
                />
                <div className="width-1px border-right-1px border-base-lighter height-205 margin-left-1" />
              </div>
            )}
            <div className="easi-multiselect__controls-button easi-multiselect__controls-close">
              <IconExpandMore
                onClick={() => setActive(!active)}
                size={4}
                role="button"
              />
            </div>
          </div>
        </div>
        {active && (
          <Options
            options={searchValue ? filterSearchResults() : options}
            selected={selected}
            optionClick={optionClick}
          />
        )}
      </div>
      {selected.length > 0 && (
        <div className="easi-multiselect__selected-list margin-top-3">
          {t(selectedLabel)}
          <ul className="usa-list--unstyled margin-top-1">
            {selected.map(option => (
              <li
                key={option}
                className="display-flex flex-justify-start margin-y-05"
              >
                <Tag
                  className="bg-primary-lighter text-ink text-no-uppercase padding-y-1 padding-x-105 display-flex flex-align-center"
                  id={`easi-multiselect__tag-${findOptions(option)?.value}`}
                >
                  {findOptions(option)?.label}
                  <IconClose
                    className="margin-left-1"
                    onClick={() => optionClick(option)}
                  />
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
