import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import GetBeneficiaryIdentification from 'queries/Beneficiaries/getBeneficiaryIndentification';
import {
  GetBeneficiaryIdentification as BeneficiaryIdentificationType,
  GetBeneficiaryIdentification_modelPlan_beneficiaries as BeneficiaryIdentificationFormType,
  GetBeneficiaryIdentificationVariables
} from 'queries/Beneficiaries/types/GetBeneficiaryIdentification';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/Beneficiaries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/Beneficiaries/UpdateModelPlanBeneficiaries';
import { BeneficiariesType, TriStateAnswer } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { sortOtherEnum, translateBeneficiariesType } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const BeneficiaryIdentification = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<BeneficiaryIdentificationFormType>>(
    null
  );
  const history = useHistory();

  const { data, loading, error } = useQuery<
    BeneficiaryIdentificationType,
    GetBeneficiaryIdentificationVariables
  >(GetBeneficiaryIdentification, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    beneficiaries,
    beneficiariesOther,
    beneficiariesNote,
    treatDualElligibleDifferent,
    treatDualElligibleDifferentHow,
    treatDualElligibleDifferentNote,
    excludeCertainCharacteristics,
    excludeCertainCharacteristicsCriteria,
    excludeCertainCharacteristicsNote
  } =
    data?.modelPlan?.beneficiaries || ({} as BeneficiaryIdentificationFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdateModelPlanBeneficiariesVariables>(
    UpdateModelPlanBeneficiaries
  );

  const handleFormSubmit = (redirect?: 'next' | 'back') => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/beneficiaries/people-impact`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const mappedBeneficiariesType = Object.keys(BeneficiariesType)
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translateBeneficiariesType(key),
      subLabel:
        key === BeneficiariesType.DISEASE_SPECIFIC ? t('diseaseSubLabel') : null
    }));

  const initialValues: BeneficiaryIdentificationFormType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    beneficiaries: beneficiaries ?? '',
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
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
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
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<BeneficiaryIdentificationFormType>) => {
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
              {Object.keys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={h('checkAndFix')}
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
                      data-testid="beneficiaries-identification-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <Fieldset disabled={loading}>
                        <FieldGroup
                          scrollElement="beneficiaries"
                          error={!!flatErrors.beneficiaries}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="beneficiaries-beneficiaries"
                            id="label-beneficiaries-beneficiaries"
                          >
                            {t('beneficiaries')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.beneficiaries}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="beneficiaries-beneficiaries"
                            name="beneficiaries"
                            ariaLabel="label-beneficiaries-beneficiaries"
                            options={mappedBeneficiariesType}
                            selectedLabel={t('selectedGroup')}
                            onChange={(value: string[] | []) => {
                              setFieldValue('beneficiaries', value);
                            }}
                            initialValues={initialValues.beneficiaries}
                          />

                          {(values?.beneficiaries || []).includes(
                            BeneficiariesType.OTHER
                          ) && (
                            <FieldGroup
                              scrollElement="beneficiariesOther"
                              error={!!flatErrors.beneficiariesOther}
                            >
                              <Label
                                htmlFor="beneficiaries-other"
                                className="text-normal"
                              >
                                {t('beneficiariesOther')}
                              </Label>
                              <FieldErrorMsg>
                                {flatErrors.beneficiariesOther}
                              </FieldErrorMsg>
                              <Field
                                as={TextField}
                                error={flatErrors.beneficiariesOther}
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
                              {t('beneficiariesNA')}
                            </Alert>
                          )}

                          <AddNote
                            id="beneficiaries-note"
                            field="beneficiariesNote"
                          />
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="treatDualElligibleDifferent"
                          error={!!flatErrors.treatDualElligibleDifferent}
                          className="margin-y-4 margin-bottom-8"
                        >
                          <Label htmlFor="beneficiaries-dual-eligibility">
                            {t('dualEligibility')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.treatDualElligibleDifferent}
                          </FieldErrorMsg>
                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-dual-eligibility"
                              name="treatDualElligibleDifferent"
                              label={h('yes')}
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
                                error={
                                  !!flatErrors.treatDualElligibleDifferentHow
                                }
                              >
                                <Label
                                  htmlFor="beneficiaries-dual-eligibility-how"
                                  className="text-normal"
                                >
                                  {h('howSo')}
                                </Label>
                                <FieldErrorMsg>
                                  {flatErrors.treatDualElligibleDifferentHow}
                                </FieldErrorMsg>
                                <Field
                                  as={TextAreaField}
                                  className="height-15"
                                  error={
                                    flatErrors.treatDualElligibleDifferentHow
                                  }
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
                              label={h('no')}
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
                              label={t('beneficiariesOptions.na')}
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

                        <FieldGroup
                          scrollElement="excludeCertainCharacteristics"
                          error={!!flatErrors.excludeCertainCharacteristics}
                          className="margin-y-4 margin-bottom-8"
                        >
                          <Label htmlFor="beneficiaries-exclude">
                            {t('excluded')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.excludeCertainCharacteristics}
                          </FieldErrorMsg>
                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-exclude"
                              name="excludeCertainCharacteristics"
                              label={h('yes')}
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
                              <FieldGroup
                                className="margin-left-4 margin-y-1"
                                scrollElement="excludeCertainCharacteristicsCriteria"
                                error={
                                  !!flatErrors.excludeCertainCharacteristicsCriteria
                                }
                              >
                                <Label
                                  htmlFor="beneficiaries-exclude-criteria"
                                  className="text-normal"
                                >
                                  {t('excludedNestedQuestion')}
                                </Label>
                                <FieldErrorMsg>
                                  {
                                    flatErrors.excludeCertainCharacteristicsCriteria
                                  }
                                </FieldErrorMsg>
                                <Field
                                  as={TextAreaField}
                                  className="height-15"
                                  error={
                                    flatErrors.excludeCertainCharacteristicsCriteria
                                  }
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
                              label={h('no')}
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
                              label={t('beneficiariesOptions.na')}
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
                            {h('next')}
                          </Button>
                        </div>
                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() => handleFormSubmit('back')}
                        >
                          <IconArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />
                          {h('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
              {id && !loading && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiaryIdentification;
