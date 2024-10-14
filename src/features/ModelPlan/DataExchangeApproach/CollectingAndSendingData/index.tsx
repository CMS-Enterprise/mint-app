import React from 'react';
import {
  Controller,
  FormFieldProps,
  FormProvider,
  useForm
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { getKey } from '@okta/okta-auth-js';
import {
  Button,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetCollectingAndSendingDataQuery,
  TypedUpdateDataExchangeApproachDocument,
  useGetCollectingAndSendingDataQuery,
  useUpdateDataExchangeApproachMutation
} from 'gql/generated/graphql';
import { map } from 'lodash';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import { ErrorAlertMessage } from 'components/ErrorAlert';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
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
  const { t } = useTranslation('dataExchangeApproachMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataToCollectFromParticipants: dataToCollectFromParticipantsConfig,
    dataWillNotBeCollectedFromParticipants:
      dataWillNotBeCollectedFromParticipantsConfig
  } = usePlanTranslation('dataExchangeApproach');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const { data, loading, error } = useGetCollectingAndSendingDataQuery({
    variables: { id: modelID }
  });

  const queryData = data?.modelPlan?.dataExchangeApproach
    ? mapDefaultFormValues<CollectingAndSendingDataType>(
        data?.modelPlan?.dataExchangeApproach,
        defaulFormValues
      )
    : defaulFormValues;

  const { __typename, id, ...defaultValues } = queryData;

  const methods = useForm<FormFieldProps<CollectingAndSendingDataType>>({
    defaultValues
  });

  const {
    control,
    watch,
    formState: { isSubmitting, touchedFields }
  } = methods;

  const { mutationError } = useHandleMutation<CollectingAndSendingDataType>(
    TypedUpdateDataExchangeApproachDocument,
    {
      id: modelID,
      initialValues: defaultValues,
      values: watch()
    }
  );

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <h2 className="margin-bottom-2 margin-top-7">
        {t('aboutCompletingDataExchange.heading')}
      </h2>
      <FormProvider {...methods}>
        <Form
          id="collect-and-send-data-form"
          onSubmit={e => {
            e.preventDefault();
            history.push(
              `/models/${modelID}/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation`
            );
          }}
          className="maxw-none"
        >
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
                      id="dataToCollectFromParticipants"
                      name="dataToCollectFromParticipants"
                      ariaLabel=""
                      options={composeMultiSelectOptions(
                        dataToCollectFromParticipantsConfig.options
                      )}
                      selectedLabel={
                        dataToCollectFromParticipantsConfig.multiSelectLabel ||
                        ''
                      }
                      onChange={values => {
                        field.onChange(values);
                      }}
                      initialValues={
                        defaultValues.dataToCollectFromParticipants
                      }
                    />
                  </FormGroup>
                )}
              />

              <Controller
                name="dataWillNotBeCollectedFromParticipants"
                control={control}
                render={({ field }) => (
                  <FormGroup error={!!error}>
                    <CheckboxField
                      {...field}
                      id={field.name}
                      value={field.name}
                      label={dataWillNotBeCollectedFromParticipantsConfig.label}
                    />
                  </FormGroup>
                )}
              />

              <AddNoteRHF
                field="dataWillNotBeCollectedFromParticipants"
                control={control}
                touched={
                  !!touchedFields?.dataWillNotBeCollectedFromParticipants
                }
              />

              <div className="margin-top-6 margin-bottom-3">
                <Button type="submit">{miscellaneousT('next')}</Button>
              </div>

              <Button
                type="button"
                className="usa-button usa-button--unstyled"
                onClick={() =>
                  history.push(`/models/${modelID}/collaboration-area`)
                }
              >
                <Icon.ArrowBack className="margin-right-1" aria-hidden />

                {miscellaneousT('saveAndReturnToCollaborationArea')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormProvider>

      <PageNumber currentPage={2} totalPages={4} className="margin-y-6" />
    </>
  );
};

export default CollectingAndSendingData;
