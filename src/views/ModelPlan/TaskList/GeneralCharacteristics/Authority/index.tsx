import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AuthorityAllowance,
  GetAuthorityQuery,
  TypedUpdatePlanGeneralCharacteristicsDocument,
  useGetAuthorityQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import ReadyForReview from 'components/ReadyForReview';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

type AuthorityFormType =
  GetAuthorityQuery['modelPlan']['generalCharacteristics'];

// Omitting readyForReviewBy and readyForReviewDts from initialValues and getting submitted through Formik
type InitialValueType = Omit<
  AuthorityFormType,
  'readyForReviewByUserAccount' | 'readyForReviewDts'
>;

const Authority = () => {
  const { t: generalCharacteristicsT } = useTranslation(
    'generalCharacteristics'
  );
  const { t: generalCharacteristicsMiscT } = useTranslation(
    'generalCharacteristicsMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    rulemakingRequired: rulemakingRequiredConfig,
    authorityAllowances: authorityAllowancesConfig,
    waiversRequired: waiversRequiredConfig,
    waiversRequiredTypes: waiversRequiredTypesConfig
  } = usePlanTranslation('generalCharacteristics');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<InitialValueType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetAuthorityQuery({
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
  } = (data?.modelPlan?.generalCharacteristics || {}) as AuthorityFormType;

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanGeneralCharacteristicsDocument,
    {
      id,
      formikRef
    }
  );

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
          BreadcrumbItemOptions.GENERAL_CHARACTERISTICS
        ]}
      />

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
        onSubmit={values => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/participants-and-providers`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<InitialValueType>) => {
          const { errors, handleSubmit, setErrors, setFieldValue, values } =
            formikProps;
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
                data-testid="plan-characteristics-authority-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="plan-characteristics-rulemaking-required"
                    error={!!flatErrors.rulemakingRequired}
                    className="margin-y-4"
                  >
                    <Label htmlFor="plan-characteristics-rulemaking-required">
                      {generalCharacteristicsT('rulemakingRequired.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.rulemakingRequired}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="rulemakingRequired"
                      id="plan-characteristics-rulemaking-required"
                      value={values.rulemakingRequired}
                      setFieldValue={setFieldValue}
                      options={rulemakingRequiredConfig.options}
                      childName="rulemakingRequiredDescription"
                    >
                      {values.rulemakingRequired === true ? (
                        <div className="display-flex margin-left-4 margin-bottom-1">
                          <FieldGroup
                            className="flex-1"
                            scrollElement="plan-characteristics-rulemaking-required-description"
                            error={!!flatErrors.rulemakingRequiredDescription}
                          >
                            <Label
                              htmlFor="plan-characteristics-rulemaking-required-description"
                              className="margin-bottom-1 text-normal"
                            >
                              {generalCharacteristicsT(
                                'rulemakingRequiredDescription.label'
                              )}
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
                      ) : (
                        <></>
                      )}
                    </BooleanRadio>
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-rulemaking-required-note"
                    field="rulemakingRequiredNote"
                  />

                  <FieldGroup scrollElement="plan-characteristics-authority-allowance">
                    <Label htmlFor="plan-characteristics-authority-allowance">
                      {generalCharacteristicsT('authorityAllowances.label')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors.authorityAllowances}
                    </FieldErrorMsg>

                    {getKeys(authorityAllowancesConfig.options).map(type => {
                      return (
                        <Fragment key={type}>
                          <Field
                            as={CheckboxField}
                            id={`plan-characteristics-authority-allowance-${type}`}
                            name="authorityAllowances"
                            label={authorityAllowancesConfig.options[type]}
                            value={type}
                            checked={values.authorityAllowances.includes(type)}
                          />
                          {type === AuthorityAllowance.OTHER &&
                            values.authorityAllowances.includes(type) && (
                              <FieldGroup
                                scrollElement="plan-characteristics-authority-allowance-other"
                                className="margin-left-4 margin-top-2 margin-bottom-4"
                                error={!!flatErrors.authorityAllowancesOther}
                              >
                                <Label
                                  htmlFor="plan-characteristics-authority-allowance-other"
                                  className="text-normal"
                                >
                                  {generalCharacteristicsT(
                                    'authorityAllowancesOther.label'
                                  )}
                                </Label>

                                <FieldErrorMsg>
                                  {flatErrors.authorityAllowancesOther}
                                </FieldErrorMsg>

                                <Field
                                  as={TextInput}
                                  id="plan-characteristics-authority-allowance-other"
                                  name="authorityAllowancesOther"
                                />
                              </FieldGroup>
                            )}
                        </Fragment>
                      );
                    })}
                  </FieldGroup>

                  <AddNote
                    id="plan-characteristics-authority-allowance-note"
                    field="authorityAllowancesNote"
                  />

                  <FieldGroup
                    scrollElement="plan-characteristics-waivers-required"
                    error={!!flatErrors.waiversRequired}
                    className="margin-y-4"
                  >
                    <Label htmlFor="plan-characteristics-waivers-required">
                      {generalCharacteristicsT('waiversRequired.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.waiversRequired}</FieldErrorMsg>

                    <BooleanRadio
                      field="waiversRequired"
                      id="plan-characteristics-waivers-required"
                      value={values.waiversRequired}
                      setFieldValue={setFieldValue}
                      options={waiversRequiredConfig.options}
                    />
                  </FieldGroup>

                  {values.waiversRequired && (
                    <FieldGroup scrollElement="plan-characteristics-waiver-types">
                      <Label htmlFor="plan-characteristics-waiver-types">
                        {generalCharacteristicsT('waiversRequiredTypes.label')}
                      </Label>

                      <FieldErrorMsg>
                        {flatErrors.waiversRequiredTypes}
                      </FieldErrorMsg>

                      {getKeys(waiversRequiredTypesConfig.options).map(type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`plan-characteristics-waiver-types-${type}`}
                              name="waiversRequiredTypes"
                              label={waiversRequiredTypesConfig.options[type]}
                              subLabel={
                                waiversRequiredTypesConfig.optionsLabels?.[type]
                              }
                              value={type}
                              checked={values.waiversRequiredTypes.includes(
                                type
                              )}
                            />
                          </Fragment>
                        );
                      })}
                    </FieldGroup>
                  )}

                  <AddNote
                    id="plan-characteristics-waivers-required-note"
                    field="waiversRequiredNote"
                  />

                  {!loading && values.status && (
                    <ReadyForReview
                      id="characteristics-status"
                      field="status"
                      sectionName={generalCharacteristicsMiscT('heading')}
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
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/characteristics/targets-and-options`
                        );
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>
                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('saveAndStartNext')}
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
      <PageNumber currentPage={5} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Authority;
