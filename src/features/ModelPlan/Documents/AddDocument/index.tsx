import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
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
import LinkDocument from './LinkDocument';

const AddDocument = () => {
  const { t } = useTranslation('documentsMisc');

  const [formState, setFormState] = useState<'upload' | 'link'>('upload');

  const navigate = useNavigate();

  const { state } = useLocation() as {
    state?: {
      fromCollaborationArea?: boolean;
    };
  };

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

          {formState === 'upload' ? <DocumentUpload /> : <LinkDocument />}

          <div className="display-block">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="display-inline-flex flex-align-center margin-y-3 usa-button usa-button--unstyled"
            >
              <Icon.ArrowBack
                className="margin-right-1"
                aria-hidden
                aria-label="back"
              />
              {t('dontAdd')}
            </Button>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default AddDocument;
