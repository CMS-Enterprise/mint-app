import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import NotFound from 'features/NotFound';
import {
  AnticipatedMultiPayerDataAvailabilityUseCase,
  DataToCollectFromParticipants,
  DataToSendToParticipants,
  GetCollectionAndAggregationQuery,
  GetNewMethodologiesAndConsiderationsQuery,
  MultiSourceDataToCollect,
  TypedUpdateDataExchangeApproachDocument,
  useGetCollectionAndAggregationQuery,
  useGetNewMethodologiesAndConsiderationsQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormPageHeader from 'components/FormPageHeader';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { Bool, getKeys } from 'types/translation';
import { onChangeCheckboxHandler } from 'utils/formUtil';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import {
  composeMultiSelectOptions,
  convertCamelCaseToHyphenated,
  convertToLowercaseAndDashes
} from 'utils/modelPlan';

import SubmittionFooter from '../../../../components/SubmittionFooter';

type NewMethodologiesAndConsiderationsType =
  GetNewMethodologiesAndConsiderationsQuery['modelPlan']['dataExchangeApproach'];

const defaulFormValues: NewMethodologiesAndConsiderationsType = {
  __typename: 'PlanDataExchangeApproach',
  id: '',
  willImplementNewDataExchangeMethods: null,
  newDataExchangeMethodsDescription: '',
  newDataExchangeMethodsNote: '',
  additionalDataExchangeConsiderationsDescription: '',
  isDataExchangeApproachComplete: false,
  markedCompleteByUserAccount: {
    __typename: 'UserAccount',
    id: '',
    commonName: ''
  },
  markedCompleteDts: ''
};

const NewMethodologiesAndConsiderations = () => {
  const { t: dataExchangeApproachT } = useTranslation('dataExchangeApproach');
  const { t: dataExchangeApproachMiscT } = useTranslation(
    'dataExchangeApproachMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    willImplementNewDataExchangeMethods:
      willImplementNewDataExchangeMethodsConfig,
    isDataExchangeApproachComplete: isDataExchangeApproachCompleteConfig,
    status: statusConfig
  } = usePlanTranslation('dataExchangeApproach');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { data, loading, error } = useGetNewMethodologiesAndConsiderationsQuery(
    {
      variables: { id: modelID }
    }
  );

  const formData = mapDefaultFormValues<NewMethodologiesAndConsiderationsType>(
    data?.modelPlan?.dataExchangeApproach,
    defaulFormValues
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<NewMethodologiesAndConsiderationsType>({
    defaultValues
  });

  const {
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { touchedFields }
  } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<NewMethodologiesAndConsiderationsType>(
      TypedUpdateDataExchangeApproachDocument,
      {
        id,
        rhfRef: {
          initialValues: defaultValues,
          values: watch()
        }
      }
    );

  useEffect(() => {
    reset(
      mapDefaultFormValues<NewMethodologiesAndConsiderationsType>(
        data?.modelPlan?.dataExchangeApproach,
        defaulFormValues
      )
    );
  }, [data, reset]);

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <FormPageHeader
        header={dataExchangeApproachMiscT(
          'newMethodologiesAndConsiderations.heading'
        )}
        currentPage={4}
        totalPages={4}
      />

      <FormProvider {...methods}>
        <Form
          id="new-methodologies-and-additional-considerations-form"
          onSubmit={handleSubmit(() => {
            history.push(
              `/models/${modelID}/collaboration-area/data-exchange-approach/new-methodologies-and-additional-considerations`
            );
          })}
          className="maxw-none"
        >
          <Fieldset disabled={loading}>
            <ConfirmLeaveRHF />

            <Grid row gap>
              <Grid desktop={{ col: 6 }}>
                <Controller
                  name="willImplementNewDataExchangeMethods"
                  control={control}
                  render={({ field }) => (
                    <FormGroup>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(field.name)}
                        className="maxw-none"
                      >
                        {willImplementNewDataExchangeMethodsConfig.label}
                      </Label>

                      <HelpText className="margin-top-1">
                        {willImplementNewDataExchangeMethodsConfig.sublabel}
                      </HelpText>

                      <Radio
                        {...field}
                        id={`${convertCamelCaseToHyphenated(field.name)}-true`}
                        value="true"
                        label={
                          willImplementNewDataExchangeMethodsConfig.options.true
                        }
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                      />

                      {!!watch('willImplementNewDataExchangeMethods') && (
                        <Controller
                          name="newDataExchangeMethodsDescription"
                          control={control}
                          render={({ field: field2 }) => (
                            <FormGroup className="margin-top-105 margin-left-4">
                              <Label
                                htmlFor={convertCamelCaseToHyphenated(
                                  field2.name
                                )}
                                className="maxw-none text-normal"
                              >
                                {dataExchangeApproachT(
                                  'newDataExchangeMethodsDescription.label'
                                )}
                              </Label>

                              <Textarea
                                {...field2}
                                id={convertCamelCaseToHyphenated(field2.name)}
                                value={field2.value || ''}
                                className="height-card"
                              />
                            </FormGroup>
                          )}
                        />
                      )}

                      <Radio
                        {...field}
                        id={`${convertCamelCaseToHyphenated(field.name)}-false`}
                        value="false"
                        label={
                          willImplementNewDataExchangeMethodsConfig.options
                            .false
                        }
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                      />
                    </FormGroup>
                  )}
                />

                <AddNoteRHF
                  field="newDataExchangeMethodsNote"
                  control={control}
                  touched={!!touchedFields?.newDataExchangeMethodsNote}
                />

                <Controller
                  name="additionalDataExchangeConsiderationsDescription"
                  control={control}
                  render={({ field }) => (
                    <FormGroup>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(field.name)}
                        className="maxw-none"
                      >
                        {dataExchangeApproachT(
                          'additionalDataExchangeConsiderationsDescription.label'
                        )}
                      </Label>

                      <Textarea
                        {...field}
                        id={convertCamelCaseToHyphenated(field.name)}
                        value={field.value || ''}
                        className="height-card"
                      />
                    </FormGroup>
                  )}
                />

                <Alert type="info" slim className="margin-top-6">
                  {dataExchangeApproachMiscT(
                    'newMethodologiesAndConsiderations.alert'
                  )}
                </Alert>

                <Controller
                  name="isDataExchangeApproachComplete"
                  control={control}
                  render={({ field }) => (
                    <FormGroup className="border-2px border-base-light radius-md padding-2">
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(field.name)}
                        className="maxw-none text-normal"
                      >
                        {isDataExchangeApproachCompleteConfig.label}
                      </Label>

                      <FormGroup className="margin-0">
                        <CheckboxField
                          {...field}
                          id={`${field.name}-true`}
                          checked={field.value === true}
                          value="true"
                          onBlur={field.onBlur}
                          onChange={e => {
                            field.onChange(e.target.checked);
                          }}
                          label={
                            isDataExchangeApproachCompleteConfig.options.true
                          }
                          subLabel={
                            isDataExchangeApproachCompleteConfig.sublabel
                          }
                        />
                      </FormGroup>
                    </FormGroup>
                  )}
                />

                <SubmittionFooter
                  homeArea={miscellaneousT('saveAndReturnToCollaborationArea')}
                  homeRoute={`/models/${modelID}/collaboration-area`}
                  backPage={`/models/${modelID}/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation`}
                  nextPage
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={3} totalPages={4} className="margin-y-6" />
    </>
  );
};

export default NewMethodologiesAndConsiderations;
