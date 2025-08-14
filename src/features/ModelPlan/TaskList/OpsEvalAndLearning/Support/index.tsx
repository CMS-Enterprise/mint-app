import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  CcmInvolvmentType,
  ContractorSupportType,
  DataForMonitoringType,
  GetOpsEvalAndLearningQuery,
  StakeholdersType,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetOpsEvalAndLearningQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MTOWarning from 'components/MTOWarning';
import MultiSelect from 'components/MultiSelect';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import { getKeys } from 'types/translation';
import { composeMultiSelectOptions } from 'utils/modelPlan';

type OpsEvalAndLearningFormType =
  GetOpsEvalAndLearningQuery['modelPlan']['opsEvalAndLearning'];

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

export const Support = () => {
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

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<OpsEvalAndLearningFormType>>(null);

  const navigate = useNavigate();

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

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation<OpsEvalAndLearningFormType>(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const nextPage = () => {
    if (formikRef?.current?.values.iddocSupport) {
      navigate(
        `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc`
      );
    } else {
      navigate(
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
    <MainContent data-testid="ops-eval-and-learning">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={() => mutationError.closeModal()}
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
            const { handleSubmit, setErrors, setFieldValue, values } =
              formikProps;

            return (
              <>
                <ConfirmLeave />

                <form
                  className="desktop:grid-col-6 margin-top-6"
                  data-testid="ops-eval-and-learning-form"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <FieldGroup className="margin-top-4">
                      <Label
                        htmlFor="ops-eval-and-learning-stakeholders"
                        id="label-ops-eval-and-learning-stakeholders"
                      >
                        {opsEvalAndLearningT('stakeholders.label')}
                      </Label>

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

                          <Field
                            as={TextInput}
                            data-testid="ops-eval-and-learning-stakeholders-other"
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
                      scrollElement="helpdeskUse"
                      className="margin-y-4 margin-bottom-8"
                    >
                      <Label htmlFor="ops-eval-and-learning-help-desk-use">
                        {opsEvalAndLearningT('helpdeskUse.label')}
                      </Label>

                      <MTOWarning id="ops-eval-and-learning-help-desk-use-warning" />

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

                      <FieldGroup>
                        <Label
                          htmlFor="ops-eval-and-learning-contractor-support-how"
                          className="text-normal margin-top-4"
                        >
                          {opsEvalAndLearningT('contractorSupportHow.label')}
                        </Label>

                        <p className="text-base margin-y-1">
                          {opsEvalAndLearningT('contractorSupportHow.sublabel')}
                        </p>

                        <Field
                          as={TextAreaField}
                          className="height-card"
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
                      className="margin-y-4 margin-bottom-8"
                      scrollElement="iddocSupport"
                    >
                      <Label htmlFor="ops-eval-and-learning-iddoc-support">
                        {opsEvalAndLearningT('iddocSupport.label')}
                      </Label>

                      <MTOWarning id="ops-eval-and-learning-iddoc-support-warning" />

                      <p className="text-base margin-y-1">
                        {opsEvalAndLearningT('iddocSupport.sublabel')}
                      </p>

                      <p className="text-base margin-y-1 margin-top-2">
                        {opsEvalAndLearningMiscT('additionalQuestionsInfo')}
                      </p>

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
                        navigate(
                          `/models/${modelID}/collaboration-area/task-list`
                        )
                      }
                    >
                      <Icon.ArrowBack
                        className="margin-right-1"
                        aria-hidden
                        aria-label="back"
                      />
                      {miscellaneousT('saveAndReturn')}
                    </Button>
                  </Fieldset>
                </form>
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
      </GridContainer>
    </MainContent>
  );
};

export default Support;
