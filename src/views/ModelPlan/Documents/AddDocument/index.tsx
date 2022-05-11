import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  IconArrowBack
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import NewUpload from './fileUpload';

const AddDocument = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('documents');
  const { modelID } = useParams<{ modelID: string }>();

  return (
    <MainContent data-testid="new-plan">
      <div className="grid-container">
        <div className="tablet:grid-col-6">
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelID}/task-list`}
              >
                <span>{t('breadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelID}/documents`}
              >
                <span>{t('heading')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('breadcrumb2')}</Breadcrumb>
          </BreadcrumbBar>

          <PageHeading className="margin-top-4 margin-bottom-0">
            {t('uploadDocument')}
          </PageHeading>

          <p className="margin-bottom-2 font-body-md line-height-body-4">
            {t('uploadDescription')}
          </p>

          <NewUpload />

          <div className="display-block">
            <UswdsReactLink
              to={`/models/${modelID}/documents`}
              className="display-inline-flex flex-align-center margin-y-3"
            >
              <IconArrowBack className="margin-right-1" aria-hidden />
              {t('dontUpload')}
            </UswdsReactLink>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default AddDocument;
