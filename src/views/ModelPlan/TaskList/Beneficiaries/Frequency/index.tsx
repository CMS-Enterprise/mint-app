import React, { Fragment, useRef } from 'react';
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
import ITToolsWarning from 'components/ITToolsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import getFrequency from 'queries/Beneficiaries/getFrequency';
import {
  GetFrequency as BeneficiaryFrequencyType,
  GetFrequency_modelPlan_beneficiaries as FrequencyFormType,
  GetFrequencyVariables
} from 'queries/Beneficiaries/types/GetFrequency';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/Beneficiaries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/Beneficiaries/UpdateModelPlanBeneficiaries';
import { FrequencyType, OverlapType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  sortOtherEnum,
  translateFrequencyType,
  translateOverlapType
} from 'utils/modelPlan';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

const Frequency = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  // Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
  type InitialValueType = Omit<
    FrequencyFormType,
    'readyForReviewByUserAccount' | 'readyForReviewDts'
  >;

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    BeneficiaryFrequencyType,
    GetFrequencyVariables
  >(getFrequency, {
    variables: {
      id: modelID
    },
    fetchPolicy: 'network-only'
  });

  const {
    id,
    beneficiarySelectionFrequency,
    beneficiarySelectionFrequencyNote,
    beneficiarySelectionFrequencyOther,
    beneficiaryOverlap,
    beneficiaryOverlapNote,
    precedenceRules,
    readyForReviewByUserAccount,
    readyForReviewDts,
    status
  } = data?.modelPlan?.beneficiaries || ({} as FrequencyFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  useScrollElement(!loading);

  const [update] = useMutation<UpdateModelPlanBeneficiariesVariables>(
    UpdateModelPlanBeneficiaries
  );

  const handleFormSubmit = (
    redirect?: 'back' | 'task-list' | 'next' | string
  ) => {
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
              `/models/${modelID}/task-list/beneficiaries/people-impact`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          } else if (redirect === 'next') {
            history.push(`/models/${modelID}/task-list/ops-eval-and-learning`);
          } else if (redirect) {
            history.push(redirect);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: InitialValueType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    beneficiarySelectionFrequency: beneficiarySelectionFrequency ?? null,
    beneficiarySelectionFrequencyNote: beneficiarySelectionFrequencyNote ?? '',
    beneficiarySelectionFrequencyOther:
      beneficiarySelectionFrequencyOther ?? '',
    beneficiaryOverlap: beneficiaryOverlap ?? null,
    beneficiaryOverlapNote: beneficiaryOverlapNote ?? '',
    precedenceRules: precedenceRules ?? '',
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
              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-frequency-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="beneficiarySelectionFrequency"
                        error={!!flatErrors.beneficiarySelectionFrequency}
                      >
                        <Label htmlFor="beneficiaries-beneficiarySelectionFrequency">
                          {t('beneficiaryFrequency')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.beneficiarySelectionFrequency}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(FrequencyType)
                            .sort(sortOtherEnum)
                            .map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`beneficiaries-beneficiarySelectionFrequency-${key}`}
                                  name="beneficiarySelectionFrequency"
                                  label={translateFrequencyType(key)}
                                  value={key}
                                  checked={
                                    values.beneficiarySelectionFrequency === key
                                  }
                                  onChange={() => {
                                    setFieldValue(
                                      'beneficiarySelectionFrequency',
                                      key
                                    );
                                  }}
                                />
                                {key === 'OTHER' &&
                                  values.beneficiarySelectionFrequency ===
                                    key && (
                                    <div className="margin-left-4 margin-top-1">
                                      <Label
                                        htmlFor="beneficiaries-beneficiary-selection-frequency-other"
                                        className="text-normal"
                                      >
                                        {h('pleaseSpecify')}
                                      </Label>
                                      <FieldErrorMsg>
                                        {
                                          flatErrors.beneficiarySelectionFrequencyOther
                                        }
                                      </FieldErrorMsg>
                                      <Field
                                        as={TextAreaField}
                                        className="maxw-none mint-textarea"
                                        id="beneficiaries-beneficiary-selection-frequency-other"
                                        maxLength={5000}
                                        name="beneficiarySelectionFrequencyOther"
                                      />
                                    </div>
                                  )}
                              </Fragment>
                            ))}
                        </Fieldset>
                        <AddNote
                          id="beneficiaries-beneficiarySelectionFrequency-note"
                          field="beneficiarySelectionFrequencyNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="beneficiaryOverlap"
                        error={!!flatErrors.beneficiaryOverlap}
                      >
                        <Label htmlFor="beneficiaries-overlap">
                          {t('beneficiaryOverlap')}
                        </Label>

                        {itSolutionsStarted && (
                          <ITToolsWarning
                            id="beneficiaries-overlap-warning"
                            onClick={() =>
                              handleFormSubmit(
                                `/models/${modelID}/task-list/it-solutions`
                              )
                            }
                          />
                        )}

                        <FieldErrorMsg>
                          {flatErrors.beneficiaryOverlap}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(OverlapType)
                            .sort(sortOtherEnum)
                            .map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`beneficiaries-overlap-${key}`}
                                  name="beneficiariesOverlap"
                                  label={translateOverlapType(key)}
                                  value={key}
                                  checked={values.beneficiaryOverlap === key}
                                  onChange={() => {
                                    setFieldValue('beneficiaryOverlap', key);
                                  }}
                                />
                              </Fragment>
                            ))}
                        </Fieldset>
                        <AddNote
                          id="beneficiaries-overlap-note"
                          field="beneficiaryOverlapNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="precedenceRules"
                        error={!!flatErrors.precedenceRules}
                      >
                        <Label
                          htmlFor="beneficiaries-precedence-rules"
                          className="maxw-none"
                        >
                          {t('benficiaryPrecedence')}
                        </Label>
                        <p className="text-base margin-0 line-height-body-3">
                          {t('benficiaryPrecedenceExtra')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.precedenceRules}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="height-15"
                          error={flatErrors.precedenceRules}
                          id="beneficiaries-precedence-rules"
                          data-testid="beneficiaries-precedence-rules"
                          name="precedenceRules"
                        />
                      </FieldGroup>

                      {!loading && values.status && (
                        <ReadyForReview
                          id="beneficiaries-status"
                          field="status"
                          sectionName={t('heading')}
                          status={values.status}
                          setFieldValue={setFieldValue}
                          readyForReviewBy={
                            readyForReviewByUserAccount?.commonName
                          }
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
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
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
      <PageNumber currentPage={3} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default Frequency;
