import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

interface MTOWarningType {
  className?: string;
  id: string;
  route?: string;
}

const MTOWarning = ({ className, id, route }: MTOWarningType) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const mtoRoute =
    route || `/models/${modelID}/collaboration-area/model-to-operations/matrix`;

  return (
    <Alert type="info" className={classNames('mto-warning', className)} id={id}>
      <Trans
        t={t}
        i18nKey="warningRedirect"
        components={{
          link1: (
            <UswdsReactLink
              to={mtoRoute}
              className="usa-button usa-button--unstyled"
            >
              {' '}
            </UswdsReactLink>
          )
        }}
      />
    </Alert>
  );
};

export default MTOWarning;
