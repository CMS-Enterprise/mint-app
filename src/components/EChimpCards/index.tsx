import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';

type EChimpCardsProps = {
  className?: string;
  currentItems: number[];
};

const EChimpCards = ({ className, currentItems }: EChimpCardsProps) => {
  const { t: crtdlsT } = useTranslation('crtdlsMisc');

  return (
    <>
      {currentItems.length === 0 ? (
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
        </Alert>
      ) : (
        <>
          {/* <Solutions currentSolutions={currentItems} category={category} />
          {Pagination} */}
          hello world
        </>
      )}
    </>
  );
};

export default EChimpCards;
