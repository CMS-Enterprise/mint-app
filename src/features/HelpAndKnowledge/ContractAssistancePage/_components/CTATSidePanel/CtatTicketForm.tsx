import React, { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  CtatcmmiDivisionOption,
  CtatcmmiGroupOption,
  CtatContractActivityType,
  CtatContractType,
  CtatHelpNeededType,
  CtatRequestInput,
  CtatRequestUrgency,
  ModelPlanFilter,
  useCreateCtatRequestMutation,
  useGetModelPlansBaseQuery,
  useGetUserInfoQuery
} from 'gql/generated/graphql';
import GetCtatRequestsRequester from 'gql/operations/CTAT/GetCtatRequestsRequester';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import DatePickerFormatted from 'components/DatePickerFormatted';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import TextAreaField from 'components/TextAreaField';
import toastSuccess from 'components/ToastSuccess';
import { getStatusAlertBody } from 'contexts/ErrorContext';
import { setCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';
import {
  cmmiDivisions,
  cmmiGroups,
  contractActivityTypes,
  contractTypes,
  divisionOptionsByGroup,
  helpNeededGroupLabels,
  helpNeededTypes,
  helpNeededTypesOther,
  helpNeededTypesPostAward,
  helpNeededTypesPreAward,
  requestUrgencies
} from 'i18n/en-US/ctatRequest';

import SupportingDocumentsUpload from './SupportingDocumentsUpload';

const SELECT_DEFAULT = 'default';

export type CtatTicketFormValues = {
  cmmiGroup: string;
  cmmiGroupOther: string;
  cmmiDivision: string;
  cmmiDivisionOther: string;
  relatedMINTModels: string[];
  contractActivityType: string;
  contractActivityTypeOther: string;
  contractName: string;
  contractNumber: string;
  contractType: string;
  contractTypeOther: string;
  typeOfHelpNeeded: CtatHelpNeededType[];
  typeOfHelpNeededOther: string;
  describeHelpNeeded: string;
  requestUrgency: string;
  dateAssistanceNeededBy: string;
  supportingDocuments: File[];
};

type CtatTicketFormProps = {
  closeModal: () => void;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty: (isDirty: boolean) => void;
  onSubmitted: () => void;
};

const defaultFormValues: CtatTicketFormValues = {
  cmmiGroup: SELECT_DEFAULT,
  cmmiGroupOther: '',
  cmmiDivision: SELECT_DEFAULT,
  cmmiDivisionOther: '',
  relatedMINTModels: [],
  contractActivityType: SELECT_DEFAULT,
  contractActivityTypeOther: '',
  contractName: '',
  contractNumber: '',
  contractType: SELECT_DEFAULT,
  contractTypeOther: '',
  typeOfHelpNeeded: [],
  typeOfHelpNeededOther: '',
  describeHelpNeeded: '',
  requestUrgency: SELECT_DEFAULT,
  dateAssistanceNeededBy: '',
  supportingDocuments: []
};

const CtatTicketForm = ({
  closeModal,
  setDisableButton,
  setIsDirty,
  onSubmitted
}: CtatTicketFormProps) => {
  const { t } = useTranslation('contractAssistance');
  const { euaId } = useSelector((state: AppState) => state.auth);

  const [createCTATRequest] = useCreateCtatRequestMutation({
    refetchQueries: [{ query: GetCtatRequestsRequester }]
  });

  const { data: userData, loading: userLoading } = useGetUserInfoQuery({
    variables: { username: euaId },
    skip: !euaId
  });

  const { data: modelPlansData, loading: modelPlansLoading } =
    useGetModelPlansBaseQuery({
      variables: { filter: ModelPlanFilter.INCLUDE_ALL }
    });

  const methods = useForm<CtatTicketFormValues>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, isValid }
  } = methods;

  const selectedCmmiGroup = watch('cmmiGroup');
  const isCmmiDivisionRequired =
    selectedCmmiGroup !== SELECT_DEFAULT &&
    selectedCmmiGroup !== CtatcmmiGroupOption.OTHER;

  const defaultSelectOption = {
    value: SELECT_DEFAULT,
    label: t('ctatSidePanel.fields.cmmiGroup.selectDefault')
  };

  const cmmiGroupOptions = useMemo(
    () =>
      Object.entries(cmmiGroups).map(([value, label]) => ({ value, label })),
    []
  );

  const cmmiDivisionOptions = useMemo(() => {
    if (!isCmmiDivisionRequired) {
      return [];
    }

    const divisions =
      divisionOptionsByGroup[
        selectedCmmiGroup as keyof typeof divisionOptionsByGroup
      ] || [];

    return [
      ...divisions.map(division => ({
        value: division,
        label: cmmiDivisions[division]
      })),
      {
        value: CtatcmmiDivisionOption.OTHER,
        label: cmmiDivisions[CtatcmmiDivisionOption.OTHER]
      }
    ];
  }, [isCmmiDivisionRequired, selectedCmmiGroup]);

  const contractActivityTypeOptions = useMemo(
    () =>
      Object.entries(contractActivityTypes).map(([value, label]) => ({
        value,
        label
      })),
    []
  );

  const contractTypeOptions = useMemo(
    () =>
      Object.entries(contractTypes).map(([value, label]) => ({
        value,
        label
      })),
    []
  );

  const requestUrgencyOptions = useMemo(
    () =>
      Object.entries(requestUrgencies).map(([value, label]) => ({
        value,
        label
      })),
    []
  );

  const modelPlanOptions = useMemo(
    () =>
      (modelPlansData?.modelPlanCollection || []).map(model => ({
        value: model.id,
        label: model.modelName
      })),
    [modelPlansData]
  );

  const groupedHelpNeededOptions = useMemo(
    () => [
      {
        label: helpNeededGroupLabels.preAward,
        options: helpNeededTypesPreAward.map(key => ({
          value: key,
          label: helpNeededTypes[key]
        }))
      },
      {
        label: helpNeededGroupLabels.postAward,
        options: helpNeededTypesPostAward.map(key => ({
          value: key,
          label: helpNeededTypes[key]
        }))
      },
      {
        label: helpNeededGroupLabels.other,
        options: helpNeededTypesOther.map(key => ({
          value: key,
          label: helpNeededTypes[key]
        }))
      }
    ],
    []
  );

  const requesterDisplayName = useMemo(() => {
    const account = userData?.userAccount;
    if (!account) return '';

    const name =
      account.commonName ||
      [account.givenName, account.familyName].filter(Boolean).join(' ');

    if (account.email) {
      return `${name} (${account.email})`;
    }

    return name;
  }, [userData]);

  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    setDisableButton(!isValid || isSubmitting);
  }, [isValid, isSubmitting, setDisableButton]);

  const buildMutationInput = (
    formData: CtatTicketFormValues
  ): CtatRequestInput => ({
    cmmiGroup: formData.cmmiGroup as CtatcmmiGroupOption,
    cmmiGroupOther:
      formData.cmmiGroup === CtatcmmiGroupOption.OTHER
        ? formData.cmmiGroupOther
        : null,
    cmmiDivision:
      formData.cmmiDivision !== SELECT_DEFAULT
        ? (formData.cmmiDivision as CtatcmmiDivisionOption)
        : null,
    cmmiDivisionOther:
      formData.cmmiDivision === CtatcmmiDivisionOption.OTHER
        ? formData.cmmiDivisionOther
        : null,
    relatedMINTModels: formData.relatedMINTModels.length
      ? formData.relatedMINTModels
      : null,
    contractActivityType:
      formData.contractActivityType !== SELECT_DEFAULT
        ? (formData.contractActivityType as CtatContractActivityType)
        : null,
    contractActivityTypeOther:
      formData.contractActivityType === CtatContractActivityType.OTHER
        ? formData.contractActivityTypeOther
        : null,
    contractName: formData.contractName || null,
    contractNumber: formData.contractNumber || null,
    contractType:
      formData.contractType !== SELECT_DEFAULT
        ? (formData.contractType as CtatContractType)
        : null,
    contractTypeOther:
      formData.contractType === CtatContractType.OTHER
        ? formData.contractTypeOther
        : null,
    typeOfHelpNeeded: formData.typeOfHelpNeeded,
    typeOfHelpNeededOther: formData.typeOfHelpNeeded.includes(
      CtatHelpNeededType.OTHER
    )
      ? formData.typeOfHelpNeededOther
      : null,
    describeHelpNeeded: formData.describeHelpNeeded,
    requestUrgency: formData.requestUrgency as CtatRequestUrgency,
    dateAssistanceNeededBy: formData.dateAssistanceNeededBy,
    supportingDocuments: formData.supportingDocuments.map(file => ({
      fileData: file
    }))
  });

  const onSubmit = (formData: CtatTicketFormValues) => {
    setCurrentErrorMeta({
      overrideMessage: getStatusAlertBody({
        type: 'error',
        message: t('ctatSidePanel.error')
      })
    });

    createCTATRequest({
      variables: {
        input: buildMutationInput(formData)
      }
    }).then(response => {
      if (!response.errors) {
        toastSuccess(
          <Trans
            i18nKey={t('ctatSidePanel.success')}
            values={{
              ticketId: response.data?.createCTATRequest.humanReadableID
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );
        onSubmitted();
        closeModal();
      }
    });
  };

  if (userLoading || modelPlansLoading) {
    return <PageLoading />;
  }

  if (!userData?.userAccount) {
    return <NotFound />;
  }

  return (
    <div className="margin-top-8 padding-8 maxw-tablet">
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-3">
        {t('ctatSidePanel.newTicketHeading')}
      </PageHeading>
      <p className="text-base margin-top-0 margin-bottom-3">
        <Trans
          i18nKey={t('ctatSidePanel.allFieldsRequired')}
          components={{
            s: <span className="text-secondary-dark" />
          }}
        />
      </p>
      <FormProvider {...methods}>
        <ConfirmLeaveRHF />
        <Form
          id="ctat-ticket-form"
          className="maxw-none padding-bottom-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Fieldset disabled={isSubmitting}>
            <FormGroup className="margin-top-0 margin-bottom-3">
              <Label
                htmlFor="ctat-requester"
                className="maxw-none text-bold"
                requiredMarker
              >
                {t('ctatSidePanel.fields.requester.label')}
              </Label>
              <HelpText className="margin-top-05">
                {t('ctatSidePanel.fields.requester.hint')}
              </HelpText>
              <TextInput
                id="ctat-requester"
                name="requester"
                type="text"
                value={requesterDisplayName}
                disabled
              />
            </FormGroup>

            <Controller
              name="cmmiGroup"
              control={control}
              rules={{
                required: t('ctatSidePanel.validation.fillOut'),
                validate: value =>
                  value !== SELECT_DEFAULT ||
                  t('ctatSidePanel.validation.fillOut')
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="cmmi-group"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.cmmiGroup.label')}
                  </Label>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <Select
                    {...field}
                    inputRef={ref}
                    id="cmmi-group"
                    value={field.value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      field.onChange(e);
                      setValue('cmmiDivision', SELECT_DEFAULT, {
                        shouldValidate: true
                      });
                      setValue('cmmiDivisionOther', '');
                      setValue('cmmiGroupOther', '');
                    }}
                  >
                    {[defaultSelectOption, ...cmmiGroupOptions].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            />

            {selectedCmmiGroup === CtatcmmiGroupOption.OTHER && (
              <Controller
                name="cmmiGroupOther"
                control={control}
                rules={{
                  required: t('ctatSidePanel.validation.fillOut')
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-top-0 margin-bottom-3"
                  >
                    <Label
                      htmlFor="cmmi-group-other"
                      className="maxw-none text-bold"
                    >
                      {t('ctatSidePanel.fields.cmmiGroup.otherLabel')}
                    </Label>
                    <HelpText className="margin-top-05">
                      {t('ctatSidePanel.fields.cmmiGroup.otherHint')}
                    </HelpText>
                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      inputRef={ref}
                      id="cmmi-group-other"
                      type="text"
                      value={field.value || ''}
                    />
                  </FormGroup>
                )}
              />
            )}

            <Controller
              name="cmmiDivision"
              control={control}
              rules={{
                validate: value =>
                  !isCmmiDivisionRequired ||
                  value !== SELECT_DEFAULT ||
                  t('ctatSidePanel.validation.fillOut')
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="cmmi-division"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.cmmiDivision.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {t('ctatSidePanel.fields.cmmiDivision.hint')}
                  </HelpText>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <Select
                    {...field}
                    inputRef={ref}
                    id="cmmi-division"
                    value={field.value}
                    disabled={!isCmmiDivisionRequired}
                  >
                    {[defaultSelectOption, ...cmmiDivisionOptions].map(
                      option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </Select>
                </FormGroup>
              )}
            />

            {watch('cmmiDivision') === CtatcmmiDivisionOption.OTHER && (
              <Controller
                name="cmmiDivisionOther"
                control={control}
                rules={{
                  required: t('ctatSidePanel.validation.fillOut')
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-top-0 margin-bottom-3"
                  >
                    <Label
                      htmlFor="cmmi-division-other"
                      className="maxw-none text-bold"
                    >
                      {t('ctatSidePanel.fields.cmmiDivision.otherLabel')}
                    </Label>
                    <HelpText className="margin-top-05">
                      {t('ctatSidePanel.fields.cmmiDivision.otherHint')}
                    </HelpText>
                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      inputRef={ref}
                      id="cmmi-division-other"
                      type="text"
                      value={field.value || ''}
                    />
                  </FormGroup>
                )}
              />
            )}

            <Controller
              name="relatedMINTModels"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="related-mint-models"
                    className="maxw-none text-bold"
                  >
                    {t('ctatSidePanel.fields.modelOrDemonstration.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {t('ctatSidePanel.fields.modelOrDemonstration.hint')}
                  </HelpText>
                  <MultiSelect
                    {...field}
                    inputRef={ref}
                    id="related-mint-models"
                    inputId="related-mint-models"
                    ariaLabel={t(
                      'ctatSidePanel.fields.modelOrDemonstration.label'
                    )}
                    ariaLabelText={t(
                      'ctatSidePanel.fields.modelOrDemonstration.label'
                    )}
                    options={modelPlanOptions}
                    selectedLabel={t(
                      'ctatSidePanel.fields.modelOrDemonstration.label'
                    )}
                    initialValues={watch('relatedMINTModels')}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="contractActivityType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="contract-activity-type"
                    className="maxw-none text-bold"
                  >
                    {t('ctatSidePanel.fields.contractActivityType.label')}
                  </Label>
                  <Select
                    {...field}
                    inputRef={ref}
                    id="contract-activity-type"
                    value={field.value}
                  >
                    {[
                      {
                        value: SELECT_DEFAULT,
                        label: t(
                          'ctatSidePanel.fields.contractActivityType.selectDefault'
                        )
                      },
                      ...contractActivityTypeOptions
                    ].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            />

            {watch('contractActivityType') ===
              CtatContractActivityType.OTHER && (
              <Controller
                name="contractActivityTypeOther"
                control={control}
                rules={{
                  required: t('ctatSidePanel.validation.fillOut')
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-top-0 margin-bottom-3"
                  >
                    <Label
                      htmlFor="contract-activity-type-other"
                      className="maxw-none text-bold"
                    >
                      {t(
                        'ctatSidePanel.fields.contractActivityType.otherLabel'
                      )}
                    </Label>
                    <HelpText className="margin-top-05">
                      {t('ctatSidePanel.fields.contractActivityType.otherHint')}
                    </HelpText>
                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      inputRef={ref}
                      id="contract-activity-type-other"
                      type="text"
                      value={field.value || ''}
                    />
                  </FormGroup>
                )}
              />
            )}

            <Controller
              name="contractName"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="contract-name"
                    className="maxw-none text-bold"
                  >
                    {t('ctatSidePanel.fields.contractName.label')}
                  </Label>
                  <TextInput
                    {...field}
                    inputRef={ref}
                    id="contract-name"
                    type="text"
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="contractNumber"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="contract-number"
                    className="maxw-none text-bold"
                  >
                    {t('ctatSidePanel.fields.contractNumber.label')}
                  </Label>
                  <TextInput
                    {...field}
                    inputRef={ref}
                    id="contract-number"
                    type="text"
                    value={field.value || ''}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="contractType"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="contract-type"
                    className="maxw-none text-bold"
                  >
                    {t('ctatSidePanel.fields.contractType.label')}
                  </Label>
                  <Select
                    {...field}
                    inputRef={ref}
                    id="contract-type"
                    value={field.value}
                  >
                    {[
                      {
                        value: SELECT_DEFAULT,
                        label: t(
                          'ctatSidePanel.fields.contractType.selectDefault'
                        )
                      },
                      ...contractTypeOptions
                    ].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            />

            {watch('contractType') === CtatContractType.OTHER && (
              <Controller
                name="contractTypeOther"
                control={control}
                rules={{
                  required: t('ctatSidePanel.validation.fillOut')
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-top-0 margin-bottom-3"
                  >
                    <Label
                      htmlFor="contract-type-other"
                      className="maxw-none text-bold"
                    >
                      {t('ctatSidePanel.fields.contractType.otherLabel')}
                    </Label>
                    <HelpText className="margin-top-05">
                      {t('ctatSidePanel.fields.contractType.otherHint')}
                    </HelpText>
                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      inputRef={ref}
                      id="contract-type-other"
                      type="text"
                      value={field.value || ''}
                    />
                  </FormGroup>
                )}
              />
            )}

            <Controller
              name="typeOfHelpNeeded"
              control={control}
              rules={{
                required: t('ctatSidePanel.validation.fillOut'),
                validate: value =>
                  value.length > 0 || t('ctatSidePanel.validation.fillOut')
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="type-of-help-needed"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.helpNeededType.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {t('ctatSidePanel.fields.helpNeededType.hint')}
                  </HelpText>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <MultiSelect
                    {...field}
                    inputRef={ref}
                    id="type-of-help-needed"
                    inputId="type-of-help-needed"
                    ariaLabel={t('ctatSidePanel.fields.helpNeededType.label')}
                    ariaLabelText={t(
                      'ctatSidePanel.fields.helpNeededType.label'
                    )}
                    options={[]}
                    groupedOptions={groupedHelpNeededOptions}
                    selectedLabel={t(
                      'ctatSidePanel.fields.helpNeededType.label'
                    )}
                    initialValues={watch('typeOfHelpNeeded')}
                  />
                </FormGroup>
              )}
            />

            {watch('typeOfHelpNeeded').includes(CtatHelpNeededType.OTHER) && (
              <Controller
                name="typeOfHelpNeededOther"
                control={control}
                rules={{
                  required: t('ctatSidePanel.validation.fillOut')
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-top-0 margin-bottom-3"
                  >
                    <Label
                      htmlFor="type-of-help-needed-other"
                      className="maxw-none text-bold"
                      requiredMarker
                    >
                      {t('ctatSidePanel.fields.other.helpNeededType')}
                    </Label>
                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      inputRef={ref}
                      id="type-of-help-needed-other"
                      type="text"
                      value={field.value || ''}
                    />
                  </FormGroup>
                )}
              />
            )}

            <Controller
              name="describeHelpNeeded"
              control={control}
              rules={{
                required: t('ctatSidePanel.validation.fillOut'),
                maxLength: {
                  value: 500,
                  message: t('ctatSidePanel.validation.fillOut')
                }
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="describe-help-needed"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.assistanceDescription.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {t('ctatSidePanel.fields.assistanceDescription.hint')}
                  </HelpText>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <TextAreaField
                    {...field}
                    inputRef={ref}
                    id="describe-help-needed"
                    value={field.value || ''}
                    maxLength={500}
                    className="height-card"
                  />
                  <HelpText className="margin-top-05">
                    {t(
                      'ctatSidePanel.fields.assistanceDescription.charactersAllowed'
                    )}
                  </HelpText>
                </FormGroup>
              )}
            />

            <Controller
              name="requestUrgency"
              control={control}
              rules={{
                required: t('ctatSidePanel.validation.fillOut'),
                validate: value =>
                  value !== SELECT_DEFAULT ||
                  t('ctatSidePanel.validation.fillOut')
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="request-urgency"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.requestUrgency.label')}
                  </Label>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <Select
                    {...field}
                    inputRef={ref}
                    id="request-urgency"
                    value={field.value}
                  >
                    {[
                      {
                        value: SELECT_DEFAULT,
                        label: t(
                          'ctatSidePanel.fields.requestUrgency.selectDefault'
                        )
                      },
                      ...requestUrgencyOptions
                    ].map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}
            />

            <Controller
              name="dateAssistanceNeededBy"
              control={control}
              rules={{
                required: t('ctatSidePanel.validation.fillOut')
              }}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <FormGroup
                  error={!!error}
                  className="margin-top-0 margin-bottom-3"
                >
                  <Label
                    htmlFor="assistance-needed-by"
                    className="maxw-none text-bold"
                    requiredMarker
                  >
                    {t('ctatSidePanel.fields.assistanceNeededBy.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {t('ctatSidePanel.fields.assistanceNeededBy.hint')}
                  </HelpText>
                  {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}
                  <DatePickerFormatted
                    id="assistance-needed-by"
                    name={field.name}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormGroup>
              )}
            />

            <FormGroup className="margin-top-0 margin-bottom-6">
              <Label
                htmlFor="ctat-supporting-documents"
                className="maxw-none text-bold"
              >
                {t('ctatSidePanel.fields.supportingDocuments.label')}
              </Label>
              <HelpText className="margin-top-05">
                {t('ctatSidePanel.fields.supportingDocuments.hint')}
              </HelpText>
              <SupportingDocumentsUpload control={control} />
            </FormGroup>

            <Alert noIcon type="info" validation className="margin-bottom-0">
              <p className="margin-top-0 margin-bottom-1 text-bold">
                {t('ctatSidePanel.whatHappensNext.heading')}
              </p>
              <p className="margin-top-0 margin-bottom-1">
                {t('ctatSidePanel.whatHappensNext.intro')}
              </p>
              <ul className="margin-top-0 margin-bottom-0">
                <li>{t('ctatSidePanel.whatHappensNext.bullet1')}</li>
                <li>{t('ctatSidePanel.whatHappensNext.bullet2')}</li>
                <li>{t('ctatSidePanel.whatHappensNext.bullet3')}</li>
                <li>{t('ctatSidePanel.whatHappensNext.bullet4')}</li>
              </ul>
            </Alert>
          </Fieldset>
        </Form>
      </FormProvider>
    </div>
  );
};

export default CtatTicketForm;
