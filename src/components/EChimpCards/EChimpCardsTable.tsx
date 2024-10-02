import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import {
  EchimpCrAndTdlsQuery,
  useEchimpCrAndTdlsQuery
} from 'gql/generated/graphql';

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

const EChimpCardsTable = () => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { data, loading } = useEchimpCrAndTdlsQuery({
    variables: {}
  });

  const echimpItems = React.useMemo(() => data?.echimpCRAndTDLS || [], [data]);
  const [query, setQuery] = useState('');

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

  if (loading || !data) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  if (data.echimpCRAndTDLS?.length === 0) {
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
      <div className="margin-bottom-4">
        <GlobalClientFilter
          globalFilter={query}
          setGlobalFilter={setQuery}
          tableID="cr-and-tdl-table"
          tableName={crtdlsT('heading')}
          className="margin-bottom-3 maxw-none width-mobile-lg"
        />
        {Results}
      </div>
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
