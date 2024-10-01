import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CardGroup } from '@trussworks/react-uswds';
import {
  EChimpCr,
  EChimpTdl,
  useEchimpCrAndTdlsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import Spinner from 'components/Spinner';

import EChimpCard from './EChimpCard';

type EChimpCardsProps = {
  className?: string;
  currentItems: number[];
};

// EMPTY STATE
// {currentItems.length === 0 ? (
//   <Alert type="info" heading={crtdlsT('tableState.empty.heading')}>
//     <span className="mandatory-fields-alert__text">
//       <Trans
//         t={crtdlsT}
//         i18nKey="tableState.empty.copy"
//         components={{
//           el: (
//             <ExternalLink
//               className="margin-right-0"
//               href="https://echimp.cmsnet/"
//             >
//               {' '}
//             </ExternalLink>
//           )
//         }}
//       />
//     </span>
//   </Alert>

const EChimpCards = ({ className, currentItems }: EChimpCardsProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  const { data, loading, error } = useEchimpCrAndTdlsQuery({
    variables: {}
  });

  console.log(data?.echimpCRAndTDLS);
  if (loading) {
    return (
      <div className="padding-left-4 padding-top-3">
        <Spinner />
      </div>
    );
  }

  if (data?.echimpCRAndTDLS?.length === 0 || error) {
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

  // Type guard to check union type
  type EChimpCRAndTDLS = EChimpCr | EChimpTdl;
  const isEChimpCr = (info: EChimpCRAndTDLS): info is EChimpCr => {
    /* eslint no-underscore-dangle: 0 */
    return info.__typename === 'EChimpCR';
  };
  const isEChimpTdl = (info: EChimpCRAndTDLS): info is EChimpTdl => {
    /* eslint no-underscore-dangle: 0 */
    return info.__typename === 'EChimpTDL';
  };

  const renderEChimpCard = (info: EChimpCRAndTDLS) => {
    if (isEChimpCr(info)) {
      return <EChimpCard key={info.id} {...info} />;
    }
    if (isEChimpTdl(info)) {
      return <EChimpCard key={info.id} {...info} />;
    }
    return null;
  };

  return (
    <CardGroup>
      {data?.echimpCRAndTDLS?.map(item => renderEChimpCard(item))}
    </CardGroup>
  );
};

export default EChimpCards;
