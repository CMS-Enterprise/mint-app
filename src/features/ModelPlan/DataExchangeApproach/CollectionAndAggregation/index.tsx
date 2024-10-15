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
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import NotFound from 'features/NotFound';
import {
  AnticipatedMultiPayerDataAvailabilityUseCase,
  DataToCollectFromParticipants,
  DataToSendToParticipants,
  GetCollectionAndAggregationQuery,
  MultiSourceDataToCollect,
  TypedUpdateDataExchangeApproachDocument,
  useGetCollectionAndAggregationQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormPageHeader from 'components/FormPageHeader';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { onChangeCheckboxHandler } from 'utils/formUtil';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import {
  composeMultiSelectOptions,
  convertCamelCaseToHyphenated,
  convertToLowercaseAndDashes
} from 'utils/modelPlan';

import SubmittionFooter from '../../../../components/SubmittionFooter';

type CollectionAndAggregationType =
  GetCollectionAndAggregationQuery['modelPlan']['dataExchangeApproach'];

const defaulFormValues: CollectionAndAggregationType = {
  __typename: 'PlanDataExchangeApproach',
  id: '',
  doesNeedToMakeMultiPayerDataAvailable: null,
  anticipatedMultiPayerDataAvailabilityUseCase: [],
  doesNeedToMakeMultiPayerDataAvailableNote: '',
  doesNeedToCollectAndAggregateMultiSourceData: null,
  multiSourceDataToCollect: [],
  multiSourceDataToCollectOther: '',
  doesNeedToCollectAndAggregateMultiSourceDataNote: ''
};

const CollectionAndAggregation = () => {
  const { t: dataExchangeApproachT } = useTranslation('dataExchangeApproach');
  const { t: dataExchangeApproachMiscT } = useTranslation(
    'dataExchangeApproachMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    doesNeedToMakeMultiPayerDataAvailable:
      doesNeedToMakeMultiPayerDataAvailableConfig,
    anticipatedMultiPayerDataAvailabilityUseCase:
      anticipatedMultiPayerDataAvailabilityUseCaseConfig,
    doesNeedToCollectAndAggregateMultiSourceData:
      doesNeedToCollectAndAggregateMultiSourceDataConfig,
    multiSourceDataToCollect: multiSourceDataToCollectConfig
  } = usePlanTranslation('dataExchangeApproach');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { data, loading, error } = useGetCollectionAndAggregationQuery({
    variables: { id: modelID }
  });

  const formData = mapDefaultFormValues<CollectionAndAggregationType>(
    data?.modelPlan?.dataExchangeApproach,
    defaulFormValues
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<CollectionAndAggregationType>({
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
    useHandleMutation<CollectionAndAggregationType>(
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
      mapDefaultFormValues<CollectionAndAggregationType>(
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
        header={dataExchangeApproachMiscT('collectionAndAggregation.heading')}
        currentPage={3}
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
                  name="doesNeedToMakeMultiPayerDataAvailable"
                  control={control}
                  render={({ field }) => (
                    <FormGroup error={!!error}>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(field.name)}
                        className="maxw-none"
                      >
                        {doesNeedToMakeMultiPayerDataAvailableConfig.label}
                      </Label>

                      {getKeys(
                        doesNeedToMakeMultiPayerDataAvailableConfig.options
                      ).map(value => (
                        <Radio
                          {...field}
                          key={value}
                          id={`${convertCamelCaseToHyphenated(field.name)}-${value}`}
                          value={value}
                          label={
                            doesNeedToMakeMultiPayerDataAvailableConfig.options[
                              value
                            ]
                          }
                          checked={
                            (field.value === true && value === 'true') ||
                            (field.value === false && value === 'false')
                          }
                          onChange={() => field.onChange(value === 'true')}
                        />
                      ))}
                    </FormGroup>
                  )}
                />

                <Controller
                  name="anticipatedMultiPayerDataAvailabilityUseCase"
                  control={control}
                  render={({ field }) => (
                    <FormGroup>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(
                          'anticipatedMultiPayerDataAvailabilityUseCase'
                        )}
                        className={classNames('text-normal margin-top-4', {
                          'text-base': !watch(
                            'doesNeedToMakeMultiPayerDataAvailable'
                          )
                        })}
                      >
                        {
                          anticipatedMultiPayerDataAvailabilityUseCaseConfig.label
                        }
                      </Label>

                      {getKeys(
                        anticipatedMultiPayerDataAvailabilityUseCaseConfig.options
                      ).map(value => (
                        <CheckboxField
                          id={`${convertCamelCaseToHyphenated(
                            'anticipatedMultiPayerDataAvailabilityUseCase'
                          )}-${value}`}
                          name={field.name}
                          value={value}
                          checked={field.value.includes(value)}
                          onBlur={field.onBlur}
                          onChange={e => {
                            onChangeCheckboxHandler<AnticipatedMultiPayerDataAvailabilityUseCase>(
                              e.target
                                .value as AnticipatedMultiPayerDataAvailabilityUseCase,
                              field
                            );
                          }}
                          label={
                            anticipatedMultiPayerDataAvailabilityUseCaseConfig
                              .options[value]
                          }
                          disabled={
                            !watch('doesNeedToMakeMultiPayerDataAvailable')
                          }
                        />
                      ))}
                    </FormGroup>
                  )}
                />

                <AddNoteRHF
                  field="doesNeedToMakeMultiPayerDataAvailableNote"
                  control={control}
                  touched={
                    !!touchedFields?.doesNeedToMakeMultiPayerDataAvailableNote
                  }
                />

                <Controller
                  name="doesNeedToCollectAndAggregateMultiSourceData"
                  control={control}
                  render={({ field }) => (
                    <FormGroup error={!!error}>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(field.name)}
                        className="maxw-none"
                      >
                        {
                          doesNeedToCollectAndAggregateMultiSourceDataConfig.label
                        }
                      </Label>

                      {getKeys(
                        doesNeedToCollectAndAggregateMultiSourceDataConfig.options
                      ).map(value => (
                        <Radio
                          {...field}
                          key={value}
                          id={`${convertCamelCaseToHyphenated(field.name)}-${value}`}
                          value={value}
                          label={
                            doesNeedToCollectAndAggregateMultiSourceDataConfig
                              .options[value]
                          }
                          checked={
                            (field.value === true && value === 'true') ||
                            (field.value === false && value === 'false')
                          }
                          onChange={() => field.onChange(value === 'true')}
                        />
                      ))}
                    </FormGroup>
                  )}
                />

                <Controller
                  name="multiSourceDataToCollect"
                  control={control}
                  render={({ field }) => (
                    <FormGroup error={!!error}>
                      <Label
                        htmlFor={convertCamelCaseToHyphenated(
                          'multiSourceDataToCollect'
                        )}
                        className={classNames('text-normal margin-top-4', {
                          'text-base': !watch(
                            'doesNeedToCollectAndAggregateMultiSourceData'
                          )
                        })}
                      >
                        {multiSourceDataToCollectConfig.label}
                      </Label>

                      <HelpText className="margin-top-1">
                        {multiSourceDataToCollectConfig.sublabel}
                      </HelpText>

                      <MultiSelect
                        {...field}
                        id={convertCamelCaseToHyphenated(
                          'multiSourceDataToCollect'
                        )}
                        ariaLabel={multiSourceDataToCollectConfig.label}
                        options={composeMultiSelectOptions(
                          multiSourceDataToCollectConfig.options,
                          multiSourceDataToCollectConfig.readonlyOptions
                        )}
                        selectedLabel={
                          multiSourceDataToCollectConfig.multiSelectLabel || ''
                        }
                        initialValues={watch('multiSourceDataToCollect')}
                        disabled={
                          !watch('doesNeedToCollectAndAggregateMultiSourceData')
                        }
                      />
                    </FormGroup>
                  )}
                />

                {watch('multiSourceDataToCollect').includes(
                  MultiSourceDataToCollect.OTHER
                ) && (
                  <Controller
                    name="multiSourceDataToCollectOther"
                    control={control}
                    render={({ field }) => (
                      <FormGroup className="margin-bottom-3">
                        <Label
                          htmlFor={convertCamelCaseToHyphenated(
                            'multiSourceDataToCollectOther'
                          )}
                          className="text-normal"
                        >
                          {dataExchangeApproachT(
                            'multiSourceDataToCollectOther.label'
                          )}
                        </Label>

                        <TextInput
                          {...field}
                          id={convertCamelCaseToHyphenated(
                            'multiSourceDataToCollectOther'
                          )}
                          type="text"
                          value={field.value || ''}
                        />
                      </FormGroup>
                    )}
                  />
                )}

                <AddNoteRHF
                  field="doesNeedToCollectAndAggregateMultiSourceDataNote"
                  control={control}
                  touched={
                    !!touchedFields?.doesNeedToCollectAndAggregateMultiSourceDataNote
                  }
                />

                <SubmittionFooter
                  homeArea={miscellaneousT('saveAndReturnToCollaborationArea')}
                  homeRoute={`/models/${modelID}/collaboration-area`}
                  backPage={`/models/${modelID}/collaboration-area/data-exchange-approach/collecting-and-sending-data`}
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

export default CollectionAndAggregation;
