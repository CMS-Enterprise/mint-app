import React, { useState } from 'react';
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

type EChimpCardsTableProps = {
  className?: string;
};

type EchimpCrAndTdlsType = EchimpCrAndTdlsQuery['echimpCRAndTDLS'];

const EChimpCardsTable = ({ className }: EChimpCardsTableProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { data, loading } = useEchimpCrAndTdlsQuery({
    variables: {}
  });

  const [query, setQuery] = useState('');

  const { currentItems, Pagination, Results } =
    usePagination<EchimpCrAndTdlsType>({
      items: data?.echimpCRAndTDLS || [],
      itemsPerPage: 6,
      loading,
      query
    });
  // console.log(currentItems);

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
