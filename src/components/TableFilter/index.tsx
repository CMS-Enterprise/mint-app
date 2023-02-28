import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FilterValue, useAsyncDebounce } from 'react-table';
import {
  Button,
  Form,
  IconSearch,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

// Truss has a SearchBar component, but it only takes onSubmit - meant for server side filtering.
// Currently this component is used for client side filtering using onChange

type GlobalClientFilterProps = {
  setGlobalFilter: (filterValue: FilterValue) => void;
  tableID: string;
  tableName: string;
  className?: string;
};

// Component for Global Filter for Client Side filtering
const GlobalClientFilter = ({
  setGlobalFilter,
  tableID,
  tableName,
  className
}: GlobalClientFilterProps) => {
  const { t } = useTranslation('tableAndPagination');

  const { pathname } = useLocation();

  const [query, setQuery] = useState<string>('');

  // Set a debounce to capture set input before re-rendering on each character.  Preparation for BE fetching/filtering.
  // May not be necessary until then
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value);
  }, 200);

  // Resets the query on route change
  useEffect(() => {
    setQuery('');
  }, [pathname]);

  return (
    <Form
      data-testid="table-client-filter"
      role="search"
      className={classnames('usa-search', className)}
      onSubmit={e => {
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          // Currently only client-side filtering - updates search filter onChange
          onChange(e.target.value);
          setQuery(e.target.value);
        }}
        value={query}
        name={`${tableName} Search`}
      />
      {/* Right not search button doesn't need to do anything, it searches onChange -
        purely from wireframe.  Will change in future with CEDAR API filtering */}
      <Button
        type="submit"
        className="grid-row flex-justify-center flex-align-center no-pointer"
      >
        <IconSearch size={3} />
      </Button>
    </Form>
  );
};

export default GlobalClientFilter;
