import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardGroup } from '@trussworks/react-uswds';

// import Alert from 'components/Alert';
// import ExternalLink from 'components/ExternalLink';
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

  return (
    <CardGroup>
      <Card gridLayout={{ desktop: { col: 4 } }}>test</Card>
      <EChimpCard />
    </CardGroup>
  );
};

export default EChimpCards;
