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
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetAuthority from 'queries/GeneralCharacteristics/GetAuthority';
import {
  GetAuthority as GetAuthorityType,
  GetAuthority_modelPlan_generalCharacteristics as AuthorityFormType,
  GetAuthorityVariables
} from 'queries/GeneralCharacteristics/types/GetAuthority';
import { UpdatePlanGeneralCharacteristicsVariables } from 'queries/GeneralCharacteristics/types/UpdatePlanGeneralCharacteristics';
import UpdatePlanGeneralCharacteristics from 'queries/GeneralCharacteristics/UpdatePlanGeneralCharacteristics';
import { AuthorityAllowance, WaiverType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateAuthorityAllowance,
  translateWaiverTypes,
  translateWaiverTypesLabel
} from 'utils/modelPlan';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

const Authority = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    AuthorityFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetAuthorityType,
    GetAuthorityVariables
  >(GetAuthority, {
    variables: {
      id: modelID
    },
    fetchPolicy: 'network-only'
  });

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    rulemakingRequired,
    rulemakingRequiredDescription,
    rulemakingRequiredNote,
    authorityAllowances,
    authorityAllowancesOther,
    authorityAllowancesNote,
    waiversRequired,
    waiversRequiredTypes,
    waiversRequiredNote,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = data?.modelPlan?.generalCharacteristics || ({} as AuthorityFormType);

  const [update] = useMutation<UpdatePlanGeneralCharacteristicsVariables>(
    UpdatePlanGeneralCharacteristics
  );

  const handleFormSubmit = (redirect?: 'back' | 'task-list' | 'next') => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    if (dirtyInputs.status) {
      dirtyInputs.status = sanitizeStatus(dirtyInputs.status);
    }

    update({
      variables: {
        id,
        changes: dirtyInputs
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/characteristics/targets-and-options`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          } else if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers`
            );
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: InitialValueType = {
    __typename: 'PlanGeneralCharacteristics',
    id: id ?? '',
    rulemakingRequired: rulemakingRequired ?? null,
    rulemakingRequiredDescription: rulemakingRequiredDescription ?? '',
    rulemakingRequiredNote: rulemakingRequiredNote ?? '',
    authorityAllowances: authorityAllowances ?? [],
    authorityAllowancesOther: authorityAllowancesOther ?? '',
    authorityAllowancesNote: authorityAllowancesNote ?? '',
    waiversRequired: waiversRequired ?? null,
    waiversRequiredTypes: waiversRequiredTypes ?? [],
    waiversRequiredNote: waiversRequiredNote ?? '',
    status
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
        onSubmit={values => {
          handleFormSubmit('next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
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
                data-testid="plan-characteristics-authority-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="rulemakingRequired"
                    error={!!flatErrors.rulemakingRequired}
                    className="margin-y-4"
                  >
                    <Label htmlFor="plan-characteristics-rulemaking-required">
                      {t('rulemakingRequired')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.rulemakingRequired}
                    </FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="plan-characteristics-rulemaking-required"
                        name="rulemakingRequired"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.rulemakingRequired === true}
                        onChange={() => {
                          setFieldValue('rulemakingRequired', true);
                        }}
                      />
                      {values.rulemakingRequired === true && (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup
                            className="flex-1"
                            scrollElement="rulemakingRequiredDescription"
                            error={!!flatErrors.rulemakingRequiredDescription}
                          >
                            <Label
                              htmlFor="plan-characteristics-rulemaking-required-description"
                              className="margin-bottom-1 text-normal"
                            >
                              {t('ruleMakingInfo')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors.rulemakingRequiredDescription}
                            </FieldErrorMsg>
                            <Field
                              as={TextAreaField}
                              error={!!flatErrors.rulemakingRequiredDescription}
                              className="margin-top-0 height-15"
                              data-testid="plan-characteristics-rulemaking-required-description"
                              id="plan-characteristics-rulemaking-required-description"
                              name="rulemakingRequiredDescription"
                            />
                          </FieldGroup>
                        </div>
                      )}
                      <Field
                        as={Radio}
                        id="plan-characteristics-rulemaking-required-no"
                        name="rulemakingRequired"
                        label={h('no')}
                        value="FALSE"
                        checked={values.rulemakingRequired === false}
                        onChange={() => {
                          setFieldValue('rulemakingRequired', false);
                        }}
                      />
                    </Fieldset>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-rulemaking-required-note"
                    field="rulemakingRequiredNote"
                  />

                  <FieldArray
                    name="authorityAllowances"
                    render={arrayHelpers => (
                      <>
                        <legend className="usa-label">
                          {t('authorityAllowed')}
                        </legend>
                        <FieldErrorMsg>
                          {flatErrors.authorityAllowances}
                        </FieldErrorMsg>

                        {Object.keys(AuthorityAllowance)
                          .sort(sortOtherEnum)
                          .map(type => {
                            return (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`plan-characteristics-authority-allowance-${type}`}
                                  name="authorityAllowances"
                                  label={translateAuthorityAllowance(type)}
                                  value={type}
                                  checked={values.authorityAllowances.includes(
                                    type as AuthorityAllowance
                                  )}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(e.target.value);
                                    } else {
                                      const idx = values.authorityAllowances.indexOf(
                                        e.target.value as AuthorityAllowance
                                      );
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                                {type === 'OTHER' &&
                                  values.authorityAllowances.includes(
                                    type as AuthorityAllowance
                                  ) && (
                                    <FieldGroup
                                      className="margin-left-4 margin-top-2 margin-bottom-4"
                                      error={
                                        !!flatErrors.authorityAllowancesOther
                                      }
                                    >
                                      <Label
                                        htmlFor="plan-characteristics-authority-allowance-other"
                                        className="text-normal"
                                      >
                                        {h('pleaseSpecify')}
                                      </Label>
                                      <FieldErrorMsg>
                                        {flatErrors.authorityAllowancesOther}
                                      </FieldErrorMsg>
                                      <Field
                                        as={TextAreaField}
                                        className="mint-textarea"
                                        id="plan-characteristics-authority-allowance-other"
                                        maxLength={5000}
                                        name="authorityAllowancesOther"
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
                    id="plan-characteristics-authority-allowance-note"
                    field="authorityAllowancesNote"
                  />

                  <FieldGroup
                    scrollElement="waiversRequired"
                    error={!!flatErrors.waiversRequired}
                    className="margin-y-4"
                  >
                    <Label htmlFor="plan-characteristics-waivers-required">
                      {t('waiversRequired')}
                    </Label>
                    <FieldErrorMsg>{flatErrors.waiversRequired}</FieldErrorMsg>
                    <Fieldset>
                      <Field
                        as={Radio}
                        id="plan-characteristics-waivers-required"
                        name="waiversRequired"
                        label={h('yes')}
                        value="TRUE"
                        checked={values.waiversRequired === true}
                        onChange={() => {
                          setFieldValue('waiversRequired', true);
                        }}
                      />
                      <Field
                        as={Radio}
                        id="plan-characteristics-waivers-required-no"
                        name="waiversRequired"
                        label={h('no')}
                        value="FALSE"
                        checked={values.waiversRequired === false}
                        onChange={() => {
                          setFieldValue('waiversRequired', false);
                        }}
                      />
                    </Fieldset>
                  </FieldGroup>

                  {values.waiversRequired && (
                    <FieldArray
                      name="waiversRequiredTypes"
                      render={arrayHelpers => (
                        <>
                          <legend className="usa-label text-normal">
                            {t('waiverTypes')}
                          </legend>
                          <FieldErrorMsg>
                            {flatErrors.waiversRequiredTypes}
                          </FieldErrorMsg>

                          {Object.keys(WaiverType).map(type => {
                            return (
                              <Fragment key={type}>
                                <Field
                                  as={CheckboxField}
                                  id={`plan-characteristics-waiver-types-${type}`}
                                  name="waiversRequiredTypes"
                                  label={translateWaiverTypes(type)}
                                  subLabel={translateWaiverTypesLabel(type)}
                                  value={type}
                                  checked={values.waiversRequiredTypes.includes(
                                    type as WaiverType
                                  )}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(e.target.value);
                                    } else {
                                      const idx = values.waiversRequiredTypes.indexOf(
                                        e.target.value as WaiverType
                                      );
                                      arrayHelpers.remove(idx);
                                    }
                                  }}
                                />
                              </Fragment>
                            );
                          })}
                        </>
                      )}
                    />
                  )}

                  <AddNote
                    id="plan-characteristics-waivers-required-note"
                    field="waiversRequiredNote"
                  />

                  {!loading && values.status && (
                    <ReadyForReview
                      id="characteristics-status"
                      field="status"
                      sectionName={t('heading')}
                      status={values.status}
                      setFieldValue={setFieldValue}
                      readyForReviewBy={readyForReviewByUserAccount?.commonName}
                      readyForReviewDts={readyForReviewDts}
                    />
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
                      {h('saveAndStartNext')}
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
      <PageNumber currentPage={5} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Authority;
