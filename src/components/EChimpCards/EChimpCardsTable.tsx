import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, Grid, Label, Select } from '@trussworks/react-uswds';
import {
  EChimpCr,
  EChimpTdl,
  GetEchimpCrandTdlQuery,
  useGetEchimpCrandTdlQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import CRAndTDLSidePanel from 'components/CRAndTDLSidePanel';
import ExternalLink from 'components/ExternalLink';
import Sidepanel from 'components/Sidepanel';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import usePagination from 'hooks/usePagination';

import EChimpCard from './EChimpCard';

export type EchimpCrAndTdlsType =
  GetEchimpCrandTdlQuery['modelPlan']['echimpCRsAndTDLs'][0];

// Typeguard to determine if the solution is a CR or TDL
const isEChimpCR = (solution: EchimpCrAndTdlsType): solution is EChimpCr => {
  /* eslint no-underscore-dangle: 0 */
  return solution.__typename === 'EChimpCR';
};
const isEChimpTDL = (solution: EchimpCrAndTdlsType): solution is EChimpTdl => {
  /* eslint no-underscore-dangle: 0 */
  return solution.__typename === 'EChimpTDL';
};

export const searchSolutions = (
  query: string,
  solutions: EchimpCrAndTdlsType[]
): EchimpCrAndTdlsType[] => {
  return [...solutions].filter(
    solution =>
      (isEChimpCR(solution) &&
        (solution.id?.toLowerCase().includes(query.toLowerCase()) ||
          solution.title?.toLowerCase().includes(query.toLowerCase()) ||
          (solution.emergencyCrFlag &&
            'Emergency'.toLowerCase().includes(query.toLowerCase())) ||
          (solution.sensitiveFlag &&
            'Sensitive/controversial'
              .toLowerCase()
              .includes(query.toLowerCase())) ||
          solution.crStatus?.toLowerCase().includes(query.toLowerCase()) ||
          solution.implementationDate
            ?.toLowerCase()
            .includes(query.toLowerCase()))) ||
      (isEChimpTDL(solution) &&
        (solution.id?.toLowerCase().includes(query.toLowerCase()) ||
          solution.title?.toLowerCase().includes(query.toLowerCase()) ||
          solution.issuedDate?.includes(query.toLowerCase())))
  );
};

export const handleSort = (
  solutions: EchimpCrAndTdlsType[],
  sort: 'id' | 'title'
) => {
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
// Sort options for the select drop__wn
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

const EChimpCardsTable = ({
  isInReadView = false
}: {
  isInReadView?: boolean;
}) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  const { data, loading } = useGetEchimpCrandTdlQuery({
    variables: {
      id: modelID
    }
  });

  const echimpItems = useMemo(
    () => data?.modelPlan?.echimpCRsAndTDLs ?? [],
    [data]
  );

  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState<'all' | number>(6);
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const [showCRorTDLWithId, setShowCRorTDLWithId] = useState('');

  const [sort, setSort] = useState<SortProps['value']>(sortOptions[0].value);

  const [filteredEchimpItems, setFilteredEchimpItems] =
    useState<EchimpCrAndTdlsType[]>(echimpItems);

  const { currentItems, Pagination, Results } = usePagination<
    EchimpCrAndTdlsType[]
  >({
    items: filteredEchimpItems,
    itemsPerPage: pageSize === 'all' ? filteredEchimpItems.length : pageSize,
    loading,
    query
  });

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      setFilteredEchimpItems(
        handleSort(searchSolutions(query, echimpItems), sort)
      );
    } else {
      setFilteredEchimpItems(handleSort(echimpItems, sort));
    }
  }, [query, echimpItems, sort]);

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
                href={import.meta.env.VITE_ECHIMP_URL}
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
    <div data-testid="echimp-cr-and-tdls-table">
      <Sidepanel
        isOpen={isSidepanelOpen}
        closeModal={() => setIsSidepanelOpen(false)}
        ariaLabel={crtdlsT('echimpCard.sidepanelAriaLabel')}
        testid="cr-and-tdl-sidepanel"
        modalHeading={showCRorTDLWithId}
      >
        <CRAndTDLSidePanel
          {...echimpItems.filter(item => item.id === showCRorTDLWithId)[0]}
          isCR={
            showCRorTDLWithId !== '' &&
            isEChimpCR(
              echimpItems.filter(item => item.id === showCRorTDLWithId)[0]
            )
          }
        />
      </Sidepanel>
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
          <EChimpCard
            key={card.id}
            {...card}
            isCR={isEChimpCR(card)}
            isInReadView={isInReadView}
            setShowCRorTDLWithId={setShowCRorTDLWithId}
            setIsSidepanelOpen={setIsSidepanelOpen}
          />
        ))}
      </CardGroup>
      <Grid row>
        {Pagination}
        <TablePageSize
          className="margin-left-auto desktop:grid-col-auto"
          pageSize={pageSize}
          setPageSize={setPageSize}
          valueArray={[6, 9, 'all']}
        />
      </Grid>
    </div>
  );
};

export default EChimpCardsTable;
