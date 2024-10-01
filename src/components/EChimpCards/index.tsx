import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import { useEchimpCrAndTdlsQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import Spinner from 'components/Spinner';

import EChimpCard from './EChimpCard';

type EChimpCardsProps = {
  className?: string;
  currentItems: number[];
};

const EChimpCards = ({ className, currentItems }: EChimpCardsProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { data, loading } = useEchimpCrAndTdlsQuery({
    variables: {}
  });

  if (loading) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  if (data?.echimpCRAndTDLS?.length === 0) {
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
    <CardGroup>
      {data?.echimpCRAndTDLS?.map(item => (
        <EChimpCard key={item.id} {...item} />
      ))}
    </CardGroup>
  );
};

export default EChimpCards;
