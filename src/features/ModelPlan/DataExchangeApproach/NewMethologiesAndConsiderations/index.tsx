import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Label,
  Radio,
  Textarea
} from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  GetNewMethodologiesAndConsiderationsQuery,
  TypedUpdateDataExchangeApproachDocument,
  useGetNewMethodologiesAndConsiderationsQuery
} from 'gql/generated/graphql';

import AddNoteRHF from 'components/AddNote/AddNoteRHF';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import ExternalLink from 'components/ExternalLink';
import FormHeader from 'components/FormHeader';
import HelpText from 'components/HelpText';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToHyphenated } from 'utils/modelPlan';
import { tArray } from 'utils/translation';

import FormFooter from '../../../../components/FormFooter';

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

  const examplesInclude = tArray<Record<string, string>>(
    'dataExchangeApproachMisc:newMethodologiesAndConsiderations.additionalDetails.examples'
  );

  const {
    willImplementNewDataExchangeMethods:
      willImplementNewDataExchangeMethodsConfig,
    isDataExchangeApproachComplete: isDataExchangeApproachCompleteConfig
  } = usePlanTranslation('dataExchangeApproach');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();

  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

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

  const AdditionalDetails = () => (
    <div className="bg-base-lightest padding-2 padding-right-0 margin-top-3">
      <h4 className="margin-top-0 margin-bottom-1">
        {dataExchangeApproachMiscT(
          'newMethodologiesAndConsiderations.additionalDetails.heading'
        )}
      </h4>

      <p className="margin-0">
        {dataExchangeApproachMiscT(
          'newMethodologiesAndConsiderations.additionalDetails.examplesInclude'
        )}
      </p>

      <ul className="margin-1 padding-x-3 padding-right-0">
        {examplesInclude.map((example, index) => (
          <li key={example.text} className="padding-bottom-05">
            <Trans
              i18nKey={`dataExchangeApproachMisc:newMethodologiesAndConsiderations.additionalDetails.examples.${index}.text`}
              components={{
                link1: (
                  <ExternalLink href={example.link} inlineText>
                    {' '}
                  </ExternalLink>
                )
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <FormHeader
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
                  render={({ field: { ref, ...field } }) => (
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
                          render={({ field: { ref: ref2, ...field2 } }) => (
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

                {isMobile && <AdditionalDetails />}

                <Controller
                  name="additionalDataExchangeConsiderationsDescription"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
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
                  render={({ field: { ref, ...field } }) => (
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
                            isDataExchangeApproachCompleteConfig.sublabel || ''
                          }
                        />
                      </FormGroup>
                    </FormGroup>
                  )}
                />

                <FormFooter
                  homeArea={miscellaneousT('saveAndReturnToCollaborationArea')}
                  homeRoute={`/models/${modelID}/collaboration-area`}
                  backPage={`/models/${modelID}/collaboration-area/data-exchange-approach/multi-payer-data-multi-source-collection-aggregation`}
                  nextPage={false}
                  disabled={isSubmitting}
                />
              </Grid>

              {!isMobile && (
                <Grid desktop={{ col: 6 }}>
                  <AdditionalDetails />
                </Grid>
              )}
            </Grid>
          </Fieldset>
        </Form>
      </FormProvider>

      <PageNumber currentPage={4} totalPages={4} className="margin-y-6" />
    </>
  );
};

export default NewMethodologiesAndConsiderations;
