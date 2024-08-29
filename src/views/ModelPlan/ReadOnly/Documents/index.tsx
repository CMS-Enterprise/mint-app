import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import PlanDocumentsTable from 'views/ModelPlan/Documents/table';

export type DocumentStatusType = 'success' | 'error';

const ReadOnlyDocuments = ({
  modelID,
  isHelpArticle
}: {
  modelID: string;
  isHelpArticle?: boolean;
}) => {
  const { t } = useTranslation('documentsMisc');

  const [documentMessage, setDocumentMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusType>(
    'error'
  );

  return (
    <div
      className="read-only-model-plan--documents"
      data-testid="read-only-model-plan--documents"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4">{t('heading')}</h2>
      </div>

      {documentMessage && (
        <Expire delay={45000}>
          <Alert
            type={documentStatus}
            slim
            data-testid="mandatory-fields-alert"
            className="margin-y-4"
          >
            <span className="mandatory-fields-alert__text">
              {documentMessage}
            </span>
          </Alert>
        </Expire>
      )}

      <PlanDocumentsTable
        modelID={modelID}
        setDocumentMessage={setDocumentMessage}
        setDocumentStatus={setDocumentStatus}
        isHelpArticle={isHelpArticle}
      />
    </div>
  );
};

export default ReadOnlyDocuments;
