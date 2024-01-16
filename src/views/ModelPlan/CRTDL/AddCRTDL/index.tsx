import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  DateInput,
  DateInputGroup,
  DatePicker,
  Fieldset,
  FormGroup,
  Grid,
  GridContainer,
  Label,
  Select,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetCrQuery,
  GetTdlQuery,
  PlanCrCreateInput,
  useCreateCrMutation,
  useCreateTdlMutation,
  useGetCrQuery,
  useGetTdlQuery,
  useUpdateCrMutation,
  useUpdateTdlMutation
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import flattenErrors from 'utils/flattenErrors';
import CRTDLValidationSchema from 'validations/crtdl';
import { ModelInfoContext } from 'views/ModelInfoWrapper';

import './index.scss';

type CRTDLFormType = Omit<
  PlanCrCreateInput,
  'modelPlanID' | '__typename' | 'id'
>;

const initialFormValues: CRTDLFormType = {
  title: '',
  idNumber: '',
  dateInitiated: '',
  dateImplemented: '',
  note: null
};

const AddCRTDL = () => {
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('crtdl');

  const { modelID } = useParams<{ modelID: string }>();
  const { modelName } = useContext(ModelInfoContext);

  const history = useHistory();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const crtdlType = params.get('type');
  const crtdlID = params.get('id');
  const readOnly = location.hash === '#read-only';

  const { showMessageOnNextPage } = useMessage();

  const [crtdlFormType, setCrtdlFormType] = useState<'cr' | 'tdl'>('cr');

  const dateMonths: string[] = t('dateMonths', {
    returnObjects: true
  });

  const formikRef = useRef<FormikProps<CRTDLFormType>>(null);

  const { data: crData, loading: crLoading, error: crError } = useGetCrQuery({
    variables: {
      id: crtdlID!
    },
    skip: !crtdlID || crtdlType !== 'cr'
  });

  const {
    data: tdlData,
    loading: tdlLoading,
    error: tdlError
  } = useGetTdlQuery({
    variables: {
      id: crtdlID!
    },
    skip: !crtdlID || crtdlType !== 'tdl'
  });

  // Removing the metadata from the query payload to use in form
  const cr = (crData?.planCR || {}) as GetCrQuery['planCR'];
  const { __typename, id, ...crFormData } = cr;

  const tdl = (tdlData?.planTDL || {}) as GetTdlQuery['planTDL'];
  const { __typename: tdlTypename, id: tdlId, ...tdlFormData } = tdl;

  // Setting the form data from queries based on the type/query param
  const selectedTypeData = crtdlType === 'cr' ? crFormData : tdlFormData;
  const crtdl = (selectedTypeData || initialFormValues) as CRTDLFormType;

  const [createCR] = useCreateCrMutation();
  const [createTDL] = useCreateTdlMutation();

  const [updateCR] = useUpdateCrMutation();
  const [updateTDL] = useUpdateTdlMutation();

  const handleCreateOrUpdateCRTDL = (formikValues: CRTDLFormType) => {
    const { ...changes } = formikValues;

    const responseHandler = (response: any) => {
      if (!response?.errors) {
        showMessageOnNextPage(
          <Alert
            type="success"
            slim
            data-testid="mandatory-fields-alert"
            className="margin-y-4"
          >
            <span className="mandatory-fields-alert__text">
              {t(crtdlID ? 'successUpdate' : 'successAdd', {
                crtdl: changes.idNumber,
                modelName
              })}
            </span>
          </Alert>
        );
        history.push(`/models/${modelID}/cr-and-tdl`);
      }
    };

    const catchHandler = (errors: any) => {
      formikRef?.current?.setErrors(errors);
    };

    if (crtdlID) {
      if (crtdlType === 'cr') {
        updateCR({
          variables: {
            id: crtdlID,
            changes
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      } else {
        // Removing dateImplemented from mutation input for TDL
        const { dateImplemented, ...tdlInput } = changes;
        updateTDL({
          variables: {
            id: crtdlID,
            changes: tdlInput
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      }
    } else if (crtdlType === 'cr') {
      createCR({
        variables: {
          input: {
            modelPlanID: modelID,
            ...changes
          }
        }
      })
        .then(responseHandler)
        .catch(catchHandler);
    } else {
      // Removing dateImplemented from mutation input for TDL
      const { dateImplemented, ...tdlInput } = changes;
      createTDL({
        variables: {
          input: {
            modelPlanID: modelID,
            ...tdlInput
          }
        }
      })
        .then(responseHandler)
        .catch(catchHandler);
    }
  };

  return (
    <MainContent className="margin-bottom-6">
      <GridContainer>
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {t('heading')}
          </PageHeading>
          <div className="margin-bottom-2 line-height-body-4">
            {!crtdlID ? t('createDescription') : t('updateDescription')}
          </div>

          <p className="margin-bottom-0">
            {t('required1')}
            <RequiredAsterisk />
            {t('required2')}
          </p>

          {(crError || tdlError) && (
            <ErrorAlert
              testId="formik-validation-errors"
              classNames="margin-top-3"
              heading={t('error')}
            >
              <ErrorAlertMessage errorKey="1" message={t('errorInfo')} />
            </ErrorAlert>
          )}

          <Formik
            initialValues={crtdl}
            enableReinitialize
            onSubmit={handleCreateOrUpdateCRTDL}
            validationSchema={CRTDLValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<CRTDLFormType>) => {
              const {
                errors,
                values,
                setErrors,
                setFieldValue,
                handleSubmit,
                setFieldError
              } = formikProps;

              const flatErrors = flattenErrors(errors);

              const handleOnBlur = (
                e: React.ChangeEvent<HTMLInputElement>,
                field: string
              ) => {
                if (e.target.value === '') {
                  setFieldValue(field, null);
                  return;
                }
                try {
                  setFieldValue(field, new Date(e.target.value).toISOString());
                  delete errors[field as keyof CRTDLFormType];
                } catch (err) {
                  setFieldError(field, t('validDate'));
                }
              };

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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Fieldset
                      disabled={
                        !!crError || crLoading || !!tdlError || tdlLoading
                      }
                    >
                      <Grid row>
                        <ButtonGroup
                          type="segmented"
                          className="margin-top-4 margin-bottom-2"
                        >
                          <Button
                            type="button"
                            outline={crtdlFormType !== 'cr'}
                            onClick={() => setCrtdlFormType('cr')}
                          >
                            {t('crButton')}
                          </Button>
                          <Button
                            type="button"
                            outline={crtdlFormType !== 'tdl'}
                            onClick={() => setCrtdlFormType('tdl')}
                          >
                            {t('tdlButton')}
                          </Button>
                        </ButtonGroup>

                        <Grid desktop={{ col: 6 }}>
                          <FieldGroup
                            scrollElement="idNumber"
                            error={!!flatErrors.idNumber}
                          >
                            <Label htmlFor="cr-tdl-id-number">
                              {t('idNumber')}
                              <RequiredAsterisk />
                            </Label>

                            <div className="usa-hint margin-top-1">
                              {t('idNumberInfo')}
                            </div>

                            <FieldErrorMsg>{flatErrors.idNumber}</FieldErrorMsg>

                            <Field
                              as={TextInput}
                              id="cr-tdl-id-number"
                              data-testid="cr-tdl-id-number"
                              maxLength={50}
                              name="idNumber"
                            />
                          </FieldGroup>
                        </Grid>

                        <Grid desktop={{ col: 12 }}>
                          <FieldGroup
                            scrollElement="title"
                            error={!!flatErrors.title}
                          >
                            <Label htmlFor="cr-tdl-title">
                              {t('title')}
                              <RequiredAsterisk />
                            </Label>

                            <FieldErrorMsg>{flatErrors.title}</FieldErrorMsg>
                            <Field
                              as={TextInput}
                              id="cr-tdl-title"
                              data-testid="cr-tdl-title"
                              name="title"
                            />
                          </FieldGroup>
                        </Grid>

                        <Grid desktop={{ col: 6 }}>
                          {!crLoading && !tdlLoading && (
                            <FieldGroup
                              scrollElement="dateInitiated"
                              error={!!flatErrors.dateInitiated}
                            >
                              <Label
                                htmlFor="cr-tdl-date-initiated"
                                className="text-bold"
                              >
                                {t('dateInitiated')}
                                <RequiredAsterisk />
                              </Label>

                              <div className="usa-hint margin-top-1">
                                {h('datePlaceholder')}
                              </div>

                              <FieldErrorMsg>
                                {flatErrors.dateInitiated}
                              </FieldErrorMsg>

                              <div className="width-card-lg position-relative">
                                <Field
                                  as={DatePicker}
                                  id="cr-tdl-date-initiated"
                                  data-testid="cr-tdl-date-initiated"
                                  maxLength={50}
                                  name="dateInitiated"
                                  defaultValue={crtdl.dateInitiated}
                                  onBlur={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleOnBlur(e, 'dateInitiated');
                                  }}
                                />
                              </div>
                            </FieldGroup>
                          )}
                        </Grid>
                      </Grid>
                      <Grid row>
                        <Grid desktop={{ col: 12 }}>
                          <Fieldset>
                            <Label htmlFor="cr-tdl-title">
                              {t('dateImplemented')}
                              <RequiredAsterisk />
                            </Label>

                            <div className="usa-hint margin-top-0">
                              {t('dateImplementedInfo')}
                            </div>

                            <DateInputGroup className="display-flex flex-wrap margin-top-neg-1">
                              <FormGroup className="usa-form-group--month usa-form-group--select width-card-lg margin-right-2">
                                <Label
                                  htmlFor="date-implemented-month"
                                  className="text-normal"
                                >
                                  {t('dateMonth')}
                                </Label>
                                <Select
                                  id="date-implemented-month"
                                  name="dateImplementedMonth"
                                >
                                  <option>{t('dateSelect')}</option>
                                  {dateMonths.map((month, index) => (
                                    <option value={index + 1}>{month}</option>
                                  ))}
                                </Select>
                              </FormGroup>

                              <DateInput
                                id="date-implemented-year"
                                className="width-10"
                                name="dateImplementedYear"
                                label={t('dateYear')}
                                unit="year"
                                maxLength={4}
                                minLength={4}
                              />
                            </DateInputGroup>
                          </Fieldset>

                          <Divider className="margin-top-4 margin-bottom-2" />
                          <FieldGroup
                            scrollElement="note"
                            error={!!flatErrors.note}
                          >
                            <Label htmlFor="cr-tdl-note">{t('notes')}</Label>
                            <div className="usa-hint margin-top-1">
                              {t('notesInfo')}
                            </div>
                            <FieldErrorMsg>{flatErrors.note}</FieldErrorMsg>
                            <Field
                              as={Textarea}
                              className="height-15"
                              id="cr-tdl-note"
                              data-testid="cr-tdl-note"
                              value={values.note || ''}
                              name="note"
                            />
                          </FieldGroup>
                        </Grid>
                      </Grid>

                      <div className="margin-y-4 display-block">
                        <Button
                          type="submit"
                          id="submit-cr-and-tdl"
                          disabled={
                            !values.idNumber ||
                            !values.dateInitiated ||
                            !values.title
                          }
                          onClick={() => setErrors({})}
                        >
                          {!crtdlID ? t('addCRTDL') : t('updateCRTDL')}
                        </Button>
                      </div>
                    </Fieldset>
                  </Form>
                </>
              );
            }}
          </Formik>
          <UswdsReactLink
            to={
              readOnly
                ? `/models/${modelID}/read-only/crs-and-tdl`
                : `/models/${modelID}/cr-and-tdl`
            }
          >
            <span>&larr; </span>{' '}
            {!crtdlID ? t('addRedirect') : t('updateRedirect')}
          </UswdsReactLink>
        </div>
      </GridContainer>
    </MainContent>
  );
};

export default AddCRTDL;
