import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  BeneficiariesType,
  GetBeneficiaryIdentificationQuery,
  TriStateAnswer,
  useGetBeneficiaryIdentificationQuery,
  useUpdateModelPlanBeneficiariesMutation
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

type BeneficiaryIdentificationFormType = GetBeneficiaryIdentificationQuery['modelPlan']['beneficiaries'];

const BeneficiaryIdentification = () => {
  const { t: beneficiariesT } = useTranslation('beneficiaries');

  const { t: beneficiariesMiscT } = useTranslation('beneficiariesMisc');

  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const [isMutationErrorModalOpen, setMutationErrorModalOpen] = useState(false);
  const [destinationURL, setDestinationURL] = useState<string>('');

  const {
    beneficiaries: beneficiariesConfig,
    treatDualElligibleDifferent: treatDualElligibleDifferentConfig,
    excludeCertainCharacteristics: excludeCertainCharacteristicsConfig
  } = usePlanTranslation('beneficiaries');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<BeneficiaryIdentificationFormType>>(
    null
  );

  const history = useHistory();

  const { data, loading, error } = useGetBeneficiaryIdentificationQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    beneficiaries,
    diseaseSpecificGroup,
    beneficiariesOther,
    beneficiariesNote,
    treatDualElligibleDifferent,
    treatDualElligibleDifferentHow,
    treatDualElligibleDifferentNote,
    excludeCertainCharacteristics,
    excludeCertainCharacteristicsCriteria,
    excludeCertainCharacteristicsNote
  } = (data?.modelPlan?.beneficiaries ||
    {}) as BeneficiaryIdentificationFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useUpdateModelPlanBeneficiariesMutation();

  useEffect(() => {
    if (!isMutationErrorModalOpen) {
      const unblock = history.block(location => {
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
              unblock();
              history.push(location.pathname);
            }
          })
          .catch(errors => {
            unblock();
            setDestinationURL(location.pathname);
            setMutationErrorModalOpen(true);

            formikRef?.current?.setErrors(errors);
          });
        return false;
      });

      return () => {
        unblock();
      };
    }
    return () => {};
  }, [history, id, update, isMutationErrorModalOpen]);

  const initialValues: BeneficiaryIdentificationFormType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    beneficiaries: beneficiaries ?? '',
    diseaseSpecificGroup: diseaseSpecificGroup ?? '',
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
      <MutationErrorModal
        isOpen={isMutationErrorModalOpen}
        closeModal={() => setMutationErrorModalOpen(false)}
        url={destinationURL}
      />

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
        <Breadcrumb current>{beneficiariesMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {beneficiariesMiscT('heading')}
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
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/task-list/beneficiaries/people-impact`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<BeneficiaryIdentificationFormType>) => {
          const {
            errors,
            setErrors,
            setFieldValue,
            values,
            handleSubmit
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
                      <Fieldset disabled={!!error || loading}>
                        <FieldGroup
                          scrollElement="beneficiaries"
                          error={!!flatErrors.beneficiaries}
                          className="margin-top-4"
                        >
                          <Label
                            htmlFor="beneficiaries-beneficiaries"
                            id="label-beneficiaries-beneficiaries"
                          >
                            {beneficiariesT('beneficiaries.label')}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.beneficiaries}
                          </FieldErrorMsg>

                          <Field
                            as={MultiSelect}
                            id="beneficiaries-beneficiaries"
                            name="beneficiaries"
                            ariaLabel="label-beneficiaries-beneficiaries"
                            options={composeMultiSelectOptions(
                              beneficiariesConfig.options,
                              beneficiariesConfig.optionsLabels
                            )}
                            selectedLabel={beneficiariesT(
                              'beneficiaries.multiSelectLabel'
                            )}
                            onChange={(value: string[] | []) => {
                              setFieldValue('beneficiaries', value);
                            }}
                            initialValues={initialValues.beneficiaries}
                          />

                          {(values?.beneficiaries || []).includes(
                            BeneficiariesType.DISEASE_SPECIFIC
                          ) && (
                            <FieldGroup
                              scrollElement="diseaseSpecificGroup"
                              error={!!flatErrors.diseaseSpecificGroup}
                            >
                              <Label
                                htmlFor="beneficiaries-disease-specific-group"
                                className="text-normal"
                              >
                                {beneficiariesT('diseaseSpecificGroup.label')}
                              </Label>

                              <FieldErrorMsg>
                                {flatErrors.diseaseSpecificGroup}
                              </FieldErrorMsg>

                              <Field
                                as={TextField}
                                error={flatErrors.diseaseSpecificGroup}
                                id="beneficiaries-disease-specific-group"
                                data-testid="beneficiaries-disease-specific-group"
                                name="diseaseSpecificGroup"
                              />
                            </FieldGroup>
                          )}

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
                                {beneficiariesT('beneficiariesOther.label')}
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
                              {beneficiariesMiscT('beneficiariesNA')}
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
                            {beneficiariesT(
                              'treatDualElligibleDifferent.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.treatDualElligibleDifferent}
                          </FieldErrorMsg>

                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-dual-eligibility"
                              name="treatDualElligibleDifferent"
                              label={
                                treatDualElligibleDifferentConfig.options.YES
                              }
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
                                  {beneficiariesT(
                                    'treatDualElligibleDifferentHow.label'
                                  )}
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
                              label={
                                treatDualElligibleDifferentConfig.options.NO
                              }
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
                              label={
                                treatDualElligibleDifferentConfig.options.TBD
                              }
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
                            {beneficiariesT(
                              'excludeCertainCharacteristics.label'
                            )}
                          </Label>

                          <FieldErrorMsg>
                            {flatErrors.excludeCertainCharacteristics}
                          </FieldErrorMsg>

                          <Fieldset>
                            <Field
                              as={Radio}
                              id="beneficiaries-exclude"
                              name="excludeCertainCharacteristics"
                              label={
                                excludeCertainCharacteristicsConfig.options.YES
                              }
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
                                  {beneficiariesT(
                                    'excludeCertainCharacteristicsCriteria.label'
                                  )}
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
                              label={
                                excludeCertainCharacteristicsConfig.options.NO
                              }
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
                              label={
                                excludeCertainCharacteristicsConfig.options.TBD
                              }
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
                            {miscellaneousT('next')}
                          </Button>
                        </div>

                        <Button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() =>
                            history.push(`/models/${modelID}/task-list/`)
                          }
                        >
                          <Icon.ArrowBack
                            className="margin-right-1"
                            aria-hidden
                          />

                          {miscellaneousT('saveAndReturn')}
                        </Button>
                      </Fieldset>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
            </>
          );
        }}
      </Formik>

      <PageNumber currentPage={1} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiaryIdentification;
