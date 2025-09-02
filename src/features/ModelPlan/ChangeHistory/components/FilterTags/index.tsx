import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import Tag from 'components/Tag';
import { formatDateLocal } from 'utils/date';

import { FilterType } from '../FilterForm';
import { TypeOfChange, TypeOfOtherChange } from '../FilterForm/filterUtil';

const FilterTags = ({
  filters,
  setFilters
}: {
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
}) => {
  const { t } = useTranslation('changeHistory');

  const { users, typeOfChange, startDate, endDate } = filters;

  const handleRemoveUser = (user: string) => {
    setFilters({ ...filters, users: filters.users.filter(u => u !== user) });
  };

  const handleRemoveTypeOfChange = (type: TypeOfChange | TypeOfOtherChange) => {
    setFilters({
      ...filters,
      typeOfChange: filters.typeOfChange.filter(
        y => y !== type && y !== TypeOfChange.ALL_MODEL_PLAN_SECTIONS // Clears ALL_MODEL_PLAN_SECTIONS if it is selected
      )
    });
  };

  const handleRemoveStartDate = () => {
    setFilters({ ...filters, startDate: '' });
  };

  const handleRemoveEndDate = () => {
    setFilters({ ...filters, endDate: '' });
  };

  const UserTags = users.map(user => (
    <Tag key={user} className="mint-tag__select-tag">
      {t('user')}:<span className="text-bold margin-left-05">{user}</span>
      <div className="pointer display-inline-flex flex-align-center">
        <Icon.Close
          className="margin-left-05"
          tabIndex={0}
          role="button"
          aria-label={`Remove ${user}`}
          onClick={() => handleRemoveUser(user)}
        />
      </div>
    </Tag>
  ));

  const TypeOfChangeTags = typeOfChange
    .filter(type => type !== TypeOfChange.ALL_MODEL_PLAN_SECTIONS)
    .map(type => (
      <Tag
        key={type}
        className="mint-tag__select-tag"
        onClick={() => handleRemoveTypeOfChange(type)}
      >
        {t('type')}:
        <span className="text-bold margin-left-05">
          {t(`filterSections.${type}`)}
        </span>
        <div className="pointer display-inline-flex flex-align-center">
          <Icon.Close
            className="margin-left-05"
            tabIndex={0}
            role="button"
            aria-label={`Remove ${type}`}
            onClick={() => handleRemoveTypeOfChange(type)}
          />
        </div>
      </Tag>
    ));

  const startDateTag = startDate ? (
    <Tag
      key={startDate}
      className="mint-tag__select-tag"
      onClick={handleRemoveStartDate}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          handleRemoveStartDate();
        }
      }}
    >
      {t('startDate')}:
      <span className="text-bold margin-left-05">
        {formatDateLocal(startDate, 'MM/dd/yyyy')}
      </span>
      <div className="pointer display-inline-flex flex-align-center">
        <Icon.Close
          className="margin-left-05"
          tabIndex={0}
          role="button"
          aria-label={`Remove ${startDate}`}
          onClick={handleRemoveStartDate}
        />
      </div>
    </Tag>
  ) : null;

  const endDateTag = endDate ? (
    <Tag
      key={endDate}
      className="mint-tag__select-tag"
      onClick={handleRemoveEndDate}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          handleRemoveEndDate();
        }
      }}
    >
      {t('endDate')}:
      <span className="text-bold margin-left-05">
        {formatDateLocal(endDate, 'MM/dd/yyyy')}
      </span>
      <div className="pointer display-inline-flex flex-align-center">
        <Icon.Close
          className="margin-left-05"
          tabIndex={0}
          role="button"
          aria-label={`Remove ${endDate}`}
          onClick={handleRemoveEndDate}
        />
      </div>
    </Tag>
  ) : null;

  return (
    <>
      <div className="display-flex flex-align-center margin-bottom-2">
        <p className="text-bold margin-0 margin-right-1">
          {t('filters')} (
          {users.length +
            typeOfChange.length +
            (startDate ? 1 : 0) +
            (endDate ? 1 : 0)}
          )
        </p>

        <Button
          type="button"
          className="margin-0"
          unstyled
          onClick={() =>
            setFilters({
              ...filters,
              users: [],
              typeOfChange: [],
              startDate: '',
              endDate: ''
            })
          }
        >
          {t('clearAll')}
        </Button>
      </div>

      <div className="display-flex flex-wrap gap-2">
        {UserTags}
        {TypeOfChangeTags}
        {startDateTag}
        {endDateTag}
      </div>
    </>
  );
};

export default FilterTags;
