import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Dropdown,
  Fieldset,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import GetDataSharing from 'queries/OpsEvalAndLearning/GetDataSharing';
import {
  GetDataSharing as GetDataSharingType,
  GetDataSharing_modelPlan_opsEvalAndLearning as GetDataSharingFormType,
  GetDataSharingVariables
} from 'queries/OpsEvalAndLearning/types/GetDataSharing';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import { DataFrequencyType, DataStartsType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import {
  translateDataFrequencyType,
  translateDataStartsType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const dataSharingOptions: DataStartsType[] = [
  DataStartsType.DURING_APPLICATION_PERIOD,
  DataStartsType.SHORTLY_BEFORE_THE_START_DATE,
  DataStartsType.EARLY_IN_THE_FIRST_PERFORMANCE_YEAR,
  DataStartsType.LATER_IN_THE_FIRST_PERFORMANCE_YEAR,
  DataStartsType.IN_THE_SUBSEQUENT_PERFORMANCE_YEAR,
  DataStartsType.AT_SOME_OTHER_POINT_IN_TIME,
  DataStartsType.NOT_PLANNING_TO_DO_THIS,
  DataStartsType.OTHER
];

const dataFrequencyOptions: DataFrequencyType[] = [
  DataFrequencyType.ANNUALLY,
  DataFrequencyType.BIANNUALLY,
  DataFrequencyType.QUARTERLY,
  DataFrequencyType.MONTHLY,
  DataFrequencyType.SEMI_MONTHLY,
  DataFrequencyType.WEEKLY,
  DataFrequencyType.DAILY,
  DataFrequencyType.OTHER,
  DataFrequencyType.NOT_PLANNING_TO_DO_THIS
];

const DataSharing = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<GetDataSharingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetDataSharingType,
    GetDataSharingVariables
  >(GetDataSharing, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    dataSharingStarts,
    dataSharingStartsOther,
    dataSharingFrequency,
    dataSharingFrequencyOther,
    dataSharingStartsNote,
    dataCollectionStarts,
    dataCollectionStartsOther,
    dataCollectionFrequency,
    dataCollectionFrequencyOther,
    dataCollectionFrequencyNote,
    qualityReportingStarts,
    qualityReportingStartsOther,
    qualityReportingStartsNote
  } = data?.modelPlan?.opsEvalAndLearning || ({} as GetDataSharingFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
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
              `/models/${modelID}/task-list/ops-eval-and-learning/learning`
            );
          } else if (redirect === 'back') {
            if (
              isCCWInvolvement(formikRef?.current?.values.ccmInvolvment) ||
              isQualityMeasures(
                formikRef?.current?.values.dataNeededForMonitoring
              )
            ) {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/ccw-and-quality`
              );
            } else {
              history.push(
                `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`
              );
            }
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: GetDataSharingFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    iddocSupport: iddocSupport ?? null,
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    dataSharingStarts: dataSharingStarts ?? null,
    dataSharingStartsOther: dataSharingStartsOther ?? '',
    dataSharingFrequency: dataSharingFrequency ?? [],
    dataSharingFrequencyOther: dataSharingFrequencyOther ?? '',
    dataSharingStartsNote: dataSharingStartsNote ?? '',
    dataCollectionStarts: dataCollectionStarts ?? null,
    dataCollectionStartsOther: dataCollectionStartsOther ?? '',
    dataCollectionFrequency: dataCollectionFrequency ?? [],
    dataCollectionFrequencyOther: dataCollectionFrequencyOther ?? '',
    dataCollectionFrequencyNote: dataCollectionFrequencyNote ?? '',
    qualityReportingStarts: qualityReportingStarts ?? null,
    qualityReportingStartsOther: qualityReportingStartsOther ?? '',
    qualityReportingStartsNote: qualityReportingStartsNote ?? ''
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
        {(formikProps: FormikProps<GetDataSharingFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            values,
            setFieldValue
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
                data-testid="ops-eval-and-learning-data-sharing-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={loading}>
                  <FieldGroup
                    scrollElement="dataSharingStarts"
                    error={!!flatErrors.dataSharingStarts}
                  >
                    <strong>{t('reportingTiming')}</strong>
                    <Label
                      htmlFor="ops-eval-and-learning-data-sharing-starts"
                      className="text-normal margin-top-2"
                    >
                      {t('dataSharing')}
                    </Label>
                    <p className="text-base margin-y-1 line-height-body-4">
                      {t('dataSharingInfo')}
                    </p>
                    <FieldErrorMsg>
                      {flatErrors.dataSharingStarts}
                    </FieldErrorMsg>
                    <Field
                      as={Dropdown}
                      id="ops-eval-and-learning-data-sharing-starts"
                      name="dataSharingStarts"
                      value={values.dataSharingStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('dataSharingStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${h('select')}-`}
                      </option>
                      {dataSharingOptions.map(type => {
                        return (
                          <option key={type} value={type || ''}>
                            {translateDataStartsType(type)}
                          </option>
                        );
                      })}
                    </Field>

                    {values.dataSharingStarts === 'OTHER' && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-sharing-starts-other"
                          className="text-normal"
                        >
                          {h('pleaseSpecify')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.dataSharingStartsOther}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-sharing-starts-other"
                          maxLength={5000}
                          name="dataSharingStartsOther"
                        />
                      </div>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="dataSharingFrequency"
                    error={!!flatErrors.dataSharingFrequency}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-sharing-frequency"
                      className="maxw-none text-normal"
                      id="label-ops-eval-and-learning-data-sharing-frequency"
                    >
                      {t('dataSharingHowOften')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataSharingFrequency}
                    </FieldErrorMsg>
                    <Field
                      as={MultiSelect}
                      id="ops-eval-and-learning-data-sharing-frequency"
                      name="dataSharingFrequency"
                      ariaLabel="label-ops-eval-and-learning-data-sharing-frequency"
                      options={dataFrequencyOptions.map(key => ({
                        value: key,
                        label: translateDataFrequencyType(key)
                      }))}
                      selectedLabel={t('dataSharingHowOftenSeleted')}
                      onChange={(value: string[] | []) => {
                        setFieldValue('dataSharingFrequency', value);
                      }}
                      initialValues={initialValues.dataSharingFrequency}
                    />
                    {(values?.dataSharingFrequency || []).includes(
                      DataFrequencyType.OTHER
                    ) && (
                      <div className="margin-top-2">
                        <Label
                          htmlFor="ops-eval-and-learning-data-sharing-frequency-other"
                          className="text-normal"
                        >
                          {h('pleaseSpecify')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.dataSharingFrequencyOther}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          maxLength={5000}
                          className="mint-textarea"
                          error={flatErrors.dataSharingFrequencyOther}
                          id="ops-eval-and-learning-data-sharing-frequency-other"
                          name="dataSharingFrequencyOther"
                        />
                      </div>
                    )}

                    <AddNote
                      id="ops-eval-and-learning-data-sharing-frequency-note"
                      field="dataSharingStartsNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="dataCollectionStarts"
                    error={!!flatErrors.dataCollectionStarts}
                  >
                    <strong>{t('dataCollectionTiming')}</strong>
                    <Label
                      htmlFor="ops-eval-and-learning-data-collection-starts"
                      className="text-normal margin-top-2"
                    >
                      {t('dataCollection')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.dataCollectionStarts}
                    </FieldErrorMsg>
                    <Field
                      as={Dropdown}
                      id="ops-eval-and-learning-data-collection-starts"
                      name="dataCollectionStarts"
                      value={values.dataCollectionStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('dataCollectionStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${h('select')}-`}
                      </option>
                      {dataSharingOptions.map(type => {
                        return (
                          <option key={type} value={type || ''}>
                            {translateDataStartsType(type)}
                          </option>
                        );
                      })}
                    </Field>

                    {values.dataCollectionStarts === 'OTHER' && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-collection-starts-other"
                          className="text-normal"
                        >
                          {h('pleaseSpecify')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.dataCollectionStartsOther}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-collection-starts-other"
                          maxLength={5000}
                          name="dataCollectionStartsOther"
                        />
                      </div>
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="dataCollectionFrequency"
                    error={!!flatErrors.dataCollectionFrequency}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-collection-frequency"
                      id="label-ops-eval-and-learning-data-collection-frequency"
                      className="maxw-none text-normal"
                    >
                      {t('dataCollectionHowOften')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataCollectionFrequency}
                    </FieldErrorMsg>
                    <Field
                      as={MultiSelect}
                      id="ops-eval-and-learning-data-collection-frequency"
                      name="dataCollectionFrequency"
                      ariaLabel="label-ops-eval-and-learning-data-collection-frequency"
                      options={dataFrequencyOptions.map(key => ({
                        value: key,
                        label: translateDataFrequencyType(key)
                      }))}
                      selectedLabel={t('dataSharingHowOftenSeleted')}
                      onChange={(value: string[] | []) => {
                        setFieldValue('dataCollectionFrequency', value);
                      }}
                      initialValues={initialValues.dataCollectionFrequency}
                    />
                    {(values?.dataCollectionFrequency || []).includes(
                      DataFrequencyType.OTHER
                    ) && (
                      <div className="margin-top-2">
                        <Label
                          htmlFor="ops-eval-and-learning-data-collection-frequency-other"
                          className="text-normal"
                        >
                          {h('pleaseSpecify')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.dataCollectionFrequencyOther}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          maxLength={5000}
                          className="mint-textarea"
                          error={flatErrors.dataCollectionFrequencyOther}
                          id="ops-eval-and-learning-data-collection-frequency-other"
                          name="dataCollectionFrequencyOther"
                        />
                      </div>
                    )}

                    <AddNote
                      id="ops-eval-and-learning-data-sharing-frequency-note"
                      field="dataCollectionFrequencyNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="qualityReportingStarts"
                    error={!!flatErrors.qualityReportingStarts}
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-data-reporting-starts"
                      className="margin-top-2"
                    >
                      {t('dataReporting')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.qualityReportingStarts}
                    </FieldErrorMsg>
                    <Field
                      as={Dropdown}
                      id="ops-eval-and-learning-data-reporting-starts"
                      name="qualityReportingStarts"
                      value={values.qualityReportingStarts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('qualityReportingStarts', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${h('select')}-`}
                      </option>
                      {dataSharingOptions.map(type => {
                        return (
                          <option key={type} value={type || ''}>
                            {translateDataStartsType(type)}
                          </option>
                        );
                      })}
                    </Field>

                    {values.qualityReportingStarts === 'OTHER' && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="ops-eval-and-learning-data-reporting-starts-other"
                          className="text-normal"
                        >
                          {h('pleaseSpecify')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.qualityReportingStartsOther}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="maxw-none mint-textarea"
                          id="ops-eval-and-learning-data-reporting-starts-other"
                          data-testid="ops-eval-and-learning-data-reporting-starts-other"
                          maxLength={5000}
                          name="qualityReportingStartsOther"
                        />
                      </div>
                    )}

                    <AddNote
                      id="ops-eval-and-learning-data-reporting-frequency-note"
                      field="qualityReportingStartsNote"
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
                </Fieldset>
              </Form>

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
      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            8,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default DataSharing;
