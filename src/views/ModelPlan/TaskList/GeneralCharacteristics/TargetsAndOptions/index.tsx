import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetTargetsAndOptions from 'queries/GeneralCharacteristics/GetTargetsAndOptions';
import {
  GetTargetsAndOptions as GetTargetsAndOptionsType,
  GetTargetsAndOptions_modelPlan_generalCharacteristics as TargetsAndOptionsFormType,
  GetTargetsAndOptionsVariables
} from 'queries/GeneralCharacteristics/types/GetTargetsAndOptions';
import { UpdatePlanGeneralCharacteristicsVariables } from 'queries/GeneralCharacteristics/types/UpdatePlanGeneralCharacteristics';
import UpdatePlanGeneralCharacteristics from 'queries/GeneralCharacteristics/UpdatePlanGeneralCharacteristics';
import {
  AgreementType,
  GeographyApplication,
  GeographyType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateAgreementTypes,
  translateGeographyApplication,
  translateGeographyTypes
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const TargetsAndOptions = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<TargetsAndOptionsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetTargetsAndOptionsType,
    GetTargetsAndOptionsVariables
  >(GetTargetsAndOptions, {
    variables: {
      id: modelID
    }
  });

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    geographiesTargeted,
    geographiesTargetedTypes,
    geographiesTargetedTypesOther,
    geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther,
    geographiesTargetedNote,
    participationOptions,
    participationOptionsNote,
    agreementTypes,
    agreementTypesOther,
    multiplePatricipationAgreementsNeeded,
    multiplePatricipationAgreementsNeededNote
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as TargetsAndOptionsFormType);

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanGeneralCharacteristicsVariables>(
    UpdatePlanGeneralCharacteristics
  );

  const handleFormSubmit = (redirect?: string) => {
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
              `/models/${modelID}/task-list/characteristics/authority`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/characteristics/involvements`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: TargetsAndOptionsFormType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    geographiesTargeted: geographiesTargeted ?? null,
    geographiesTargetedTypes: geographiesTargetedTypes ?? [],
    geographiesTargetedTypesOther: geographiesTargetedTypesOther ?? '',
    geographiesTargetedAppliedTo: geographiesTargetedAppliedTo ?? [],
    geographiesTargetedAppliedToOther: geographiesTargetedAppliedToOther ?? '',
    geographiesTargetedNote: geographiesTargetedNote ?? null,
    participationOptions: participationOptions ?? null,
    participationOptionsNote: participationOptionsNote ?? '',
    agreementTypes: agreementTypes ?? [],
    agreementTypesOther: agreementTypesOther ?? '',
    multiplePatricipationAgreementsNeeded:
      multiplePatricipationAgreementsNeeded ?? null,
    multiplePatricipationAgreementsNeededNote:
      multiplePatricipationAgreementsNeededNote ?? ''
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
        {h('for')} {modelName}
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
        {(formikProps: FormikProps<TargetsAndOptionsFormType>) => {
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
              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="plan-characteristics-targets-and-options-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={loading}>
                  <FieldGroup
                    scrollElement="geographiesTargeted"
                    error={!!flatErrors.geographiesTargeted}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="plan-characteristics-geographies-targeted">
                      {t('specificGeographies')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.geographiesTargeted}
                    </FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="plan-characteristics-geographies-targeted"
                        name="geographiesTargeted"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.geographiesTargeted === true}
                        onChange={() => {
                          setFieldValue('geographiesTargeted', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="plan-characteristics-geographies-targeted-no"
                        name="geographiesTargeted"
                        label={h('no')}
                        value="FALSE"
                        checked={values.geographiesTargeted === false}
                        onChange={() => {
                          setFieldValue('geographiesTargeted', false);
                        }}
                      />
                    </Fieldset>
                    {values.geographiesTargeted && (
                      <>
                        <FieldArray
                          name="geographiesTargetedTypes"
                          render={arrayHelpers => (
                            <>
                              <legend className="usa-label text-normal">
                                {t('geographyType')}
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors.geographiesTargetedTypes}
                              </FieldErrorMsg>

                              {Object.keys(GeographyType)
                                .sort(sortOtherEnum)
                                .map(type => {
                                  return (
                                    <Fragment key={type}>
                                      <Field
                                        as={CheckboxField}
                                        id={`plan-characteristics-geographies-type-${type}`}
                                        name="geographiesTargetedTypes"
                                        label={translateGeographyTypes(type)}
                                        value={type}
                                        checked={values.geographiesTargetedTypes.includes(
                                          type as GeographyType
                                        )}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (e.target.checked) {
                                            arrayHelpers.push(e.target.value);
                                          } else {
                                            const idx = values.geographiesTargetedTypes.indexOf(
                                              e.target.value as GeographyType
                                            );
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                      />
                                      {type === 'OTHER' &&
                                        values.geographiesTargetedTypes.includes(
                                          type as GeographyType
                                        ) && (
                                          <FieldGroup
                                            className="margin-left-4 margin-y-2"
                                            error={
                                              !!flatErrors.geographiesTargetedTypesOther
                                            }
                                          >
                                            <Label
                                              htmlFor="plan-characteristics-geographies-targeted-other"
                                              className="text-normal"
                                            >
                                              {t('geographySpecify')}
                                            </Label>
                                            <FieldErrorMsg>
                                              {
                                                flatErrors.geographiesTargetedTypesOther
                                              }
                                            </FieldErrorMsg>
                                            <Field
                                              as={TextAreaField}
                                              data-testid="plan-characteristics-geographies-targeted-other"
                                              id="plan-characteristics-geographies-targeted-other"
                                              maxLength={5000}
                                              className="mint-textarea"
                                              name="geographiesTargetedTypesOther"
                                            />
                                          </FieldGroup>
                                        )}
                                    </Fragment>
                                  );
                                })}
                            </>
                          )}
                        />

                        <FieldArray
                          name="geographiesTargetedAppliedTo"
                          render={arrayHelpers => (
                            <>
                              <legend className="usa-label text-normal">
                                {t('geographyApplied')}
                              </legend>
                              <FieldErrorMsg>
                                {flatErrors.geographiesTargetedAppliedTo}
                              </FieldErrorMsg>

                              {Object.keys(GeographyApplication)
                                .sort(sortOtherEnum)
                                .map(type => {
                                  return (
                                    <Fragment key={type}>
                                      <Field
                                        as={CheckboxField}
                                        id={`plan-characteristics-geographies-applied-to-${type}`}
                                        name="geographiesTargetedAppliedTo"
                                        label={translateGeographyApplication(
                                          type
                                        )}
                                        value={type}
                                        checked={values.geographiesTargetedAppliedTo.includes(
                                          type as GeographyApplication
                                        )}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (e.target.checked) {
                                            arrayHelpers.push(e.target.value);
                                          } else {
                                            const idx = values.geographiesTargetedAppliedTo.indexOf(
                                              e.target
                                                .value as GeographyApplication
                                            );
                                            arrayHelpers.remove(idx);
                                          }
                                        }}
                                      />
                                      {type === 'OTHER' &&
                                        values.geographiesTargetedAppliedTo.includes(
                                          type as GeographyApplication
                                        ) && (
                                          <FieldGroup
                                            className="margin-left-4 margin-top-2 margin-bottom-0"
                                            error={
                                              !!flatErrors.geographiesTargetedAppliedToOther
                                            }
                                          >
                                            <Label
                                              htmlFor="plan-characteristics-geographies-applied-to-other"
                                              className="text-normal"
                                            >
                                              {t('geographyAppliedSpecify')}
                                            </Label>
                                            <FieldErrorMsg>
                                              {
                                                flatErrors.geographiesTargetedAppliedToOther
                                              }
                                            </FieldErrorMsg>
                                            <Field
                                              as={TextAreaField}
                                              id="plan-characteristics-geographies-applied-to-other"
                                              maxLength={5000}
                                              className="mint-textarea"
                                              name="geographiesTargetedAppliedToOther"
                                            />
                                          </FieldGroup>
                                        )}
                                    </Fragment>
                                  );
                                })}
                            </>
                          )}
                        />

                        <AddNote
                          id="plan-characteristics-geographies-targeted-note"
                          field="geographiesTargetedNote"
                        />
                      </>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="participationOptions"
                    error={!!flatErrors.participationOptions}
                    className="margin-y-4"
                  >
                    <Label htmlFor="plan-characteristics-participation">
                      {t('participationOptions')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.participationOptions}
                    </FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="plan-characteristics-participation"
                        name="participationOptions"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.participationOptions === true}
                        onChange={() => {
                          setFieldValue('participationOptions', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="plan-characteristics-participation-no"
                        name="participationOptions"
                        label={h('no')}
                        value="FALSE"
                        checked={values.participationOptions === false}
                        onChange={() => {
                          setFieldValue('participationOptions', false);
                        }}
                      />
                    </Fieldset>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-participation-note"
                    field="participationOptionsNote"
                  />

                  <FieldGroup
                    scrollElement="agreementTypes"
                    error={!!flatErrors.agreementTypes}
                  >
                    <FieldArray
                      name="agreementTypes"
                      render={arrayHelpers => (
                        <>
                          <legend className="usa-label">
                            {t('agreementType')}
                          </legend>

                          {itSolutionsStarted && (
                            <ITSolutionsWarning
                              id="ops-eval-and-learning-data-needed-warning"
                              onClick={() =>
                                handleFormSubmit(
                                  `/models/${modelID}/task-list/it-solutions`
                                )
                              }
                            />
                          )}

                          <p className="text-base margin-y-1">
                            {t('agreementNote')}
                          </p>

                          <FieldErrorMsg>
                            {flatErrors.agreementTypes}
                          </FieldErrorMsg>

                          {Object.keys(AgreementType)
                            .sort(sortOtherEnum)
                            .map(type => {
                              return (
                                <Fragment key={type}>
                                  <Field
                                    as={CheckboxField}
                                    id={`plan-characteristics-agreement-type-${type}`}
                                    name="agreementTypes"
                                    label={translateAgreementTypes(type)}
                                    value={type}
                                    checked={values.agreementTypes.includes(
                                      type as AgreementType
                                    )}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(e.target.value);
                                      } else {
                                        const idx = values.agreementTypes.indexOf(
                                          e.target.value as AgreementType
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  {type === 'OTHER' &&
                                    values.agreementTypes.includes(
                                      type as AgreementType
                                    ) && (
                                      <FieldGroup
                                        className="margin-left-4 margin-top-2 margin-bottom-0"
                                        error={!!flatErrors.agreementTypesOther}
                                      >
                                        <Label
                                          htmlFor="plan-characteristics-agreement-type-other"
                                          className="text-normal"
                                        >
                                          {h('pleaseSpecify')}
                                        </Label>
                                        <FieldErrorMsg>
                                          {flatErrors.agreementTypesOther}
                                        </FieldErrorMsg>
                                        <Field
                                          as={TextAreaField}
                                          className="mint-textarea"
                                          id="plan-characteristics-agreement-type-other"
                                          maxLength={5000}
                                          name="agreementTypesOther"
                                        />
                                      </FieldGroup>
                                    )}
                                </Fragment>
                              );
                            })}
                        </>
                      )}
                    />
                  </FieldGroup>

                  {values.agreementTypes.includes(
                    'PARTICIPATION' as AgreementType
                  ) && (
                    <>
                      <FieldGroup
                        scrollElement="multiplePatricipationAgreementsNeeded"
                        error={
                          !!flatErrors.multiplePatricipationAgreementsNeeded
                        }
                        className="margin-y-4"
                      >
                        <Label
                          htmlFor="plan-characteristics-multiple-participation-needed"
                          className="text-normal"
                        >
                          {t('moreParticipation')}
                        </Label>
                        <p className="text-base margin-y-1">
                          {t('agreementDepending')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.multiplePatricipationAgreementsNeeded}
                        </FieldErrorMsg>
                        <Fieldset>
                          <Field
                            as={Radio}
                            id="plan-characteristics-multiple-participation-needed"
                            name="multiplePatricipationAgreementsNeeded"
                            label={h('yes')}
                            value="TRUE"
                            checked={
                              values.multiplePatricipationAgreementsNeeded ===
                              true
                            }
                            onChange={() => {
                              setFieldValue(
                                'multiplePatricipationAgreementsNeeded',
                                true
                              );
                            }}
                          />
                          <Field
                            as={Radio}
                            id="plan-characteristics-multiple-participation-needed-no"
                            name="multiplePatricipationAgreementsNeeded"
                            label={h('no')}
                            value="FALSE"
                            checked={
                              values.multiplePatricipationAgreementsNeeded ===
                              false
                            }
                            onChange={() => {
                              setFieldValue(
                                'multiplePatricipationAgreementsNeeded',
                                false
                              );
                            }}
                          />
                        </Fieldset>
                      </FieldGroup>

                      <AddNote
                        id="plan-characteristics-multiple-participation-needed-note"
                        field="multiplePatricipationAgreementsNeededNote"
                      />
                    </>
                  )}

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        handleFormSubmit('back');
                      }}
                    >
                      {h('back')}
                    </Button>
                    <Button type="submit" onClick={() => setErrors({})}>
                      {h('next')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />
                    {h('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
              {id && (
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
      <PageNumber currentPage={4} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default TargetsAndOptions;
