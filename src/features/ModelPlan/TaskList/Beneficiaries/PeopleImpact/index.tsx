import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetPeopleImpactedQuery,
  SelectionMethodType,
  TypedUpdateModelPlanBeneficiariesDocument,
  useGetPeopleImpactedQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextField from 'components/TextField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type PeopleImpactedFormType =
  GetPeopleImpactedQuery['modelPlan']['beneficiaries'];

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
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/beneficiaries/beneficiary-frequency`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<PeopleImpactedFormType>) => {
          const { handleSubmit, setErrors, setFieldValue, values } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

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
                        <FieldGroup>
                          <Label htmlFor="expected-people-impacted">
                            {beneficiariesT('numberPeopleImpacted.label')}
                          </Label>

                          <Field
                            as={RangeInput}
                            className="maxw-none width-full"
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

                          <div className="display-flex mint-header__basic flex-justify">
                            <span>{beneficiariesMiscT('zero')}</span>

                            <span>{beneficiariesMiscT('tenThousand')}</span>
                          </div>

                          <Label
                            htmlFor="expected-people-impacted"
                            className="text-normal"
                          >
                            {beneficiariesMiscT('numberOfPeopleImpacted')}
                          </Label>

                          <Field
                            as={TextInput}
                            type="number"
                            className="width-card"
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

                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="beneficiaries-chooseBeneficiaries"
                            id="label-beneficiaries-chooseBeneficiaries"
                          >
                            {beneficiariesT('beneficiarySelectionMethod.label')}
                          </Label>

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
                            <FieldGroup>
                              <Label
                                htmlFor="beneficiaries-choose-beneficiaries-other"
                                className="text-normal"
                              >
                                {beneficiariesT(
                                  'beneficiarySelectionOther.label'
                                )}
                              </Label>

                              <Field
                                as={TextField}
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
                                `/models/${modelID}/collaboration-area/task-list/beneficiaries`
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
                            history.push(
                              `/models/${modelID}/collaboration-area/task-list`
                            )
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
