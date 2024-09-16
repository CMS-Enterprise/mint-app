import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';
import CRTDLTable from 'features/ModelPlan/CRTDL/CRTDLs/table';

import Alert from 'components/Alert';
import Expire from 'components/Expire';

type CRTDLStatusType = 'success' | 'error';

const ReadOnlyCRTDLs = ({
  modelID,
  isHelpArticle
}: {
  modelID: string;
  isHelpArticle?: boolean;
}) => {
  const { t } = useTranslation('crtdlsMisc');
  const [crtdlMessage, setCRTDLMessage] = useState('');
  const [crtdlStatus, setCRTDLStatus] = useState<CRTDLStatusType>('error');

  return (
    <div
      className="read-only-model-plan--cr-and-tdls"
      data-testid="read-only-model-plan--cr-and-tdls"
    >
      <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>

      <p className="font-body-md line-height-body-4">
        {t('readOnlyDescription')}
      </p>

      <Link
        aria-label="Open EUA in a new tab"
        href="https://echimp.cmsnet/"
        target="_blank"
        rel="noopener noreferrer"
        variant="external"
        className="display-block margin-y-3"
      >
        {t('visitECHIMPReadonly')}
      </Link>

      <Alert type="info" slim className="margin-bottom-1">
        {t('echimp')}
      </Alert>

      {crtdlMessage && (
        <Expire delay={45000}>
          <Alert
            type={crtdlStatus}
            slim
            data-testid="mandatory-fields-alert"
            className="margin-y-4"
          >
            <span className="mandatory-fields-alert__text">{crtdlMessage}</span>
          </Alert>
        </Expire>
      )}

      <CRTDLTable
        modelID={modelID}
        readOnly
        setCRTDLMessage={setCRTDLMessage}
        setCRTDLStatus={setCRTDLStatus}
        isHelpArticle={isHelpArticle}
      />
    </div>
  );
};

export default ReadOnlyCRTDLs;
