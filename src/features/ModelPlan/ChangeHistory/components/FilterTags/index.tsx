import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';

import Tag from 'components/Tag';
import { formatDateUtc } from 'utils/date';

import { FilterType } from '../FilterForm';

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

  const handleRemoveTypeOfChange = (type: string) => {
    setFilters({
      ...filters,
      typeOfChange: filters.typeOfChange.filter(t => t !== type)
    });
  };

  const handleRemoveStartDate = () => {
    setFilters({ ...filters, startDate: '' });
  };

  const handleRemoveEndDate = () => {
    setFilters({ ...filters, endDate: '' });
  };

  const UserTags = users.map(user => (
    <Tag
      key={user}
      className="bg-primary-lighter text-normal margin-bottom-1 display-flex flex-align-center"
    >
      {t('user')}:<span className="text-bold margin-left-05">{user}</span>
      <Icon.Close
        className="margin-left-05"
        tabIndex={0}
        role="button"
        aria-label={`Remove ${user}`}
        onClick={() => handleRemoveUser(user)}
      />
    </Tag>
  ));

  const TypeOfChangeTags = typeOfChange.map(type => (
    <Tag
      key={type}
      className="bg-primary-lighter text-normal margin-bottom-1 display-flex flex-align-center"
      onClick={() => handleRemoveTypeOfChange(type)}
    >
      {t('type')}:
      <span className="text-bold margin-left-05">
        {t(`filterSections.${type}`)}
      </span>
      <Icon.Close
        className="margin-left-05"
        tabIndex={0}
        role="button"
        aria-label={`Remove ${type}`}
        onClick={() => handleRemoveTypeOfChange(type)}
      />
    </Tag>
  ));

  const startDateTag = startDate ? (
    <Tag
      key={startDate}
      className="bg-primary-lighter text-normal margin-bottom-1 display-flex flex-align-center"
      onClick={handleRemoveStartDate}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          handleRemoveStartDate();
        }
      }}
    >
      {t('startDate')}:
      <span className="text-bold margin-left-05">
        {formatDateUtc(startDate, 'MM/dd/yyyy')}
      </span>
      <Icon.Close
        className="margin-left-05"
        tabIndex={0}
        role="button"
        aria-label={`Remove ${startDate}`}
        onClick={handleRemoveStartDate}
      />
    </Tag>
  ) : null;

  const endDateTag = endDate ? (
    <Tag
      key={endDate}
      className="bg-primary-lighter text-normal margin-bottom-1 display-flex flex-align-center"
      onClick={handleRemoveEndDate}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          handleRemoveEndDate();
        }
      }}
    >
      {t('endDate')}:
      <span className="text-bold margin-left-05">
        {formatDateUtc(endDate, 'MM/dd/yyyy')}
      </span>
      <Icon.Close
        className="margin-left-05"
        tabIndex={0}
        role="button"
        aria-label={`Remove ${endDate}`}
        onClick={handleRemoveEndDate}
      />
    </Tag>
  ) : null;

  return (
    <div className="display-flex flex-wrap gap-2">
      {UserTags}
      {TypeOfChangeTags}
      {startDateTag}
      {endDateTag}
    </div>
  );
};

export default FilterTags;
