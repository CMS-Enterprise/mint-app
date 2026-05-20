import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

const ContractAssistanceSection = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div
      id={convertToLowercaseAndDashes(t('contractAssistance.hkcJumpToLabel'))}
      style={{ scrollMarginTop: '3.5rem' }}
      className="bg-primary-darker text-white padding-y-6"
    >
      <GridContainer>
        <h2 className="margin-0">{t('contractAssistance.hkcHeading')}</h2>

        <p className="margin-top-1 margin-bottom-3 font-body-md line-height-sans-4">
          {t('contractAssistance.hkcDescription')}
        </p>

        <UswdsReactLink
          // TODO: change link when the page is created
          to="#"
          // to="/help-and-knowledge/contract-assistance?page=1"
          className="usa-button usa-button--outline bg-white text-primary-darker shadow-none"
          variant="unstyled"
        >
          {t('contractAssistance.hkcViewCta')}
        </UswdsReactLink>
      </GridContainer>
    </div>
  );
};

export default ContractAssistanceSection;
