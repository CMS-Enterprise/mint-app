import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AgreementType,
  GeographyApplication,
  GeographyType,
  GetTargetsAndOptionsQuery,
  useGetTargetsAndOptionsQuery,
  useUpdatePlanGeneralCharacteristicsMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

type TargetsAndOptionsFormType = GetTargetsAndOptionsQuery['modelPlan']['generalCharacteristics'];

const TargetsAndOptions = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    geographiesTargeted: geographiesTargetedConfig,
    geographiesTargetedTypes: geographiesTargetedTypesConfig,
    geographiesTargetedAppliedTo: geographiesTargetedAppliedToConfig,
    geographiesStatesAndTerritories: geographiesStatesAndTerritoriesConfig,
    geographiesRegionTypes: geographiesRegionTypesConfig,
    participationOptions: participationOptionsConfig,
    agreementTypes: agreementTypesConfig,
    multiplePatricipationAgreementsNeeded: multiplePatricipationAgreementsNeededConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<TargetsAndOptionsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetTargetsAndOptionsQuery({
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
    geographiesStatesAndTerritories,
    geographiesRegionTypes,
    geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther,
    geographiesTargetedNote,
    participationOptions,
    participationOptionsNote,
    agreementTypes,
    agreementTypesOther,
    multiplePatricipationAgreementsNeeded,
    multiplePatricipationAgreementsNeededNote
  } = (data?.modelPlan?.generalCharacteristics ||
    {}) as TargetsAndOptionsFormType;

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useUpdatePlanGeneralCharacteristicsMutation();

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
    geographiesStatesAndTerritories: geographiesStatesAndTerritories ?? [],
    geographiesRegionTypes: geographiesRegionTypes ?? [],
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
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>
          {generalCharacteristicsMiscT('breadcrumb')}
        </Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {generalCharacteristicsMiscT('heading')}
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
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
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
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="geographiesTargeted"
                    error={!!flatErrors.geographiesTargeted}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="plan-characteristics-geographies-targeted">
                      {generalCharacteristicsT('geographiesTargeted.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.geographiesTargeted}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="geographiesTargeted"
                      id="plan-characteristics-geographies-targeted"
                      value={values.geographiesTargeted}
                      setFieldValue={setFieldValue}
                      options={geographiesTargetedConfig.options}
                    />

                    {values.geographiesTargeted && (
                      <>
                        <FieldGroup
                          scrollElement="geographiesTargetedTypes"
                          error={!!flatErrors.geographiesTargetedTypes}
                          className="margin-top-4"
                        >
                          <Label htmlFor="geographiesTargetedTypes">
                            {generalCharacteristicsT(
                              'geographiesTargetedTypes.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.geographiesTargetedTypes}
                          </FieldErrorMsg>

                          {getKeys(geographiesTargetedTypesConfig.options).map(
                            type => (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`plan-characteristics-geographies-type-${type}`}
                                  name="geographiesTargetedTypes"
                                  label={
                                    geographiesTargetedTypesConfig.options[type]
                                  }
                                  value={type}
                                  checked={values.geographiesTargetedTypes.includes(
                                    type
                                  )}
                                />

                                {type === GeographyType.STATE &&
                                  values.geographiesTargetedTypes.includes(
                                    type
                                  ) && (
                                    <FieldGroup className="margin-left-4 margin-y-2">
                                      <Label
                                        htmlFor="geographiesStatesAndTerritories"
                                        className="text-normal"
                                      >
                                        {generalCharacteristicsT(
                                          'geographiesStatesAndTerritories.label'
                                        )}
                                      </Label>
                                      <Field
                                        as={MultiSelect}
                                        id="plan-characteristics-geographies-state-type"
                                        name="geographiesStatesAndTerritories"
                                        ariaLabel="label-plan-characteristics-geographies-state-type"
                                        options={composeMultiSelectOptions(
                                          geographiesStatesAndTerritoriesConfig.options
                                        )}
                                        selectedLabel={generalCharacteristicsT(
                                          'geographiesStatesAndTerritories.multiSelectLabel'
                                        )}
                                        onChange={(value: string[] | []) => {
                                          setFieldValue(
                                            'geographiesStatesAndTerritories',
                                            value
                                          );
                                        }}
                                        initialValues={
                                          initialValues.geographiesStatesAndTerritories
                                        }
                                      />
                                    </FieldGroup>
                                  )}

                                {type === GeographyType.REGION &&
                                  values.geographiesTargetedTypes.includes(
                                    type
                                  ) && (
                                    <FieldGroup className="margin-left-4 margin-y-2">
                                      {getKeys(
                                        geographiesRegionTypesConfig.options
                                      ).map(regionType => (
                                        <Fragment key={regionType}>
                                          <Field
                                            as={CheckboxField}
                                            id={`plan-characteristics-geographies-region-type-${regionType}`}
                                            name="geographiesRegionTypes"
                                            label={
                                              geographiesRegionTypesConfig
                                                .options[regionType]
                                            }
                                            value={regionType}
                                            checked={values.geographiesRegionTypes?.includes(
                                              regionType
                                            )}
                                          />
                                        </Fragment>
                                      ))}
                                    </FieldGroup>
                                  )}
                                {type === GeographyType.OTHER &&
                                  values.geographiesTargetedTypes.includes(
                                    type
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
                                        {generalCharacteristicsT(
                                          'geographiesTargetedTypesOther.label'
                                        )}
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
                            )
                          )}
                        </FieldGroup>

                        <FieldGroup
                          scrollElement="geographiesTargetedAppliedTo"
                          error={!!flatErrors.geographiesTargetedAppliedTo}
                          className="margin-top-4"
                        >
                          <Label htmlFor="geographiesTargetedAppliedTo">
                            {generalCharacteristicsT(
                              'geographiesTargetedAppliedTo.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.geographiesTargetedAppliedTo}
                          </FieldErrorMsg>

                          {getKeys(
                            geographiesTargetedAppliedToConfig.options
                          ).map(type => {
                            return (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`plan-characteristics-geographies-applied-to-${type}`}
                                  name="geographiesTargetedAppliedTo"
                                  label={
                                    geographiesTargetedAppliedToConfig.options[
                                      type
                                    ]
                                  }
                                  value={type}
                                  checked={values.geographiesTargetedAppliedTo.includes(
                                    type
                                  )}
                                />

                                {type === GeographyApplication.OTHER &&
                                  values.geographiesTargetedAppliedTo.includes(
                                    type
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
                                        {generalCharacteristicsT(
                                          'geographiesTargetedAppliedToOther.label'
                                        )}
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
                        </FieldGroup>

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
                      {generalCharacteristicsT('participationOptions.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.participationOptions}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="participationOptions"
                      id="plan-characteristics-participation"
                      value={values.participationOptions}
                      setFieldValue={setFieldValue}
                      options={participationOptionsConfig.options}
                    />
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-participation-note"
                    field="participationOptionsNote"
                  />

                  <FieldGroup
                    scrollElement="agreementTypes"
                    error={!!flatErrors.agreementTypes}
                  >
                    <Label htmlFor="agreementTypes">
                      {generalCharacteristicsT('agreementTypes.label')}
                    </Label>

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
                      {generalCharacteristicsT('agreementTypes.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.agreementTypes}</FieldErrorMsg>

                    {getKeys(agreementTypesConfig.options).map(type => (
                      <Fragment key={type}>
                        <Field
                          as={CheckboxField}
                          id={`plan-characteristics-agreement-type-${type}`}
                          name="agreementTypes"
                          label={agreementTypesConfig.options[type]}
                          value={type}
                          checked={values.agreementTypes.includes(type)}
                        />
                        {type === AgreementType.OTHER &&
                          values.agreementTypes.includes(type) && (
                            <FieldGroup
                              className="margin-left-4 margin-top-2 margin-bottom-0"
                              error={!!flatErrors.agreementTypesOther}
                            >
                              <Label
                                htmlFor="plan-characteristics-agreement-type-other"
                                className="text-normal"
                              >
                                {generalCharacteristicsT(
                                  'agreementTypesOther.label'
                                )}
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
                    ))}
                  </FieldGroup>

                  {values.agreementTypes.includes(
                    AgreementType.PARTICIPATION
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
                          {generalCharacteristicsT(
                            'multiplePatricipationAgreementsNeeded.label'
                          )}
                        </Label>

                        <p className="text-base margin-y-1">
                          {generalCharacteristicsT(
                            'multiplePatricipationAgreementsNeeded.sublabel'
                          )}
                        </p>

                        <FieldErrorMsg>
                          {flatErrors.multiplePatricipationAgreementsNeeded}
                        </FieldErrorMsg>

                        <BooleanRadio
                          field="multiplePatricipationAgreementsNeeded"
                          id="plan-characteristics-multiple-participation-needed"
                          value={values.multiplePatricipationAgreementsNeeded}
                          setFieldValue={setFieldValue}
                          options={
                            multiplePatricipationAgreementsNeededConfig.options
                          }
                        />
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
                      {miscellaneousT('back')}
                    </Button>
                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />
                    {miscellaneousT('saveAndReturn')}
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
