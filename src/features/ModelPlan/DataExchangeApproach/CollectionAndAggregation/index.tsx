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
  GetCollectionAndAggregationQuery,
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
import { composeMultiSelectOptions } from 'utils/modelPlan';

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

  const { mutationError } = useHandleMutation<CollectionAndAggregationType>(
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
                <SubmittionFooter
                  homeArea={miscellaneousT('saveAndReturnToCollaborationArea')}
                  homeRoute={`/models/${modelID}/collaboration-area`}
                  backPage={`/models/${modelID}/collaboration-area/data-exchange-approach/collecting-and-sending-data`}
                  nextPage
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
