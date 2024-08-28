import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  CcmInvolvmentType,
  ContractorSupportType,
  DataForMonitoringType,
  GetOpsEvalAndLearningQuery,
  StakeholdersType,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetOpsEvalAndLearningQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import ITSolutionsWarning from 'components/ITSolutionsWarning';
import MainContent from 'components/MainContent';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import ProtectedRoute from 'views/App/ProtectedRoute';
import { NotFoundPartial } from 'views/NotFound';

import CCWAndQuality from './CCWAndQuality';
import DataSharing from './DataSharing';
import Evaluation from './Evaluation';
import IDDOC from './IDDOC';
import IDDOCMonitoring from './IDDOCMonitoring';
import IDDOCTesting from './IDDOCTesting';
import Learning from './Learning';
import Performance from './Performance';

type OpsEvalAndLearningFormType = GetOpsEvalAndLearningQuery['modelPlan']['opsEvalAndLearning'];

// Used to render the total pages based on certain answers populated within this task list item
export const renderTotalPages = (
  iddoc: boolean | null | undefined,
  qualityOrCCW?: boolean | null
) => {
  let totalPages = 5;
  if (iddoc) totalPages += 3;
  if (qualityOrCCW) totalPages += 1;
  return totalPages;
};

// Used to render the current page based on certain answers populated within this task list item
export const renderCurrentPage = (
  currentPage: number,
  iddoc: boolean | null | undefined,
  qualityOrCCW?: boolean | null
) => {
  let adjustedCurrentPage = currentPage;
  if (currentPage > 2 && !iddoc) adjustedCurrentPage -= 3;
  if (currentPage > 6 && !qualityOrCCW) adjustedCurrentPage -= 1;
  return adjustedCurrentPage;
};

// Checks to see is there is a checked 'Yes' answer within the ccmInvolvment array
export const isCCWInvolvement = (
  ccmInvolvment: CcmInvolvmentType[] | undefined
) => {
  return (ccmInvolvment || []).some(value =>
    [
      CcmInvolvmentType.YES_EVALUATION,
      CcmInvolvmentType.YES__IMPLEMENTATION
    ].includes(value)
  );
};

// Checks to see is there is a checked 'Yes' answer within the ccmInvolvment array
export const isQualityMeasures = (
  dataNeededForMonitoring: DataForMonitoringType[] | undefined
) => {
  return (dataNeededForMonitoring || []).some(value =>
    [
      DataForMonitoringType.QUALITY_CLAIMS_BASED_MEASURES,
      DataForMonitoringType.QUALITY_REPORTED_MEASURES
    ].includes(value)
  );
};

export const OpsEvalAndLearningContent = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    stakeholders: stakeholdersConfig,
    helpdeskUse: helpdeskUseConfig,
    contractorSupport: contractorSupportConfig,
    iddocSupport: iddocSupportConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<OpsEvalAndLearningFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useGetOpsEvalAndLearningQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    ccmInvolvment,
    dataNeededForMonitoring,
    stakeholders,
    stakeholdersOther,
    stakeholdersNote,
    helpdeskUse,
    helpdeskUseNote,
    contractorSupport,
    contractorSupportOther,
    contractorSupportHow,
    contractorSupportNote,
    iddocSupport,
    iddocSupportNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as OpsEvalAndLearningFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const itSolutionsStarted: boolean = !!data?.modelPlan.operationalNeeds.find(
    need => need.modifiedDts
  );

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const nextPage = () => {
    if (formikRef?.current?.values.iddocSupport) {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc`
      );
    } else {
      history.push(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/performance`
      );
    }
  };

  const initialValues: OpsEvalAndLearningFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    stakeholders: stakeholders ?? [],
    stakeholdersOther: stakeholdersOther ?? '',
    stakeholdersNote: stakeholdersNote ?? '',
    helpdeskUse: helpdeskUse ?? null,
    helpdeskUseNote: helpdeskUseNote ?? '',
    contractorSupport: contractorSupport ?? [],
    contractorSupportOther: contractorSupportOther ?? '',
    contractorSupportHow: contractorSupportHow ?? '',
    contractorSupportNote: contractorSupportNote ?? '',
    iddocSupport: iddocSupport ?? null,
    iddocSupportNote: iddocSupportNote ?? ''
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
          BreadcrumbItemOptions.OPS_EVAL_AND_LEARNING
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
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
          nextPage();
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<OpsEvalAndLearningFormType>) => {
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

              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="ops-eval-and-learning-stakeholders"
                    error={!!flatErrors.stakeholders}
                    className="margin-top-4"
                  >
                    <Label
                      htmlFor="ops-eval-and-learning-stakeholders"
                      id="label-ops-eval-and-learning-stakeholders"
                    >
                      {opsEvalAndLearningT('stakeholders.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.stakeholders}</FieldErrorMsg>

                    <Field
                      as={MultiSelect}
                      id="ops-eval-and-learning-stakeholders"
                      name="stakeholders"
                      ariaLabel="label-ops-eval-and-learning-stakeholders"
                      role="combobox"
                      options={composeMultiSelectOptions(
                        stakeholdersConfig.options
                      )}
                      selectedLabel={opsEvalAndLearningT(
                        'stakeholders.multiSelectLabel'
                      )}
                      onChange={(value: string[] | []) => {
                        setFieldValue('stakeholders', value);
                      }}
                      initialValues={initialValues.stakeholders}
                    />

                    {values.stakeholders.includes(StakeholdersType.OTHER) && (
                      <>
                        <Label
                          htmlFor="ops-eval-and-learning-stakeholders-other"
                          className="margin-y-1 margin-top-3"
                        >
                          {opsEvalAndLearningT('stakeholdersOther.label')}
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.stakeholdersOther}
                        </FieldErrorMsg>

                        <Field
                          as={TextInput}
                          data-testid="ops-eval-and-learning-stakeholders-other"
                          error={!!flatErrors.stakeholdersOther}
                          id="ops-eval-and-learning-key-other"
                          maxLength={50}
                          name="stakeholdersOther"
                        />
                      </>
                    )}

                    <AddNote
                      id="ops-eval-and-learning-stakeholders-note"
                      field="stakeholdersNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-help-desk-use"
                    error={!!flatErrors.helpdeskUse}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="ops-eval-and-learning-help-desk-use">
                      {opsEvalAndLearningT('helpdeskUse.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-help-desk-use-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/collaboration-area/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <FieldErrorMsg>{flatErrors.helpdeskUse}</FieldErrorMsg>

                    <BooleanRadio
                      field="helpdeskUse"
                      id="ops-eval-and-learning-help-desk-use"
                      value={values.helpdeskUse}
                      setFieldValue={setFieldValue}
                      options={helpdeskUseConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-help-desk-use-note"
                      field="helpdeskUseNote"
                    />
                  </FieldGroup>

                  <FieldGroup scrollElement="ops-eval-and-learning-contractor-support">
                    <Label htmlFor="ops-eval-and-learning-contractor-support">
                      {opsEvalAndLearningT('contractorSupport.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.contractorSupport}
                    </FieldErrorMsg>

                    {getKeys(contractorSupportConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`ops-eval-and-learning-contractor-support-${type}`}
                            name="contractorSupport"
                            label={contractorSupportConfig.options[type]}
                            value={type}
                            checked={values?.contractorSupport.includes(type)}
                          />

                          {type === ContractorSupportType.OTHER &&
                            values.contractorSupport.includes(
                              ContractorSupportType.OTHER
                            ) && (
                              <div className="margin-left-4">
                                <Label
                                  htmlFor="ops-eval-and-learning-contractor-support-other"
                                  className="text-normal"
                                >
                                  {opsEvalAndLearningT(
                                    'contractorSupportOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.contractorSupportOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="ops-eval-and-learning-contractor-support-other"
                                  name="contractorSupportOther"
                                />
                              </div>
                            )}
                        </Fragment>
                      );
                    })}

                    <FieldGroup
                      scrollElement="ops-eval-and-learning-contractor-support-how"
                      error={!!flatErrors.contractorSupportHow}
                    >
                      <Label
                        htmlFor="ops-eval-and-learning-contractor-support-how"
                        className="text-normal margin-top-4"
                      >
                        {opsEvalAndLearningT('contractorSupportHow.label')}
                      </Label>

                      <p className="text-base margin-y-1">
                        {opsEvalAndLearningT('contractorSupportHow.sublabel')}
                      </p>

                      <FieldErrorMsg>
                        {flatErrors.contractorSupportHow}
                      </FieldErrorMsg>

                      <Field
                        as={TextAreaField}
                        className="height-card"
                        error={flatErrors.contractorSupportHow}
                        id="ops-eval-and-learning-contractor-support-how"
                        data-testid="ops-eval-and-learning-contractor-support-how"
                        name="contractorSupportHow"
                      />
                    </FieldGroup>

                    <AddNote
                      id="ops-eval-and-learning-contractor-support-note"
                      field="contractorSupportNote"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-iddoc-support"
                    error={!!flatErrors.iddocSupport}
                    className="margin-y-4 margin-bottom-8"
                  >
                    <Label htmlFor="ops-eval-and-learning-iddoc-support">
                      {opsEvalAndLearningT('iddocSupport.label')}
                    </Label>

                    {itSolutionsStarted && (
                      <ITSolutionsWarning
                        id="ops-eval-and-learning-iddoc-support-warning"
                        onClick={() =>
                          history.push(
                            `/models/${modelID}/collaboration-area/task-list/it-solutions`
                          )
                        }
                      />
                    )}

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT('iddocSupport.sublabel')}
                    </p>

                    <p className="text-base margin-y-1 margin-top-2">
                      {opsEvalAndLearningMiscT('additionalQuestionsInfo')}
                    </p>

                    <FieldErrorMsg>{flatErrors.iddocSupport}</FieldErrorMsg>

                    <BooleanRadio
                      field="iddocSupport"
                      id="ops-eval-and-learning-iddoc-support"
                      value={values.iddocSupport}
                      setFieldValue={setFieldValue}
                      options={iddocSupportConfig.options}
                    />

                    <AddNote
                      id="ops-eval-and-learning-iddoc-support-note"
                      field="iddocSupportNote"
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
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />
                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
            </>
          );
        }}
      </Formik>

      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            1,
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

export const OpsEvalAndLearning = () => {
  return (
    <MainContent data-testid="model-ops-eval-and-learning">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning"
              exact
              render={() => <OpsEvalAndLearningContent />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc"
              exact
              render={() => <IDDOC />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing"
              exact
              render={() => <IDDOCTesting />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring"
              exact
              render={() => <IDDOCMonitoring />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/performance"
              exact
              render={() => <Performance />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/evaluation"
              exact
              render={() => <Evaluation />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/ccw-and-quality"
              exact
              render={() => <CCWAndQuality />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/data-sharing"
              exact
              render={() => <DataSharing />}
            />
            <ProtectedRoute
              path="/models/:modelID/collaboration-area/task-list/ops-eval-and-learning/learning"
              exact
              render={() => <Learning />}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default OpsEvalAndLearning;
