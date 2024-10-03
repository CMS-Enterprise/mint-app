import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup, Grid, Label, Select } from '@trussworks/react-uswds';
import {
  EchimpCrAndTdlsQuery,
  useEchimpCrAndTdlsQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import usePagination from 'hooks/usePagination';

import EChimpCard from './EChimpCard';

type EchimpCrAndTdlsType = EchimpCrAndTdlsQuery['echimpCRAndTDLS'][0];

// TODO: REMOVE IF NOT USED AT THE END
// // Type guard to check union type
// const isEchimpCRType = (
//   crtdl: EchimpCrAndTdlsType
// ): crtdl is EchimpCrAndTdlsType => {
//   /* eslint no-underscore-dangle: 0 */
//   return crtdl.__typename === 'EChimpCR';
// };
// const isEchimpTDLType = (
//   crtdl: EchimpCrAndTdlsType
// ): crtdl is EchimpCrAndTdlsType => {
//   /* eslint no-underscore-dangle: 0 */
//   return crtdl.__typename === 'EChimpTDL';
// };

const searchSolutions = (
  query: string,
  solutions: EchimpCrAndTdlsType[]
): EchimpCrAndTdlsType[] => {
  return solutions.filter(
    solution =>
      solution.title?.toLowerCase().includes(query.toLowerCase()) ||
      solution.id?.toLowerCase().includes(query.toLowerCase())
  );
};

const handleSort = (solutions: EchimpCrAndTdlsType[], sort: 'id' | 'title') => {
  // Make a shallow copy of the array before sorting to avoid mutation of the original array
  return [...solutions].sort((a, b) => {
    if (sort === 'id') {
      return a.id.localeCompare(b.id);
    }
    if (sort === 'title') {
      // Handle undefined titles by putting them at the end
      if (!a.title) return 1; // a has no title, so it should come after b
      if (!b.title) return -1; // b has no title, so it should come after a
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};

type SortProps = {
  value: 'id' | 'title';
  label: string;
};
// Sort options for the select dropdown
const sortOptions: SortProps[] = [
  {
    value: 'id',
    label: i18next.t('crtdlsMisc:sortBy.id')
  },
  {
    value: 'title',
    label: i18next.t('crtdlsMisc:sortBy.title')
  }
];

const EChimpCardsTable = () => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { data, loading } = useEchimpCrAndTdlsQuery({
    variables: {}
  });

  const echimpItems = React.useMemo(() => data?.echimpCRAndTDLS || [], [data]);
  const [query, setQuery] = useState('');

  const [sort, setSort] = useState<SortProps['value']>(sortOptions[0].value);

  const [filteredEchimpItems, setFilteredEchimpItems] =
    useState<EchimpCrAndTdlsType[]>(echimpItems);

  const { currentItems, Pagination, Results } = usePagination<
    EchimpCrAndTdlsType[]
  >({
    items: filteredEchimpItems,
    itemsPerPage: 6,
    loading,
    query
  });

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      setFilteredEchimpItems(searchSolutions(query, echimpItems));
    } else {
      setFilteredEchimpItems(echimpItems);
    }
  }, [query, echimpItems]);

  useEffect(() => {
    setFilteredEchimpItems(handleSort(filteredEchimpItems, sort));
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !data) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  if (echimpItems.length === 0) {
    <Alert type="info" heading={crtdlsT('tableState.empty.heading')}>
      <span className="mandatory-fields-alert__text">
        <Trans
          t={crtdlsT}
          i18nKey="tableState.empty.copy"
          components={{
            el: (
              <ExternalLink
                className="margin-right-0"
                href="https://echimp.cmsnet/"
              >
                {' '}
              </ExternalLink>
            )
          }}
        />
      </span>
    </Alert>;
  }

  return (
    <>
      <Grid row>
        <Grid desktop={{ col: 6 }}>
          <GlobalClientFilter
            globalFilter={query}
            setGlobalFilter={setQuery}
            tableID="cr-and-tdl-table"
            tableName={crtdlsT('heading')}
            className="margin-bottom-3 maxw-none tablet:width-mobile-lg"
          />
        </Grid>
        <Grid desktop={{ col: 6 }}>
          <div
            className="desktop:margin-left-auto display-flex"
            style={{ maxWidth: '13rem' }}
          >
            <Label
              htmlFor="sort"
              className="text-normal margin-top-1 margin-right-1"
            >
              {i18next.t('changeHistory:sort.label')}
            </Label>

            <Select
              id="sort"
              className="margin-bottom-2 margin-top-0"
              name="sort"
              value={sort}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSort(e.target.value as SortProps['value']);
              }}
            >
              {sortOptions.map(option => {
                return (
                  <option key={`sort-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </div>
        </Grid>
      </Grid>
      <Grid row className="margin-bottom-4">
        <Grid col={12}>{Results}</Grid>
      </Grid>
      <CardGroup>
        {currentItems.map(card => (
          <EChimpCard key={card.id} {...card} />
        ))}
      </CardGroup>
      {Pagination}
    </>
  );
};

export default EChimpCardsTable;
