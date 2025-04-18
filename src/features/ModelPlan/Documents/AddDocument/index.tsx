import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';

import DocumentUpload from './documentUpload';

const AddDocument = () => {
  const { t } = useTranslation('documentsMisc');

  const [formState, setFormState] = useState<'upload' | 'link'>('upload');

  const history = useHistory();

  const { state } = useLocation<{
    state: {
      fromCollaborationArea?: boolean;
    };
    fromCollaborationArea?: boolean;
  }>();

  const breadcrumbs = [
    BreadcrumbItemOptions.HOME,
    BreadcrumbItemOptions.COLLABORATION_AREA,
    BreadcrumbItemOptions.DOCUMENTS
  ];

  const updatedBreadcrumbs = state?.fromCollaborationArea
    ? breadcrumbs.filter(item => item !== BreadcrumbItemOptions.DOCUMENTS)
    : breadcrumbs;

  return (
    <MainContent data-testid="add-document">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={updatedBreadcrumbs}
            customItem={t('addDocument')}
          />
        </Grid>
      </GridContainer>
      <GridContainer>
        <Grid desktop={{ col: 6 }}>
          <PageHeading className="margin-top-4 margin-bottom-0">
            {t('addDocument')}
          </PageHeading>

          <p className="margin-bottom-2 font-body-md line-height-body-4">
            {t('uploadDescription')}
          </p>

          <p className="margin-bottom-3 font-body-md line-height-body-4">
            {t('requiredHint')}
            <RequiredAsterisk />
            {t('requiredHint2')}
          </p>

          <ButtonGroup type="segmented">
            <Button
              type="button"
              outline={formState !== 'upload'}
              onClick={() => setFormState('upload')}
            >
              {t('segmentedButton.upload')}
            </Button>
            <Button
              type="button"
              outline={formState !== 'link'}
              onClick={() => setFormState('link')}
            >
              {t('segmentedButton.link')}
            </Button>
          </ButtonGroup>

          <DocumentUpload />

          <div className="display-block">
            <Button
              type="button"
              onClick={() => history.goBack()}
              className="display-inline-flex flex-align-center margin-y-3 usa-button usa-button--unstyled"
            >
              <Icon.ArrowBack className="margin-right-1" aria-hidden />
              {t('dontAdd')}
            </Button>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default AddDocument;
