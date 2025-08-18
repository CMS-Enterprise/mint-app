import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import './index.scss';

// TODO: This is a temporary fix to handle model plan errors. Keys on error message strings from gql
const modelPlanErrors: string[] = [
  'no model plan found for the given modelPlanID',
  'invalid UUID length'
];

const NotFoundPartial = ({
  errorMessage,
  componentNotFound
}: {
  errorMessage?: string;
  componentNotFound?: boolean; // Renders text for component not found rather than an entire page not found
}) => {
  const { t } = useTranslation();

  const listItems = tArray('error:notFound.list');

  const isModelPlanError = modelPlanErrors.some(error =>
    errorMessage?.includes(error)
  );

  const headerText = () => {
    if (isModelPlanError) {
      return t('error:notFound.modelPlanError');
    }

    if (componentNotFound) {
      return t('error:notFound.fetchError');
    }
    return t('error:notFound.heading');
  };

  return (
    <div
      className={classNames('margin-y-7', {
        'padding-right-4': componentNotFound,
        'margin-y-0': componentNotFound
      })}
    >
      <PageHeading
        style={{ lineHeight: componentNotFound ? '2rem' : '3rem' }}
        headingLevel={componentNotFound ? 'h3' : 'h1'}
        className={classNames({ 'margin-y-0': componentNotFound })}
      >
        {headerText()}
      </PageHeading>
      <p>{t('error:notFound.thingsToTry')}</p>

      <ul className="mint-not-found__error_suggestions">
        {listItems.map(item => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
      <p className="margin-bottom-5">{t('error:notFound.tryAgain')}</p>
      <UswdsReactLink className="usa-button" variant="unstyled" to="/">
        {t('error:notFound.goHome')}
      </UswdsReactLink>
    </div>
  );
};

export default NotFoundPartial;
