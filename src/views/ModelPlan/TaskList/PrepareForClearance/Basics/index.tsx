import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Grid,
  GridContainer,
  IconArrowForward
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import UpdateClearanceBasics from 'queries/PrepareForClearance/UpdateClearanceBasics';
import { TaskStatus } from 'types/graphql-global-types';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';

type ClearanceBasicsProps = {
  modelID: string;
};

export const ClearanceBasics = ({ modelID }: ClearanceBasicsProps) => {
  const { basicsID } = useParams<{ basicsID: string }>();

  const { t } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');
  const history = useHistory();

  const [update] = useMutation(UpdateClearanceBasics);

  const handleFormSubmit = () => {
    update({
      variables: {
        id: basicsID,
        changes: { status: TaskStatus.READY_FOR_CLEARANCE }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelID}/task-list/prepare-for-clearance`);
        }
      })
      .catch(errors => {
        console.log(errors); // TODO: error handling
      });
  };

  return (
    <MainContent data-testid="model-it-tools">
      <GridContainer>
        <Grid desktop={{ col: 12 }} className="padding-y-6">
          <ReadOnlyModelBasics modelID={modelID} clearance />
          <div className="margin-top-6 margin-bottom-3">
            <Button
              type="button"
              className="usa-button usa-button--outline margin-bottom-1"
              onClick={() => {
                history.push(
                  `/models/${modelID}/task-list/prepare-for-clearance`
                );
              }}
            >
              {t('back')}
            </Button>
            <Button type="submit" onClick={() => handleFormSubmit()}>
              {p('markAsReady')}
            </Button>
          </div>
          <Button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => history.push(`/models/${modelID}/task-list/basics`)}
          >
            {p('basicsChanges')}
            <IconArrowForward className="margin-right-1" aria-hidden />
          </Button>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ClearanceBasics;
