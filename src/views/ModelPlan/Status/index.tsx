import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const Status = () => {
  const { t } = useTranslation('modelPlan');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelId } = useParams<{ modelId: string }>();

  return (
    <MainContent>
      <GridContainer>
        <Grid col={6}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{h('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/models/${modelId}/task-list/`}
              >
                <span>{h('tasklistBreadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('status.heading')}</Breadcrumb>
          </BreadcrumbBar>
          <PageHeading className="margin-bottom-1">
            {t('status.heading')}
          </PageHeading>
          <p className="margin-bottom-6 line-height-body-5">
            {t('status.copy')}
          </p>
          {/*
            formik
            label
            dropdown

            update button submit button

            return link
           */}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Status;
