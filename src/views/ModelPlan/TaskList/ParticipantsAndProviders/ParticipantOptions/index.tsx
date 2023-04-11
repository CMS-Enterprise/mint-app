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
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import ITToolsWarning from 'components/ITSolutionsWarning';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import useScrollElement from 'hooks/useScrollElement';
import GetParticipantOptions from 'queries/ParticipantsAndProviders/GetParticipantOptions';
import {
  GetParticipantOptions as GetParticipantOptionsType,
  GetParticipantOptions_modelPlan_participantsAndProviders as ParticipantOptionsFormType,
  GetParticipantOptionsVariables
} from 'queries/ParticipantsAndProviders/types/GetParticipantOptions';
import { UpdatePlanParticipantsAndProvidersVariables } from 'queries/ParticipantsAndProviders/types/UpdatePlanParticipantsAndProviders';
import UpdatePlanParticipantsAndProviders from 'queries/ParticipantsAndProviders/UpdatePlanParticipantsAndProviders';
import {
  ConfidenceType,
  ParticipantSelectionType,
  RecruitmentType
} from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  mapMultiSelectOptions,
  sortOtherEnum,
  translateConfidenceType,
  translateParticipantSelectiontType,
  translateRecruitmentType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

export const ParticipantOptions = () => {
  const { t } = useTranslation('participantsAndProviders');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ParticipantOptionsFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetParticipantOptionsType,
    GetParticipantOptionsVariables
  >(GetParticipantOptions, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    expectedNumberOfParticipants,
    estimateConfidence,
    confidenceNote,
    recruitmentMethod,
    recruitmentOther,
    recruitmentNote,
    selectionMethod,
    selectionOther,
    selectionNote
  } =
    data?.modelPlan?.participantsAndProviders ||
    ({} as ParticipantOptionsFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from IT Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const [update] = useMutation<UpdatePlanParticipantsAndProvidersVariables>(
    UpdatePlanParticipantsAndProviders
  );

  const handleFormSubmit = (
    redirect?: 'next' | 'back' | 'task-list' | string
  ) => {
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
              `/models/${modelID}/task-list/participants-and-providers/communication`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/participants-and-providers`
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

  const initialValues: ParticipantOptionsFormType = {
    __typename: 'PlanParticipantsAndProviders',
    id: id ?? '',
    expectedNumberOfParticipants: expectedNumberOfParticipants ?? 0,
    estimateConfidence: estimateConfidence ?? null,
    confidenceNote: confidenceNote ?? '',
    recruitmentMethod: recruitmentMethod ?? null,
    recruitmentOther: recruitmentOther ?? '',
    recruitmentNote: recruitmentNote ?? '',
    selectionMethod: selectionMethod ?? [],
    selectionOther: selectionOther ?? '',
    selectionNote: selectionNote ?? ''
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
        {(formikProps: FormikProps<ParticipantOptionsFormType>) => {
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
                data-testid="participants-and-providers-options-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <FieldGroup
                  scrollElement="expectedNumberOfParticipants"
                  error={!!flatErrors.expectedNumberOfParticipants}
                >
                  <Label htmlFor="participants-and-providers-expected-participants">
                    {t('howManyParticipants')}
                  </Label>
                  <p className="text-base margin-0 line-height-body-3">
                    {t('howManyInfo')}
                  </p>
                  <FieldErrorMsg>
                    {flatErrors.expectedNumberOfParticipants}
                  </FieldErrorMsg>
                  <Field
                    as={RangeInput}
                    className="maxw-none width-full"
                    error={flatErrors.expectedNumberOfParticipants}
                    id="participants-and-providers-expected-participants"
                    data-testid="participants-and-providers-expected-participants"
                    name="expectedNumberOfParticipants"
                    min={0}
                    max={10000}
                    step={1}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue(
                        'expectedNumberOfParticipants',
                        Number(e.target.value)
                      );
                    }}
                  />
                  <div className="display-flex mint-header__basic">
                    <span>{t('zero')}</span>
                    <span>{t('tenThousand')}</span>
                  </div>
                  <Label
                    htmlFor="participants-and-providers-participants-other-input"
                    className="text-normal"
                  >
                    {t('numberOfParticipants')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.expectedNumberOfParticipants}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    type="number"
                    className="width-card"
                    error={flatErrors.expectedNumberOfParticipants}
                    id="participants-and-providers-participants-other-input"
                    name="expectedNumberOfParticipants"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (Number.isNaN(e.target.value)) return;
                      setFieldValue(
                        'expectedNumberOfParticipants',
                        Number(e.target.value)
                      );
                    }}
                  />

                  <Label
                    htmlFor="participants-and-providers-current-participants"
                    className="text-normal"
                  >
                    {t('estimateConfidence')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.participantsCurrentlyInModels}
                  </FieldErrorMsg>
                  <Fieldset>
                    {[
                      ConfidenceType.NOT_AT_ALL,
                      ConfidenceType.SLIGHTLY,
                      ConfidenceType.FAIRLY,
                      ConfidenceType.COMPLETELY
                    ].map(key => (
                      <Field
                        as={Radio}
                        key={key}
                        id={`participants-and-providers-confidence-${key}`}
                        name="estimateConfidence"
                        label={translateConfidenceType(key)}
                        value={key}
                        checked={values.estimateConfidence === key}
                        onChange={() => {
                          setFieldValue('estimateConfidence', key);
                        }}
                      />
                    ))}
                  </Fieldset>
                  <AddNote
                    id="participants-and-providers-confidence-note"
                    field="confidenceNote"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="recruitmentMethod"
                  error={!!flatErrors.recruitmentMethod}
                >
                  <Label htmlFor="participants-and-providers-recruitment-method">
                    {t('recruitParticipants')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITToolsWarning
                      id="participants-and-providers-recruitment-method-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}
                  <FieldErrorMsg>{flatErrors.recruitmentMethod}</FieldErrorMsg>
                  <Fieldset>
                    {Object.keys(RecruitmentType)
                      .sort(sortOtherEnum)
                      .map(key => (
                        <Fragment key={key}>
                          <Field
                            as={Radio}
                            id={`participants-and-providers-recruitment-method-${key}`}
                            name="recruitmentMethod"
                            label={translateRecruitmentType(key)}
                            value={key}
                            checked={values.recruitmentMethod === key}
                            onChange={() => {
                              setFieldValue('recruitmentMethod', key);
                            }}
                          />
                          {key === RecruitmentType.NOFO && (
                            <p className="text-base margin-bottom-neg-05 margin-left-4 margin-top-1 line-height-body-3">
                              {t('recruitOptions.recruitInfo')}
                            </p>
                          )}
                          {key === RecruitmentType.OTHER &&
                            values.recruitmentMethod === key && (
                              <div className="margin-left-4 margin-top-1">
                                <Label
                                  htmlFor="participants-and-providers-recruitment-other"
                                  className="text-normal"
                                >
                                  {h('pleaseSpecify')}
                                </Label>
                                <FieldErrorMsg>
                                  {flatErrors.recruitmentOther}
                                </FieldErrorMsg>
                                <Field
                                  as={TextAreaField}
                                  className="maxw-none mint-textarea"
                                  id="participants-and-providers-recruitment-other"
                                  maxLength={5000}
                                  name="recruitmentOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      ))}
                  </Fieldset>

                  <AddNote
                    id="participants-and-providers-recruitment-method-note"
                    field="recruitmentNote"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="selectionMethod"
                  error={!!flatErrors.selectionMethod}
                  className="margin-top-4"
                >
                  <Label htmlFor="participants-and-providers-selection-method">
                    {t('howWillYouSelect')}
                  </Label>
                  {itSolutionsStarted && (
                    <ITToolsWarning
                      id="participants-and-providers-selection-method-warning"
                      onClick={() =>
                        handleFormSubmit(
                          `/models/${modelID}/task-list/it-solutions`
                        )
                      }
                    />
                  )}
                  <FieldErrorMsg>{flatErrors.participants}</FieldErrorMsg>
                  <Field
                    as={MultiSelect}
                    id="participants-and-providers-selection-method"
                    name="selectionMethod"
                    options={mapMultiSelectOptions(
                      translateParticipantSelectiontType,
                      ParticipantSelectionType
                    )}
                    selectedLabel={t('selectedParticipants')}
                    onChange={(value: string[] | []) => {
                      setFieldValue('selectionMethod', value);
                    }}
                    initialValues={initialValues.selectionMethod}
                  />
                  {(values?.selectionMethod || []).includes(
                    'OTHER' as ParticipantSelectionType
                  ) && (
                    <FieldGroup
                      scrollElement="selectionOther"
                      error={!!flatErrors.selectionOther}
                    >
                      <Label
                        htmlFor="participants-and-providers-selection-other"
                        className="text-normal"
                      >
                        {t('describeOther')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.selectionOther}</FieldErrorMsg>
                      <Field
                        as={TextAreaField}
                        className="height-15"
                        error={flatErrors.selectionOther}
                        id="participants-and-providers-selection-other"
                        name="selectionOther"
                      />
                    </FieldGroup>
                  )}

                  <AddNote
                    id="participants-and-providers-selection-note"
                    field="selectionNote"
                  />
                </FieldGroup>

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
      <PageNumber currentPage={2} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default ParticipantOptions;
