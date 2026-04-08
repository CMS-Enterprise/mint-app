import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
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
  GetGlobalMtoCommonSolutionsQuery,
  MtoCommonSolutionKey,
  MtoFacilitator,
  useGetGlobalMtoCommonSolutionsQuery
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import PageLoading from 'components/PageLoading';
import TextAreaField from 'components/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import dirtyInput, { symmetricDifference } from 'utils/formUtil';
import {
  composeMultiSelectOptions,
  convertCamelCaseToKebabCase,
  sortedSelectOptions
} from 'utils/modelPlan';

import {
  CommonMilestoneModalModeType,
  CommonMilestoneType
} from '../CommonMilestoneSidePanel';

export type CommonSolution =
  GetGlobalMtoCommonSolutionsQuery['mtoCommonSolutions'][0];

type CommonMilestoneFormValues = {
  name: string;
  description: string;
  categoryName: string;
  subCategoryName: string;
  facilitatedByRole: MtoFacilitator[];
  facilitatedByOther?: string;
  commonSolutions: MtoCommonSolutionKey[];
};

type CommonMilestoneFormProps = {
  mode: CommonMilestoneModalModeType;
  closeModal: () => void;
  commonMilestone?: CommonMilestoneType;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty: (isDirty: boolean) => void; // Set dirty state of form so parent can render modal for leaving with unsaved changes
};

const CommonMilestoneForm = ({
  mode,
  closeModal,
  setDisableButton,
  commonMilestone = {
    name: '',
    description: '',
    categoryName: '',
    subCategoryName: '',
    facilitatedByRole: [],
    facilitatedByOther: '',
    commonSolutions: []
  },
  setIsDirty
}: CommonMilestoneFormProps) => {
  const { t: mtoCommonMilestoneT } = useTranslation('mtoCommonMilestone');
  const { t: mtoCommonMilestoneMiscT } = useTranslation(
    'mtoCommonMilestoneMisc'
  );

  const {
    facilitatedByRole: facilitatedByRoleConfig,
    commonSolutions: commonSolutionsConfig
  } = usePlanTranslation('mtoCommonMilestone');

  const [unsavedChanges, setUnsavedChanges] = useState<number>(0);

  const isAddMode = mode === 'addCommonMilestone';
  const isEditMode = mode === 'editCommonMilestone';

  const {
    data: allCommonSolutionsData,
    loading: allCommonSolutionsLoading,
    error: allCommonSolutionsError
  } = useGetGlobalMtoCommonSolutionsQuery();

  const groupedOptions = useMemo(
    () => [
      {
        options: sortedSelectOptions(
          (allCommonSolutionsData?.mtoCommonSolutions || []).map(solution => {
            return {
              label: solution.name || '',
              value: solution.key
            };
          })
        )
      }
    ],
    [allCommonSolutionsData]
  );

  // Set default values for form
  const formValues = useMemo(
    () => ({
      name: commonMilestone?.name || '',
      description: commonMilestone?.description || '',
      categoryName: commonMilestone?.categoryName || 'default',
      subCategoryName: commonMilestone?.subCategoryName || 'default',
      facilitatedByRole: commonMilestone?.facilitatedByRole || [],
      facilitatedByOther: commonMilestone?.facilitatedByOther || '',
      commonSolutions:
        commonMilestone?.commonSolutions?.map(solution => solution.key) || []
    }),
    [commonMilestone]
  );

  const methods = useForm<CommonMilestoneFormValues>({
    defaultValues: formValues,
    values: formValues,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, dirtyFields }
  } = methods;

  const values = watch();

  useEffect(() => {
    const { facilitatedByRole, commonSolutions, ...rest } = dirtyFields;

    let facilitatedByChangeCount: number = 0;
    if (facilitatedByRole) {
      facilitatedByChangeCount = symmetricDifference(
        values.facilitatedByRole || [],
        formValues.facilitatedByRole
      ).length;
    }

    let solutionsChangeCount: number = 0;
    if (commonSolutions) {
      solutionsChangeCount = symmetricDifference(
        values.commonSolutions || [],
        formValues.commonSolutions
      ).length;
    }

    const totalChanges =
      facilitatedByChangeCount +
      solutionsChangeCount +
      Object.keys(rest).length;

    setUnsavedChanges(totalChanges);
  }, [
    dirtyFields,
    formValues,
    values.facilitatedByRole,
    values.commonSolutions
  ]);

  // Sets dirty state based on changes in form to render the leave confirmation modal
  useEffect(() => {
    if (isSubmitting || unsavedChanges) {
      setIsDirty(true);
      setDisableButton(false);
    } else {
      setIsDirty(false);
      setDisableButton(true);
    }
  }, [isSubmitting, unsavedChanges, setIsDirty, setDisableButton]);

  const onSubmit = useCallback<SubmitHandler<CommonMilestoneFormValues>>(
    formData => {
      const { formChanges } = dirtyInput(formValues, formData);

      if (!formChanges.facilitatedByRole?.includes(MtoFacilitator.OTHER)) {
        formChanges.facilitatedByOther = null;
      }

      closeModal();
    },
    [closeModal, formValues]
  );

  if ((isEditMode && !commonMilestone) || allCommonSolutionsError) {
    return <NotFound errorMessage={allCommonSolutionsError?.message} />;
  }

  if (isAddMode && allCommonSolutionsLoading) {
    return <PageLoading />;
  }

  return (
    <div className="margin-top-8">
      <div className="padding-x-8 padding-y-6 maxw-tablet">
        <FormProvider {...methods}>
          <Form
            className="maxw-none"
            id="common-milestone-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <ConfirmLeaveRHF />

            <h2 className="margin-y-0 line-height-serif-2">
              {isAddMode && mtoCommonMilestoneMiscT(`${mode}.heading`)}
              {commonMilestone?.name}
            </h2>

            <p className="margin-top-1 margin-bottom-4 text-base-dark line-height-sans-5">
              <Trans
                i18nKey={mtoCommonMilestoneMiscT('allFieldsRequired')}
                components={{
                  s: <span className="text-secondary-dark" />
                }}
              />
            </p>

            <Fieldset className="margin-bottom-8">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value => value !== ''
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-bottom-3" error={!!error}>
                    <Label
                      requiredMarker
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                    >
                      {mtoCommonMilestoneT('name.label')}
                    </Label>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <TextInput
                      {...field}
                      ref={null}
                      id={convertCamelCaseToKebabCase(field.name)}
                      type="text"
                    />
                  </FormGroup>
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value => value !== ''
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
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                      className="maxw-none text-bold"
                      requiredMarker
                    >
                      {mtoCommonMilestoneT('description.label')}
                    </Label>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <TextAreaField
                      {...field}
                      value={field.value || ''}
                      className="height-card"
                      id={convertCamelCaseToKebabCase(field.name)}
                    />
                  </FormGroup>
                )}
              />

              <Controller
                name="categoryName"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value =>
                    value !== 'default' ||
                    mtoCommonMilestoneMiscT('validation.fillOut')
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
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                      className="maxw-none text-bold"
                      requiredMarker
                    >
                      {mtoCommonMilestoneT('categoryName.label')}
                    </Label>

                    <HelpText className="margin-top-05">
                      {mtoCommonMilestoneT('categoryName.sublabel')}
                    </HelpText>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <Select
                      {...field}
                      id={convertCamelCaseToKebabCase(field.name)}
                      value={field.value || 'default'}
                      defaultValue="default"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        field.onChange(e);
                        // Reset subcategory when category changes
                        setValue('subCategoryName', 'default');
                      }}
                    >
                      {[].map((option: { value: string; label: string }) => {
                        return (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </Select>
                  </FormGroup>
                )}
              />

              <Controller
                name="subCategoryName"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value =>
                    value !== 'default' ||
                    mtoCommonMilestoneMiscT('validation.fillOut')
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
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                      className="maxw-none text-bold"
                      requiredMarker
                    >
                      {mtoCommonMilestoneT('subCategoryName.label')}
                    </Label>

                    <HelpText className="margin-top-05">
                      {mtoCommonMilestoneT('subCategoryName.sublabel')}
                    </HelpText>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <Select
                      {...field}
                      id={convertCamelCaseToKebabCase(field.name)}
                      value={field.value || 'default'}
                      defaultValue="default"
                      disabled={watch('categoryName') === 'default'}
                    >
                      {[].map((option: { value: string; label: string }) => {
                        return (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </Select>
                  </FormGroup>
                )}
              />

              <Controller
                name="facilitatedByRole"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value => value.length > 0
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-0 margin-bottom-3">
                    <Label
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                      requiredMarker
                    >
                      {facilitatedByRoleConfig.label}
                    </Label>

                    <HelpText className="margin-top-1">
                      {facilitatedByRoleConfig.sublabel}
                    </HelpText>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <MultiSelect
                      {...field}
                      id={convertCamelCaseToKebabCase(field.name)}
                      inputId={convertCamelCaseToKebabCase(field.name)}
                      ariaLabel={facilitatedByRoleConfig.label}
                      ariaLabelText={facilitatedByRoleConfig.label}
                      options={composeMultiSelectOptions(
                        facilitatedByRoleConfig.options
                      )}
                      selectedLabel={
                        facilitatedByRoleConfig.multiSelectLabel || ''
                      }
                      initialValues={watch('facilitatedByRole')}
                    />
                  </FormGroup>
                )}
              />

              {watch('facilitatedByRole')?.includes(MtoFacilitator.OTHER) && (
                <Controller
                  name="facilitatedByOther"
                  control={control}
                  rules={{
                    required: mtoCommonMilestoneMiscT('validation.fillOut')
                  }}
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <FormGroup
                      className="margin-0 margin-bottom-3"
                      error={!!error}
                    >
                      <Label
                        htmlFor={convertCamelCaseToKebabCase(field.name)}
                        requiredMarker
                        className="text-normal"
                      >
                        {mtoCommonMilestoneT('facilitatedByOther.label')}
                      </Label>

                      {!!error && (
                        <FieldErrorMsg>{error.message}</FieldErrorMsg>
                      )}

                      <HelpText className="margin-top-1">
                        {mtoCommonMilestoneT('facilitatedByOther.sublabel')}
                      </HelpText>

                      <TextInput
                        {...field}
                        ref={null}
                        id={convertCamelCaseToKebabCase(field.name)}
                        type="text"
                        maxLength={75}
                      />

                      <HelpText className="margin-top-1">
                        {mtoCommonMilestoneMiscT('charactersAllowed')}
                      </HelpText>
                    </FormGroup>
                  )}
                />
              )}

              <Controller
                name="commonSolutions"
                control={control}
                rules={{
                  required: mtoCommonMilestoneMiscT('validation.fillOut'),
                  validate: value => value.length > 0
                }}
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    className="margin-0 margin-bottom-7"
                    error={!!error}
                  >
                    <Label
                      htmlFor={convertCamelCaseToKebabCase(field.name)}
                      requiredMarker
                    >
                      {commonSolutionsConfig.label}
                    </Label>

                    <HelpText className="margin-top-1">
                      {commonSolutionsConfig.sublabel}
                    </HelpText>

                    {!!error && <FieldErrorMsg>{error.message}</FieldErrorMsg>}

                    <MultiSelect
                      {...field}
                      id={convertCamelCaseToKebabCase(field.name)}
                      inputId={convertCamelCaseToKebabCase(field.name)}
                      name={field.name}
                      ariaLabel={commonSolutionsConfig.label}
                      ariaLabelText={commonSolutionsConfig.label}
                      options={[]}
                      groupedOptions={groupedOptions}
                      selectedLabel={
                        commonSolutionsConfig.multiSelectLabel || ''
                      }
                      initialValues={watch('commonSolutions')}
                    />
                  </FormGroup>
                )}
              />
            </Fieldset>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CommonMilestoneForm;
