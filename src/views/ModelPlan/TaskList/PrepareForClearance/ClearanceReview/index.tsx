import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { MutationFunction, useMutation } from '@apollo/client';
import {
  Button,
  Grid,
  GridContainer,
  IconArrowForward
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { UpdateClearanceBasics as UpdateClearanceBasicsType } from 'queries/PrepareForClearance/types/UpdateClearanceBasics';
import { UpdateClearanceBeneficiaries as UpdateClearanceBeneficiariesType } from 'queries/PrepareForClearance/types/UpdateClearanceBeneficiaries';
import { UpdateClearanceCharacteristics as UpdateClearanceCharacteristicsType } from 'queries/PrepareForClearance/types/UpdateClearanceCharacteristics';
import { UpdateClearanceOpsEvalAndLearning as UpdateClearanceOpsEvalAndLearningType } from 'queries/PrepareForClearance/types/UpdateClearanceOpsEvalAndLearning';
import { UpdateClearanceParticipantsAndProviders as UpdateClearanceParticipantsAndProvidersType } from 'queries/PrepareForClearance/types/UpdateClearanceParticipantsAndProviders';
import { UpdateClearancePayments as UpdateClearancePaymentsType } from 'queries/PrepareForClearance/types/UpdateClearancePayments';
import UpdateClearanceBasics from 'queries/PrepareForClearance/UpdateClearanceBasics';
import UpdateClearanceBeneficiaries from 'queries/PrepareForClearance/UpdateClearanceBeneficiaries';
import UpdateClearanceCharacteristics from 'queries/PrepareForClearance/UpdateClearanceCharacteristics';
import UpdateClearanceOpsEvalAndLearning from 'queries/PrepareForClearance/UpdateClearanceOpsEvalAndLearning';
import UpdateClearanceParticipantsAndProviders from 'queries/PrepareForClearance/UpdateClearanceParticipantsAndProviders';
import UpdateClearancePayments from 'queries/PrepareForClearance/UpdateClearancePayments';
import { TaskStatus } from 'types/graphql-global-types';
import ReadOnlyBeneficiaries from 'views/ModelPlan/ReadOnly/Beneficiaries';
import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyParticipantsAndProviders from 'views/ModelPlan/ReadOnly/ParticipantsAndProviders';
import ReadOnlyPayments from 'views/ModelPlan/ReadOnly/Payments';

type ClearanceReviewProps = {
  modelID: string;
};

type ClearanceParamProps = {
  section: string;
  sectionID: string;
};

type mutationObjectType = {
  [key: string]: MutationFunction;
};

type routeMapType = {
  [key: string]: string;
};

const routeMap: routeMapType = {
  basics: 'basics',
  characteristics: 'generalCharacteristics',
  'participants-and-providers': 'participantsAndProviders',
  beneficiaries: 'beneficiaries',
  'ops-eval-and-learning': 'opsEvalAndLearning',
  payment: 'payment'
};

const renderReviewTaskSection = (
  modelID: string,
  section: string
): JSX.Element => {
  switch (section) {
    case 'basics':
      return <ReadOnlyModelBasics modelID={modelID} clearance />;
    case 'characteristics':
      return <ReadOnlyGeneralCharacteristics modelID={modelID} clearance />;
    case 'participants-and-providers':
      return <ReadOnlyParticipantsAndProviders modelID={modelID} clearance />;
    case 'beneficiaries':
      return <ReadOnlyBeneficiaries modelID={modelID} clearance />;
    case 'ops-eval-and-learning':
      return <ReadOnlyModelBasics modelID={modelID} clearance />;
    case 'payment':
      return <ReadOnlyPayments modelID={modelID} clearance />;
    default:
      return <></>;
  }
};

export const ClearanceReview = ({ modelID }: ClearanceReviewProps) => {
  const [errors, setErrors] = useState<string>();
  const { section, sectionID } = useParams<ClearanceParamProps>();

  const { t } = useTranslation('draftModelPlan');
  const { t: p } = useTranslation('prepareForClearance');
  const history = useHistory();

  const taskListSections: any = t('modelPlanTaskList:numberedList', {
    returnObjects: true
  });

  const [updateBasics] = useMutation<UpdateClearanceBasicsType>(
    UpdateClearanceBasics
  );

  const [
    updateCharacteristics
  ] = useMutation<UpdateClearanceCharacteristicsType>(
    UpdateClearanceCharacteristics
  );

  const [
    updateParticipantsAndProviders
  ] = useMutation<UpdateClearanceParticipantsAndProvidersType>(
    UpdateClearanceParticipantsAndProviders
  );

  const [updateBeneficiaries] = useMutation<UpdateClearanceBeneficiariesType>(
    UpdateClearanceBeneficiaries
  );

  const [
    updateOpsEvalAndLearning
  ] = useMutation<UpdateClearanceOpsEvalAndLearningType>(
    UpdateClearanceOpsEvalAndLearning
  );

  const [updatePayments] = useMutation<UpdateClearancePaymentsType>(
    UpdateClearancePayments
  );

  const clearanceMutations: mutationObjectType = {
    basics: updateBasics,
    characteristics: updateCharacteristics,
    'participants-and-providers': updateParticipantsAndProviders,
    beneficiaries: updateBeneficiaries,
    'ops-eval-and-learning': updateOpsEvalAndLearning,
    payment: updatePayments
  };

  const handleFormSubmit = (taskSection: string) => {
    clearanceMutations[taskSection]({
      variables: {
        id: sectionID,
        changes: { status: TaskStatus.READY_FOR_CLEARANCE }
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push(`/models/${modelID}/task-list/prepare-for-clearance`);
        }
      })
      .catch(() => {
        setErrors(p('mutationError'));
      });
  };

  return (
    <MainContent data-testid="clearance-review">
      <GridContainer>
        <Grid desktop={{ col: 12 }} className="padding-y-6">
          {errors && (
            <ErrorAlert
              testId="formik-validation-errors"
              classNames="margin-y-3"
              heading={p('errorHeading')}
            >
              <ErrorAlertMessage errorKey="error" message={errors} />
            </ErrorAlert>
          )}

          {renderReviewTaskSection(modelID, section)}
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
            <Button type="submit" onClick={() => handleFormSubmit(section)}>
              {p('markAsReady')}
            </Button>
          </div>
          <Button
            type="button"
            className="usa-button usa-button--unstyled display-flex"
            onClick={() =>
              history.push(`/models/${modelID}/task-list/${section}`)
            }
          >
            {p('changes', {
              section: taskListSections[
                routeMap[section]
              ]?.heading?.toLowerCase()
            })}
            <IconArrowForward className="margin-left-1" aria-hidden />
          </Button>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ClearanceReview;
