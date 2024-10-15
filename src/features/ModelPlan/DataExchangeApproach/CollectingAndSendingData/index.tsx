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
  TextInput
} from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  DataToCollectFromParticipants,
  DataToSendToParticipants,
  GetCollectingAndSendingDataQuery,
  TypedUpdateDataExchangeApproachDocument,
  useGetCollectingAndSendingDataQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormPageHeader from 'components/FormPageHeader';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import SubmittionFooter from 'components/SubmittionFooter';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { onChangeCheckboxHandler } from 'utils/formUtil';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type CollectingAndSendingDataType =
  GetCollectingAndSendingDataQuery['modelPlan']['dataExchangeApproach'];

const defaulFormValues: CollectingAndSendingDataType = {
  __typename: 'PlanDataExchangeApproach',
  id: '',
  dataToCollectFromParticipants: [],
  dataToCollectFromParticipantsReportsDetails: '',
  dataToCollectFromParticipantsOther: '',
  dataWillNotBeCollectedFromParticipants: null,
  dataToCollectFromParticipantsNote: '',
  dataToSendToParticipants: [],
  dataToSendToParticipantsNote: ''
};

const CollectingAndSendingData = () => {
  const { t: dataExchangeApproachT } = useTranslation('dataExchangeApproach');
  const { t: dataExchangeApproachMiscT } = useTranslation(
    'dataExchangeApproachMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataToCollectFromParticipants: dataToCollectFromParticipantsConfig,
    dataWillNotBeCollectedFromParticipants:
      dataWillNotBeCollectedFromParticipantsConfig,
    dataToSendToParticipants: dataToSendToParticipantsConfig
  } = usePlanTranslation('dataExchangeApproach');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { data, loading, error } = useGetCollectingAndSendingDataQuery({
    variables: { id: modelID }
  });

  const formData = mapDefaultFormValues<CollectingAndSendingDataType>(
    data?.modelPlan?.dataExchangeApproach,
    defaulFormValues
  );

  const { __typename, id, ...defaultValues } = formData;

  const methods = useForm<CollectingAndSendingDataType>({
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

  const { mutationError } = useHandleMutation<CollectingAndSendingDataType>(
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
      mapDefaultFormValues<CollectingAndSendingDataType>(
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
        header={dataExchangeApproachMiscT('collectingAndSendingData.heading')}
        currentPage={2}
        totalPages={4}
      />

      <FormProvider {...methods}>
        <Form
          id="collect-and-send-data-form"
          onSubmit={handleSubmit(() => {
            history.push(
              `/models/${modelID}/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation`
            );
          })}
          className="maxw-none"
        >
          <Fieldset disabled={loading}>
            <ConfirmLeaveRHF />

            <Grid row gap>
              <Grid desktop={{ col: 6 }}>
                <Controller
                  name="dataToCollectFromParticipants"
                  control={control}
                  render={({ field }) => (
                    <FormGroup error={!!error}>
                      <Label htmlFor="dataToCollectFromParticipants">
                        {dataToCollectFromParticipantsConfig.label}
                      </Label>

                      <HelpText className="margin-top-1">
                        {dataToCollectFromParticipantsConfig.sublabel}
                      </HelpText>

                      <MultiSelect
                        {...field}
                        id={dataToCollectFromParticipantsConfig.gqlField}
                        ariaLabel={dataToCollectFromParticipantsConfig.label}
                        options={composeMultiSelectOptions(
                          dataToCollectFromParticipantsConfig.options,
                          dataToCollectFromParticipantsConfig.readonlyOptions
                        )}
                        selectedLabel={
                          dataToCollectFromParticipantsConfig.multiSelectLabel ||
                          ''
                        }
                        initialValues={watch('dataToCollectFromParticipants')}
                        disabled={
                          !!watch('dataWillNotBeCollectedFromParticipants')
                        }
                      >
                        <Controller
                          name="dataWillNotBeCollectedFromParticipants"
                          control={control}
                          render={({ field: field2 }) => (
                            <FormGroup className="margin-bottom-3">
                              <CheckboxField
                                {...field2}
                                id={field2.name}
                                checked={field2.value === true}
                                value="true"
                                onChange={e => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    setValue(
                                      'dataToCollectFromParticipants',
                                      []
                                    );
                                  }
                                  field2.onChange(isChecked);
                                }}
                                label={
                                  dataWillNotBeCollectedFromParticipantsConfig.label
                                }
                              />
                            </FormGroup>
                          )}
                        />
                      </MultiSelect>
                    </FormGroup>
                  )}
                />

                {(watch('dataToCollectFromParticipants').includes(
                  DataToCollectFromParticipants.REPORTS_FROM_PARTICIPANTS
                ) ||
                  watch('dataToCollectFromParticipants').includes(
                    DataToCollectFromParticipants.OTHER
                  )) && (
                  <>
                    <p className="text-bold margin-y-3">
                      {dataExchangeApproachMiscT(
                        'collectingAndSendingData.dataSpecific'
                      )}
                    </p>

                    {watch('dataToCollectFromParticipants').includes(
                      DataToCollectFromParticipants.REPORTS_FROM_PARTICIPANTS
                    ) && (
                      <Controller
                        name="dataToCollectFromParticipantsReportsDetails"
                        control={control}
                        render={({ field }) => (
                          <FormGroup className="margin-bottom-3">
                            <Label
                              htmlFor="dataToCollectFromParticipantsReportsDetails"
                              className="text-normal"
                            >
                              {dataExchangeApproachT(
                                'dataToCollectFromParticipantsReportsDetails.label'
                              )}
                            </Label>

                            <TextInput
                              {...field}
                              id={field.name}
                              type="text"
                              value={field.value || ''}
                            />
                          </FormGroup>
                        )}
                      />
                    )}

                    {watch('dataToCollectFromParticipants').includes(
                      DataToCollectFromParticipants.OTHER
                    ) && (
                      <Controller
                        name="dataToCollectFromParticipantsOther"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label
                              htmlFor="dataToCollectFromParticipantsOther"
                              className="text-normal"
                            >
                              {dataExchangeApproachT(
                                'dataToCollectFromParticipantsOther.label'
                              )}
                            </Label>

                            <TextInput
                              {...field}
                              id={field.name}
                              type="text"
                              value={field.value || ''}
                            />
                          </FormGroup>
                        )}
                      />
                    )}
                  </>
                )}

                <AddNoteRHF
                  field="dataToCollectFromParticipantsNote"
                  control={control}
                  touched={!!touchedFields?.dataToCollectFromParticipantsNote}
                />

                <FormGroup>
                  <Label htmlFor="dataToSendToParticipants">
                    {dataToSendToParticipantsConfig.label}
                  </Label>

                  {getKeys(dataToSendToParticipantsConfig.options).map(
                    value => (
                      <Controller
                        key={value}
                        name="dataToSendToParticipants"
                        control={control}
                        render={({ field }) => (
                          <CheckboxField
                            id={`checkbox-${value}`}
                            name={field.name}
                            value={value}
                            checked={field.value.includes(value)}
                            onBlur={field.onBlur}
                            onChange={e => {
                              onChangeCheckboxHandler<DataToSendToParticipants>(
                                e.target.value as DataToSendToParticipants,
                                field,
                                e.target.value ===
                                  DataToSendToParticipants.DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS
                              );
                            }}
                            label={
                              dataToSendToParticipantsConfig.options[value]
                            }
                            disabled={
                              watch('dataToSendToParticipants').includes(
                                DataToSendToParticipants.DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS
                              ) &&
                              value !== 'DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS'
                            }
                          />
                        )}
                      />
                    )
                  )}
                </FormGroup>

                <AddNoteRHF
                  field="dataToSendToParticipantsNote"
                  control={control}
                  touched={!!touchedFields?.dataToSendToParticipantsNote}
                />

                <SubmittionFooter
                  homeArea={miscellaneousT('saveAndReturnToCollaborationArea')}
                  homeRoute={`/models/${modelID}/collaboration-area`}
                  backPage={`/models/${modelID}/collaboration-area/data-exchange-approach/about-completing-data-exchange`}
                  nextPage
                />
              </Grid>
            </Grid>
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={2} totalPages={4} className="margin-y-6" />
    </>
  );
};

export default CollectingAndSendingData;
