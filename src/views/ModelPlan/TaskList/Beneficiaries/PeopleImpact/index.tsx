import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetPeopleImpactedQuery,
  SelectionMethodType,
  TypedUpdateModelPlanBeneficiariesDocument,
  useGetPeopleImpactedQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextField from 'components/shared/TextField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

type PeopleImpactedFormType = GetPeopleImpactedQuery['modelPlan']['beneficiaries'];

const PeopleImpact = () => {
  const { t: beneficiariesT } = useTranslation('beneficiaries');

  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    estimateConfidence: estimateConfidenceConfig,
    beneficiarySelectionMethod: beneficiarySelectionMethodConfig
  } = usePlanTranslation('beneficiaries');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<PeopleImpactedFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetPeopleImpactedQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    numberPeopleImpacted,
    estimateConfidence,
    confidenceNote,
    beneficiarySelectionMethod,
    beneficiarySelectionNote,
    beneficiarySelectionOther
  } = (data?.modelPlan?.beneficiaries || {}) as PeopleImpactedFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdateModelPlanBeneficiariesDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: PeopleImpactedFormType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    numberPeopleImpacted: numberPeopleImpacted ?? 0,
    estimateConfidence: estimateConfidence ?? null,
    confidenceNote: confidenceNote ?? '',
    beneficiarySelectionMethod: beneficiarySelectionMethod ?? '',
    beneficiarySelectionNote: beneficiarySelectionNote ?? '',
    beneficiarySelectionOther: beneficiarySelectionOther ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <>
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.BENEFICIARIES
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {beneficiariesMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/task-list/beneficiaries/beneficiary-frequency`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<PeopleImpactedFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            values
          } = formikProps;
          const flatErrors = flattenErrors(errors);

          return (
            <>
              <ConfirmLeave />

              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {Object.keys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={key}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}
              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap className="beneficiaries__info">
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-people-impact-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="expected-people-impacted"
                          error={!!flatErrors.numberPeopleImpacted}
                        >
                          <Label htmlFor="expected-people-impacted">
                            {beneficiariesT('numberPeopleImpacted.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.numberPeopleImpacted}
                          </FieldErrorMsg>

                          <Field
                            as={RangeInput}
                            className="maxw-none width-full"
                            error={flatErrors.numberPeopleImpacted}
                            id="expected-people-impacted"
                            name="numberPeopleImpacted"
                            min={0}
                            max={10000}
                            step={1}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue(
                                'numberPeopleImpacted',
                                Number(e.target.value)
                              );
                            }}
                          />

                          <div className="display-flex mint-header__basic">
                            <span>{beneficiariesMiscT('zero')}</span>

                            <span>{beneficiariesMiscT('tenThousand')}</span>
                          </div>

                          <Label
                            htmlFor="expected-people-impacted"
                            className="text-normal"
                          >
                            {beneficiariesMiscT('numberOfPeopleImpacted')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.numberPeopleImpacted}
                          </FieldErrorMsg>

                          <Field
                            as={TextInput}
                            type="number"
                            className="width-card"
                            error={flatErrors.numberPeopleImpacted}
                            id="expected-people-impacted"
                            data-testid="expected-people-impacted"
                            name="numberPeopleImpacted"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              if (Number.isNaN(e.target.value)) return;
                              setFieldValue(
                                'numberPeopleImpacted',
                                Number(e.target.value)
                              );
                            }}
                          />

                          <Label
                            htmlFor="beneficiaries-impact-estimateConfidence"
                            className="text-normal"
                          >
                            {beneficiariesT('estimateConfidence.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.estimateConfidence}
                          </FieldErrorMsg>

                          <Fieldset>
                            {getKeys(estimateConfidenceConfig.options).map(
                              key => (
                                <Field
                                  as={Radio}
                                  key={key}
                                  id={`beneficiaries-impact-confidence-${key}`}
                                  name="estimateConfidence"
                                  label={estimateConfidenceConfig.options[key]}
                                  value={key}
                                  checked={values.estimateConfidence === key}
                                />
                              )
                            )}
                          </Fieldset>

                          <AddNote
                            id="beneficiaries-impact-confidence-note"
                            field="confidenceNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="beneficiaries-chooseBeneficiaries"
                          error={!!flatErrors.beneficiarySelectionMethod}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="beneficiaries-chooseBeneficiaries"
                            id="label-beneficiaries-chooseBeneficiaries"
                          >
                            {beneficiariesT('beneficiarySelectionMethod.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.beneficiarySelectionMethod}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="beneficiaries-chooseBeneficiaries"
                            name="beneficiarySelectionMethod"
                            ariaLabel="label-beneficiaries-chooseBeneficiaries"
                            options={composeMultiSelectOptions(
                              beneficiarySelectionMethodConfig.options
                            )}
                            selectedLabel={beneficiariesT(
                              'beneficiarySelectionMethod.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue(
                                'beneficiarySelectionMethod',
                                value
                              );
                            }}
                            initialValues={
                              initialValues.beneficiarySelectionMethod
                            }
                          />

                          {(values?.beneficiarySelectionMethod || []).includes(
                            SelectionMethodType.OTHER
                          ) && (
                            <FieldGroup
                              scrollElement="beneficiaries-chooseBeneficiarie-other"
                              error={!!flatErrors.beneficiarySelectionOther}
                            >
                              <Label
                                htmlFor="beneficiaries-choose-beneficiaries-other"
                                className="text-normal"
                              >
                                {beneficiariesT(
                                  'beneficiarySelectionOther.label'
                                )}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.beneficiarySelectionOther}
                              </FieldErrorMsg>

                              <Field
                                as={TextField}
                                error={flatErrors.beneficiarySelectionOther}
                                id="beneficiaries-choose-beneficiaries-other"
                                data-testid="beneficiaries-choose-beneficiaries-other"
                                name="beneficiarySelectionOther"
                              />
                            </FieldGroup>
                          )}

                          <AddNote
                            id="beneficiaries-selection-note"
                            field="beneficiarySelectionNote"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button
                            type="button"
                            className="usa-button usa-button--outline margin-bottom-1"
                            onClick={() => {
                              history.push(
                                `/models/${modelID}/task-list/beneficiaries`
                              );
                            }}
                          >
                            {miscellaneousT('back')}
                          </Button>

                          <Button type="submit" onClick={() => setErrors({})}>
                            {miscellaneousT('next')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() =>
                            history.push(`/models/${modelID}/task-list`)
                          }
                        >
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />

                          {miscellaneousT('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={2} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default PeopleImpact;
