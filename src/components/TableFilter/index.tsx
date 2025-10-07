import React, { MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterValue } from 'react-table';
import { Button, Form, Icon, Label, TextInput } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

// Truss has a SearchBar component, but it only takes onSubmit - meant for server side filtering.
// Currently this component is used for client side filtering using onChange

type GlobalClientFilterProps = {
  className?: string;
  globalFilter: FilterValue;
  initialFilter?: string;
  setGlobalFilter: (filterValue: FilterValue) => void;
  skipPageResetRef?: MutableRefObject<boolean>;
  tableID: string;
  tableName: string;
  height5?: boolean;
};

// Component for Global Filter for Client Side filtering
const GlobalClientFilter = ({
  className,
  globalFilter,
  initialFilter,
  setGlobalFilter,
  skipPageResetRef,
  tableID,
  tableName,
  height5
}: GlobalClientFilterProps) => {
  const { t } = useTranslation('tableAndPagination');

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Form
      data-testid="table-client-filter"
      role="search"
      className={classnames('usa-search', className)}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: CEDAR API filtering may go here if implemented
      }}
    >
      <Label srOnly htmlFor={`${tableID}-search`}>
        {t('search')}
      </Label>
      <TextInput
        id={`${tableID}-search`}
        role="searchbox"
        type="search"
        className={classnames({
          'height-5': height5
        })}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (skipPageResetRef) {
            // eslint-disable-next-line no-param-reassign
            skipPageResetRef.current = false;
          }
          // Currently only client-side filtering - updates search filter onChange
          if (globalFilter === '') {
            const paramsChange = new URLSearchParams(location.search);
            paramsChange.set('page', '1');
            navigate({ search: paramsChange.toString() });
          }
          setGlobalFilter(e.target.value);
        }}
        value={globalFilter ?? ''}
        name={`${tableName} Search`}
      />
      {/* Right not search button doesn't need to do anything, it searches onChange -
        purely from wireframe.  Will change in future with CEDAR API filtering */}
      <Button
        type="submit"
        className={classnames({
          'grid-row flex-justify-center flex-align-center no-pointer height-5':
            height5
        })}
      >
        <Icon.Search size={3} aria-label="search" />
      </Button>
    </Form>
  );
};

export default GlobalClientFilter;
