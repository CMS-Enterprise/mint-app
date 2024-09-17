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
  Radio
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  BeneficiariesType,
  GetBeneficiaryIdentificationQuery,
  TriStateAnswer,
  TypedUpdateModelPlanBeneficiariesDocument,
  useGetBeneficiaryIdentificationQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import Alert from 'components/Alert';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import TextField from 'components/TextField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type BeneficiaryIdentificationFormType =
  GetBeneficiaryIdentificationQuery['modelPlan']['beneficiaries'];

const BeneficiaryIdentification = () => {
  const { t: beneficiariesT } = useTranslation('beneficiaries');

  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    beneficiaries: beneficiariesConfig,
    treatDualElligibleDifferent: treatDualElligibleDifferentConfig,
    excludeCertainCharacteristics: excludeCertainCharacteristicsConfig
  } = usePlanTranslation('beneficiaries');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef =
    useRef<FormikProps<BeneficiaryIdentificationFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useGetBeneficiaryIdentificationQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    beneficiaries,
    diseaseSpecificGroup,
    beneficiariesOther,
    beneficiariesNote,
    treatDualElligibleDifferent,
    treatDualElligibleDifferentHow,
    treatDualElligibleDifferentNote,
    excludeCertainCharacteristics,
    excludeCertainCharacteristicsCriteria,
    excludeCertainCharacteristicsNote
  } = (data?.modelPlan?.beneficiaries ||
    {}) as BeneficiaryIdentificationFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdateModelPlanBeneficiariesDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: BeneficiaryIdentificationFormType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    beneficiaries: beneficiaries ?? '',
    diseaseSpecificGroup: diseaseSpecificGroup ?? '',
    beneficiariesOther: beneficiariesOther ?? '',
    beneficiariesNote: beneficiariesNote ?? '',
    treatDualElligibleDifferent: treatDualElligibleDifferent ?? null,
    treatDualElligibleDifferentHow: treatDualElligibleDifferentHow ?? '',
    treatDualElligibleDifferentNote: treatDualElligibleDifferentNote ?? '',
    excludeCertainCharacteristics: excludeCertainCharacteristics ?? null,
    excludeCertainCharacteristicsCriteria:
      excludeCertainCharacteristicsCriteria ?? '',
    excludeCertainCharacteristicsNote: excludeCertainCharacteristicsNote ?? ''
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
            `/models/${modelID}/collaboration-area/task-list/beneficiaries/people-impact`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<BeneficiaryIdentificationFormType>) => {
          const { setErrors, setFieldValue, values, handleSubmit } =
            formikProps;

          return (
            <>
              <ConfirmLeave />

              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap className="beneficiaries__info">
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-identification-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup className="margin-top-4">
                          <Label
                            htmlFor="beneficiaries-beneficiaries"
                            id="label-beneficiaries-beneficiaries"
                          >
                            {beneficiariesT('beneficiaries.label')}
                          </Label>

                          <Field
                            as={MultiSelect}
                            id="beneficiaries-beneficiaries"
                            name="beneficiaries"
                            ariaLabel="label-beneficiaries-beneficiaries"
                            options={composeMultiSelectOptions(
                              beneficiariesConfig.options,
                              beneficiariesConfig.optionsLabels
                            )}
                            selectedLabel={beneficiariesT(
                              'beneficiaries.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('beneficiaries', value);
                            }}
                            initialValues={initialValues.beneficiaries}
                          />

                          {(values?.beneficiaries || []).includes(
                            BeneficiariesType.DISEASE_SPECIFIC
                          ) && (
                            <FieldGroup>
                              <Label
                                htmlFor="beneficiaries-disease-specific-group"
                                className="text-normal"
                              >
                                {beneficiariesT('diseaseSpecificGroup.label')}
                              </Label>

                              <Field
                                as={TextField}
                                id="beneficiaries-disease-specific-group"
                                data-testid="beneficiaries-disease-specific-group"
                                name="diseaseSpecificGroup"
                              />
                            </FieldGroup>
                          )}

                          {(values?.beneficiaries || []).includes(
                            BeneficiariesType.OTHER
                          ) && (
                            <FieldGroup>
                              <Label
                                htmlFor="beneficiaries-other"
                                className="text-normal"
                              >
                                {beneficiariesT('beneficiariesOther.label')}
                              </Label>

                              <Field
                                as={TextField}
                                id="beneficiaries-other"
                                data-testid="beneficiaries-other"
                                name="beneficiariesOther"
                              />
                            </FieldGroup>
                          )}

                          {(values?.beneficiaries || []).includes(
                            BeneficiariesType.NA
                          ) && (
                            <Alert type="info" slim>
                              {beneficiariesMiscT('beneficiariesNA')}
                            </Alert>
                          )}

                          <AddNote
                            id="beneficiaries-note"
                            field="beneficiariesNote"
                          />
                        </FieldGroup>

                        <FieldGroup className="margin-y-4 margin-bottom-8">
                          <Label htmlFor="beneficiaries-dual-eligibility">
                            {beneficiariesT(
                              'treatDualElligibleDifferent.label'
                            )}
                          </Label>

                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-dual-eligibility"
                              name="treatDualElligibleDifferent"
                              label={
                                treatDualElligibleDifferentConfig.options.YES
                              }
                              value="TRUE"
                              checked={
                                values.treatDualElligibleDifferent ===
                                TriStateAnswer.YES
                              }
                              onChange={() => {
                                setFieldValue(
                                  'treatDualElligibleDifferent',
                                  'YES'
                                );
                              }}
                            />

                            {values?.treatDualElligibleDifferent ===
                              TriStateAnswer.YES && (
                              <FieldGroup
                                className="margin-left-4 margin-y-1"
                                scrollElement="treatDualElligibleDifferentHow"
                              >
                                <Label
                                  htmlFor="beneficiaries-dual-eligibility-how"
                                  className="text-normal"
                                >
                                  {beneficiariesT(
                                    'treatDualElligibleDifferentHow.label'
                                  )}
                                </Label>

                                <Field
                                  as={TextAreaField}
                                  className="height-15"
                                  id="beneficiaries-dual-eligibility-how"
                                  data-testid="beneficiaries-dual-eligibility-how"
                                  name="treatDualElligibleDifferentHow"
                                />
                              </FieldGroup>
                            )}

                            <Field
                              as={Radio}
                              id="beneficiaries-dual-eligibility-no"
                              name="treatDualElligibleDifferent"
                              label={
                                treatDualElligibleDifferentConfig.options.NO
                              }
                              value="FALSE"
                              checked={
                                values.treatDualElligibleDifferent ===
                                TriStateAnswer.NO
                              }
                              onChange={() => {
                                setFieldValue(
                                  'treatDualElligibleDifferent',
                                  'NO'
                                );
                              }}
                            />

                            <Field
                              as={Radio}
                              id="beneficiaries-dual-eligibility-tbd"
                              name="treatDualElligibleDifferent"
                              label={
                                treatDualElligibleDifferentConfig.options.TBD
                              }
                              value="TBD"
                              checked={
                                values.treatDualElligibleDifferent ===
                                TriStateAnswer.TBD
                              }
                              onChange={() => {
                                setFieldValue(
                                  'treatDualElligibleDifferent',
                                  'TBD'
                                );
                              }}
                            />
                          </Fieldset>

                          <AddNote
                            id="beneficiaries-dual-eligibility-note"
                            field="treatDualElligibleDifferentNote"
                          />
                        </FieldGroup>

                        <FieldGroup className="margin-y-4 margin-bottom-8">
                          <Label htmlFor="beneficiaries-exclude">
                            {beneficiariesT(
                              'excludeCertainCharacteristics.label'
                            )}
                          </Label>

                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-exclude"
                              name="excludeCertainCharacteristics"
                              label={
                                excludeCertainCharacteristicsConfig.options.YES
                              }
                              value="TRUE"
                              checked={
                                values.excludeCertainCharacteristics ===
                                TriStateAnswer.YES
                              }
                              onChange={() => {
                                setFieldValue(
                                  'excludeCertainCharacteristics',
                                  'YES'
                                );
                              }}
                            />

                            {values?.excludeCertainCharacteristics ===
                              TriStateAnswer.YES && (
                              <FieldGroup className="margin-left-4 margin-y-1">
                                <Label
                                  htmlFor="beneficiaries-exclude-criteria"
                                  className="text-normal"
                                >
                                  {beneficiariesT(
                                    'excludeCertainCharacteristicsCriteria.label'
                                  )}
                                </Label>

                                <Field
                                  as={TextAreaField}
                                  className="height-15"
                                  id="beneficiaries-exclude-criteria"
                                  data-testid="beneficiaries-exclude-criteria"
                                  name="excludeCertainCharacteristicsCriteria"
                                />
                              </FieldGroup>
                            )}

                            <Field
                              as={Radio}
                              id="beneficiaries-exclude-no"
                              name="excludeCertainCharacteristics"
                              label={
                                excludeCertainCharacteristicsConfig.options.NO
                              }
                              value="FALSE"
                              checked={
                                values.excludeCertainCharacteristics ===
                                TriStateAnswer.NO
                              }
                              onChange={() => {
                                setFieldValue(
                                  'excludeCertainCharacteristics',
                                  'NO'
                                );
                              }}
                            />

                            <Field
                              as={Radio}
                              id="beneficiaries-exclude-tbd"
                              name="excludeCertainCharacteristics"
                              label={
                                excludeCertainCharacteristicsConfig.options.TBD
                              }
                              value="TBD"
                              checked={
                                values.excludeCertainCharacteristics ===
                                TriStateAnswer.TBD
                              }
                              onChange={() => {
                                setFieldValue(
                                  'excludeCertainCharacteristics',
                                  'TBD'
                                );
                              }}
                            />
                          </Fieldset>

                          <AddNote
                            id="beneficiaries-exclude-note"
                            field="excludeCertainCharacteristicsNote"
                          />
                        </FieldGroup>

                        <div className="margin-top-6 margin-bottom-3">
                          <Button type="submit" onClick={() => setErrors({})}>
                            {miscellaneousT('next')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() =>
                            history.push(
                              `/models/${modelID}/collaboration-area/task-list/`
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

      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiaryIdentification;
