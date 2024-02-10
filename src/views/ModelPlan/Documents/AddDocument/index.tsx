import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';

import Breadcrumbs from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';

import DocumentUpload from './documentUpload';
import LinkDocument from './LinkDocument';

const AddDocument = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('documents');
  const { modelID } = useParams<{ modelID: string }>();

  const [formState, setFormState] = useState<'upload' | 'link'>('upload');

  const history = useHistory();

  const { state } = useLocation<{
    state: {
      solutionDetailsLink?: string;
      solutionID?: string;
    };
    solutionDetailsLink?: string;
    solutionID?: string;
  }>();

  const solutionDetailsLink = state?.solutionDetailsLink;
  const solutionID = state?.solutionID;

  const breadcrumbs = [
    { text: h('home'), url: '/' },
    { text: t('breadcrumb'), url: `/models/${modelID}/task-list/` },
    {
      text: solutionDetailsLink ? t('itTracker') : t('heading'),
      url: solutionDetailsLink
        ? `/models/${modelID}/task-list/it-solutions`
        : `/models/${modelID}/documents`
    },
    {
      text: t('solutionDetails'),
      url: solutionDetailsLink
    },
    { text: t('breadcrumb2') }
  ];

  return (
    <MainContent data-testid="add-document">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={
              solutionDetailsLink
                ? breadcrumbs
                : breadcrumbs.filter(item => item.text !== t('solutionDetails'))
            }
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

          <p className="margin-bottom-2 font-body-md line-height-body-4">
            {t('requiredHint')} <RequiredAsterisk /> {t('requiredHint2')}
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

          {formState === 'upload' ? (
            <DocumentUpload
              solutionDetailsLink={solutionDetailsLink}
              solutionID={solutionID}
            />
          ) : (
            <LinkDocument
              solutionDetailsLink={solutionDetailsLink}
              solutionID={solutionID}
            />
          )}

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
