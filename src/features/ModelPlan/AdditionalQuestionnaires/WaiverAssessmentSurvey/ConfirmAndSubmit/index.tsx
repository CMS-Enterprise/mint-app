import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import SelectedWaiversTable from 'features/ModelPlan/ReadOnly/_components/SelectedWaiversTable';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetAllWaiverAssessmentSurveyQuery,
  TypedUpdateWaiverAssessmentSurveyDocument,
  useGetAllWaiverAssessmentSurveyQuery
} from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateLocal } from 'utils/date';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import WaiverAssessmentSurveyReadOnlySections from '../_components/WaiverAssessmentSurveyReadOnlySections';
import {
  getAllWaiverAssessmentSurveyMockData,
  MOCK_WAIVERS_ENABLED
} from '../mockWaiversData';
import { isWaiverSurveyQuestionsComplete } from '../util';

type ConfirmAndSubmitForm = Pick<
  GetAllWaiverAssessmentSurveyQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'],
  'id' | 'isComplete' | 'completedByUserAccount' | 'completedDts'
>;

const DEFAULT_FORM_VALUES: ConfirmAndSubmitForm = {
  id: '',
  isComplete: false,
  completedByUserAccount: {
    __typename: 'UserAccount',
    id: '',
    commonName: ''
  },
  completedDts: ''
};

const ConfirmAndSubmit = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { isComplete: isCompleteConfig } = usePlanTranslation(
    'waiverAssessmentSurvey'
  );

  const navigate = useNavigate();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError
  } = useGetAllWaiverAssessmentSurveyQuery({
    variables: {
      id: modelID
    },
    skip: !modelID || MOCK_WAIVERS_ENABLED
  });

  const data = MOCK_WAIVERS_ENABLED
    ? getAllWaiverAssessmentSurveyMockData(modelID)
    : queryData;

  const loading = MOCK_WAIVERS_ENABLED ? false : queryLoading;
  const error = MOCK_WAIVERS_ENABLED ? undefined : queryError;

  const waiverAssessmentSurveyData =
    data?.modelPlan?.questionnaires?.waiverAssessmentSurvey;

  const isSurveyComplete = waiverAssessmentSurveyData
    ? isWaiverSurveyQuestionsComplete(waiverAssessmentSurveyData)
    : false;

  const mappedFormData = mapDefaultFormValues<ConfirmAndSubmitForm>(
    waiverAssessmentSurveyData,
    DEFAULT_FORM_VALUES
  );

  const methods = useForm<ConfirmAndSubmitForm>({
    values: mappedFormData,
    mode: 'onChange'
  });

  const { handleSubmit, watch, control } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<ConfirmAndSubmitForm>(
      TypedUpdateWaiverAssessmentSurveyDocument,
      {
        id: mappedFormData.id,
        rhfRef: {
          initialValues: mappedFormData,
          values: watch()
        }
      }
    );

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !waiverAssessmentSurveyData) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT('confirmAndSubmit.heading')}
        currentPage={7}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-5 text-base-dark">
        {waiverAssessmentSurveyMiscT('confirmAndSubmit.description')}
      </p>

      <h3 className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </h3>

      <div className="margin-bottom-5">
        {waiverAssessmentSurveyData.waivers.length === 0 ? (
          <Alert type="info" slim>
            {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
          </Alert>
        ) : (
          <SelectedWaiversTable
            selectedWaivers={waiverAssessmentSurveyData.waivers}
          />
        )}
      </div>

      <WaiverAssessmentSurveyReadOnlySections modelPlan={data.modelPlan} />

      <SummaryBox className="maxw-tablet">
        <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
          {waiverAssessmentSurveyMiscT('confirmAndSubmit.summaryBox.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <p className="margin-0">
            <Trans
              i18nKey="waiverAssessmentSurveyMisc:confirmAndSubmit.summaryBox.text"
              components={{
                // TODO: Update link
                link1: <Link href="/">link</Link>
              }}
            />
          </p>
        </SummaryBoxContent>
      </SummaryBox>

      <FormProvider {...methods}>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
          url={mutationError.destinationURL}
        />

        <Form
          id="waiver-assessment-survey-confirm-and-submit-form"
          data-testid="waiver-assessment-survey-confirm-and-submit-form"
          className="maxw-none"
          onSubmit={handleSubmit(() => {
            navigate(
              `/models/${modelID}/collaboration-area/additional-questionnaires`
            );
          })}
        >
          <ConfirmLeaveRHF />

          <div className="margin-top-6 margin-bottom-3 maxw-tablet border-1px border-base-light radius-md padding-2">
            <p className="margin-y-0">
              {waiverAssessmentSurveyMiscT(
                'confirmAndSubmit.questionnaireStatus'
              )}
            </p>

            <Controller
              name="isComplete"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-y-0">
                  <CheckboxField
                    name={field.name}
                    id={convertCamelCaseToKebabCase(field.name)}
                    data-testid={convertCamelCaseToKebabCase(field.name)}
                    checked={field.value === true}
                    disabled={!isSurveyComplete}
                    value="true"
                    label={isCompleteConfig.options.true}
                    onChange={e => {
                      field.onChange(e.target.checked);
                    }}
                    onBlur={field.onBlur}
                  />

                  {mappedFormData.completedByUserAccount?.commonName &&
                    mappedFormData.completedDts && (
                      <p className="margin-top-1 margin-bottom-0 margin-left-4 text-base">
                        {miscellaneousT('markedComplete', {
                          user: mappedFormData.completedByUserAccount.commonName
                        })}
                        {formatDateLocal(
                          mappedFormData.completedDts,
                          'MM/dd/yyyy'
                        )}
                      </p>
                    )}
                </FormGroup>
              )}
            />

            {!isSurveyComplete && (
              <Alert type="warning" slim>
                {waiverAssessmentSurveyMiscT(
                  'confirmAndSubmit.questionnaireStatusAlert'
                )}
              </Alert>
            )}
          </div>

          <div className="margin-top-6 margin-bottom-3 display-flex">
            <Button
              type="button"
              className="usa-button usa-button--outline margin-top-0"
              disabled={isSubmitting}
              onClick={() =>
                navigate(
                  `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/waiver-selection-and-confirmation`
                )
              }
            >
              {miscellaneousT('back')}
            </Button>
            <Button
              type="submit"
              className="margin-top-0"
              disabled={isSubmitting}
            >
              {waiverAssessmentSurveyMiscT('confirmAndSubmit.saveAndExit')}
            </Button>
          </div>
        </Form>
      </FormProvider>

      <PageNumber currentPage={7} totalPages={7} className="margin-y-6" />
    </div>
  );
};

export default ConfirmAndSubmit;
