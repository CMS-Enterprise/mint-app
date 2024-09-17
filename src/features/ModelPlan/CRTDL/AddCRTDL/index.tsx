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
import classNames from 'classnames';
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
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import useMessage from 'hooks/useMessage';
import flattenErrors from 'utils/flattenErrors';
import { CRValidationSchema, TDLValidationSchema } from 'validations/crtdl';

import './index.scss';

type CRTDLType = Omit<
  PlanCrCreateInput,
  'modelPlanID' | '__typename' | 'id' | 'dateImplemented'
>;

interface CRTDLFormType extends CRTDLType {
  dateImplementedMonth: string;
  dateImplementedYear: string;
}

type CRTDLParamType = 'cr' | 'tdl' | null;

const initialFormValues: CRTDLFormType = {
  title: '',
  idNumber: '',
  dateInitiated: '',
  dateImplementedMonth: '',
  dateImplementedYear: '',
  note: ''
};

const AddCRTDL = () => {
  const { t: h } = useTranslation('general');
  const { t: crsT } = useTranslation('crs');
  const { t: tdlsT } = useTranslation('tdls');
  const { t } = useTranslation('crtdlsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  const { modelName } = useContext(ModelInfoContext);

  const history = useHistory();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const crtdlType = params.get('type') as CRTDLParamType;
  const crtdlID = params.get('id');
  const readOnly = location.hash === '#read-only';

  const { showMessageOnNextPage } = useMessage();

  const [crtdlFormType, setCrtdlFormType] = useState<CRTDLParamType>(
    crtdlType || 'cr'
  );

  const dateMonths: string[] = t('dateMonths', {
    returnObjects: true
  });

  const formikRef = useRef<FormikProps<CRTDLFormType>>(null);

  const {
    data: crData,
    loading: crLoading,
    error: crError
  } = useGetCrQuery({
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
  const { __typename, id, dateImplemented, ...crFormData } = cr;

  const crFormDataFormatted = { ...crFormData } as CRTDLFormType;

  // Formating ISO date string to month and year number
  if (dateImplemented) {
    crFormDataFormatted.dateImplementedMonth = new Date(dateImplemented)
      .getMonth()
      .toString();
    crFormDataFormatted.dateImplementedYear = new Date(dateImplemented)
      .getFullYear()
      .toString();
  }

  // Removing the metadata from the query payload to use in form
  const tdl = (tdlData?.planTDL || {}) as GetTdlQuery['planTDL'];
  const { __typename: tdlTypename, id: tdlId, ...tdlFormData } = tdl;

  // Setting the form data from queries based on the type/query param
  const selectedTypeData =
    crtdlType === 'cr' ? crFormDataFormatted : tdlFormData;
  const crtdl = Object.keys(selectedTypeData).length
    ? (selectedTypeData as CRTDLFormType)
    : (initialFormValues as CRTDLFormType);

  const [createCR] = useCreateCrMutation();
  const [createTDL] = useCreateTdlMutation();

  const [updateCR] = useUpdateCrMutation();
  const [updateTDL] = useUpdateTdlMutation();

  const handleCreateOrUpdateCRTDL = (formikValues: CRTDLFormType) => {
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
        history.push(`/models/${modelID}/collaboration-area/cr-and-tdl`);
      }
    };

    const catchHandler = (errors: any) => {
      formikRef?.current?.setErrors(errors);
    };

    // Removing dateImplemented from mutation input for TDL or to format CR date
    const { dateImplementedMonth, dateImplementedYear, ...changes } =
      formikValues;

    if (crtdlID) {
      if (crtdlFormType === 'cr') {
        updateCR({
          variables: {
            id: crtdlID,
            changes: {
              ...changes,
              dateImplemented: new Date(
                Number(dateImplementedYear),
                Number(dateImplementedMonth)
              ).toISOString()
            }
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      } else {
        updateTDL({
          variables: {
            id: crtdlID,
            changes
          }
        })
          .then(responseHandler)
          .catch(catchHandler);
      }
    } else if (crtdlFormType === 'cr') {
      createCR({
        variables: {
          input: {
            modelPlanID: modelID,
            ...changes,
            dateImplemented: new Date(
              Number(dateImplementedYear),
              Number(dateImplementedMonth)
            ).toISOString()
          }
        }
      })
        .then(responseHandler)
        .catch(catchHandler);
    } else {
      createTDL({
        variables: {
          input: {
            modelPlanID: modelID,
            ...changes
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
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.TASK_LIST,
            BreadcrumbItemOptions.CR_TDLS
          ]}
        />

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
            validationSchema={
              crtdlFormType === 'cr' ? CRValidationSchema : TDLValidationSchema
            }
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
                            className={classNames({
                              'margin-right-0': !!crtdlID
                            })}
                            disabled={!!crtdlID}
                          >
                            {t('crButton')}
                          </Button>

                          <Button
                            type="button"
                            outline={crtdlFormType !== 'tdl'}
                            onClick={() => setCrtdlFormType('tdl')}
                            disabled={!!crtdlID}
                          >
                            {t('tdlButton')}
                          </Button>
                        </ButtonGroup>

                        <Grid desktop={{ col: 12 }}>
                          <FieldGroup
                            scrollElement="idNumber"
                            error={!!flatErrors.idNumber}
                          >
                            <Label htmlFor="cr-tdl-id-number">
                              {crtdlFormType === 'cr'
                                ? crsT('idNumber.label')
                                : tdlsT('idNumber.label')}
                              <RequiredAsterisk />
                            </Label>

                            <div className="usa-hint margin-top-1">
                              {crtdlFormType === 'cr'
                                ? crsT('idNumber.sublabel')
                                : tdlsT('idNumber.sublabel')}
                            </div>

                            <FieldErrorMsg>{flatErrors.idNumber}</FieldErrorMsg>

                            <div className="input-maxw">
                              <Field
                                as={TextInput}
                                id="cr-tdl-id-number"
                                data-testid="cr-tdl-id-number"
                                maxLength={50}
                                name="idNumber"
                              />
                            </div>
                          </FieldGroup>

                          <FieldGroup
                            scrollElement="title"
                            error={!!flatErrors.title}
                          >
                            <Label htmlFor="cr-tdl-title">
                              {crtdlFormType === 'cr'
                                ? crsT('title.label')
                                : tdlsT('title.label')}
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
                                {crtdlFormType === 'cr'
                                  ? crsT('dateInitiated.label')
                                  : tdlsT('dateInitiated.label')}
                                <RequiredAsterisk />
                              </Label>

                              <div className="usa-hint margin-top-1">
                                {crtdlFormType === 'cr'
                                  ? crsT('dateInitiated.sublabel')
                                  : tdlsT('dateInitiated.sublabel')}
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
                          {crtdlFormType === 'cr' && (
                            <Fieldset>
                              <Label htmlFor="cr-tdl-title">
                                {crsT('dateImplemented.label')}
                                <RequiredAsterisk />
                              </Label>

                              <div className="usa-hint margin-top-0">
                                {crsT('dateImplemented.sublabel')}
                              </div>

                              <DateInputGroup className="display-flex flex-wrap margin-top-neg-1">
                                <FormGroup className="usa-form-group--month usa-form-group--select width-card-lg margin-right-2">
                                  <Label
                                    htmlFor="date-implemented-month"
                                    className="text-normal"
                                  >
                                    {t('dateMonth')}
                                  </Label>

                                  <Field
                                    as={Select}
                                    id="date-implemented-month"
                                    name="dateImplementedMonth"
                                  >
                                    <option
                                      key="default-select"
                                      disabled
                                      value=""
                                    >
                                      {t('dateSelect')}
                                    </option>

                                    {dateMonths.map((month, index) => (
                                      <option value={index} key={month}>
                                        {month}
                                      </option>
                                    ))}
                                  </Field>
                                </FormGroup>

                                <Field
                                  as={DateInput}
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
                          )}

                          <Divider className="margin-top-4 margin-bottom-2" />

                          <FieldGroup
                            scrollElement="note"
                            error={!!flatErrors.note}
                          >
                            <Label htmlFor="cr-tdl-note">
                              {crtdlFormType === 'cr'
                                ? crsT('note.label')
                                : tdlsT('note.label')}
                            </Label>

                            <div className="usa-hint margin-top-1">
                              {crtdlFormType === 'cr'
                                ? crsT('note.sublabel')
                                : tdlsT('note.sublabel')}
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
                            !values.title ||
                            (crtdlFormType === 'cr' &&
                              (!values.dateImplementedMonth ||
                                !values.dateImplementedYear))
                          }
                          onClick={() => setErrors({})}
                        >
                          {!crtdlID
                            ? t('addCRTDLForm', {
                                type: crtdlFormType?.toUpperCase()
                              })
                            : t('updateCRTDL')}
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
                : `/models/${modelID}/collaboration-area/cr-and-tdl`
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
