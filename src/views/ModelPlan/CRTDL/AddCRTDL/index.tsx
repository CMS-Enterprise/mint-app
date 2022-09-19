import React from 'react';

// import { useTranslation } from 'react-i18next';
// import { useHistory, useParams } from 'react-router-dom';
// import { useMutation, useQuery } from '@apollo/client';
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxList,
//   ComboboxOption,
//   ComboboxPopover
// } from '@reach/combobox';
// import { Button, Dropdown, Label, TextInput } from '@trussworks/react-uswds';
// import { Field, Form, Formik, FormikProps } from 'formik';
// import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
// import PageHeading from 'components/PageHeading';
// import Alert from 'components/shared/Alert';
// import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
// import FieldErrorMsg from 'components/shared/FieldErrorMsg';
// import FieldGroup from 'components/shared/FieldGroup';
// import teamRoles from 'constants/enums/teamRoles';
// import CreateCRTDL from 'queries/CRTDL/CreateCRTDL';
// import GetCRTDL from 'queries/CRTDL/GetCRTDL';
// import {
//   CreateCRTDL as CreateCRTDLType,
//   CreateCRTDL_createPlanCrTdl as CreateCRTDLFormType,
//   CreateCRTDLVariables
// } from 'queries/CRTDL/types/CreateCRTDL';
// import {
//   GetCRTDL_crTdl as CRTDLType,
//   GetCRTDLVariables
// } from 'queries/CRTDL/types/GetCRTDL';
// import {
//   UpdateCRTDL as UpdateCRTDLType,
//   UpdateCRTDL_updatePlanCrTdl as UpdateCRTDLFormType,
//   UpdateCRTDLVariables
// } from 'queries/CRTDL/types/UpdateCRTDL';
// import UpdateCRTDL from 'queries/CRTDL/UpdateCRTDL';
// import flattenErrors from 'utils/flattenErrors';
// import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

// const initialFormValues: CreateCRTDLFormType = {
//   __typename: 'PlanCrTdl',
//   modelPlanID: '',
//   title: '',
//   idNumber: '',
//   dateInitiated: '',
//   note: null
// };

const AddCRTDL = () => {
  //   const { modelID } = useParams<{ modelID: string }>();
  //   const { crtdlID } = useParams<{ crtdlID: string }>();
  //   const { t: h } = useTranslation('draftModelPlan');
  //   const { t } = useTranslation('newModel');
  //   const formikRef = useRef<FormikProps<CreateCRTDLFormType>>(null);

  //   const history = useHistory();

  //   const { data } = useQuery<CRTDLType, GetCRTDLVariables>(GetCRTDL, {
  //     variables: {
  //       id: crtdlID
  //     },
  //     skip: !crtdlID
  //   });

  //   const crtdl = data || initialFormValues;

  //   const [create] = useMutation<CreateCRTDLType, CreateCRTDLVariables>(
  //     CreateCRTDL
  //   );

  //   const [update] = useMutation<UpdateCRTDLType, UpdateCRTDLVariables>(
  //     UpdateCRTDL
  //   );

  //   const handleUpdateDraftModelPlan = (
  //     formikValues?: CreateCRTDLFormType | UpdateCRTDLFormType
  //   ) => {
  //     const {
  //       id = '',
  //       idNumber = '',
  //       dateInitiated = '',
  //       title = '',
  //       note = ''
  //     } = formikValues || {};

  //     if (crtdlID) {
  //       update({
  //         variables: {
  //           id,
  //           changes: {
  //             idNumber,
  //             dateInitiated,
  //             title,
  //             note: modelID
  //           }
  //         }
  //       })
  //         .then(response => {
  //           if (!response?.errors) {
  //             history.push(`/models/new-plan/${modelID}/collaborators`);
  //           }
  //         })
  //         .catch(errors => {
  //           formikRef?.current?.setErrors(errors);
  //         });
  //     } else {
  //       create({
  //         variables: {
  //           input: {
  //             modelPlanID: modelID,
  //             idNumber,
  //             dateInitiated,
  //             title,
  //             note: modelID
  //           }
  //         }
  //       })
  //         .then(response => {
  //           if (!response?.errors) {
  //             history.push(`/models/new-plan/${modelID}/collaborators`);
  //           }
  //         })
  //         .catch(errors => {
  //           formikRef?.current?.setErrors(errors);
  //         });
  //     }
  //   };

  return (
    <MainContent>
      {/* <div className="grid-container">
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {collaboratorId ? t('updateATeamMember') : t('addATeamMember')}
          </PageHeading>
          <div className="margin-bottom-6 line-height-body-6">
            {!collaboratorId && t('searchTeamInfo')} {t('teamInfo')}
          </div>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleUpdateDraftModelPlan}
            validationSchema={CollaboratorsValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<CreateCRTDLFormType>) => {
              const {
                errors,
                values,
                setErrors,
                setFieldValue,
                handleSubmit
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
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <FieldGroup
                      scrollElement="fullName"
                      error={!!flatErrors.fullName}
                    >
                      <Label
                        htmlFor="new-plan-model-name"
                        className="margin-bottom-1"
                      >
                        {t('teamMemberName')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.fullName}</FieldErrorMsg>

                      {collaboratorId ? (
                        <Field
                          as={TextInput}
                          disabled
                          error={!!flatErrors.fullName}
                          id="collaboration-full-name"
                          name="fullName"
                        />
                      ) : (
                        <Combobox
                          aria-label="Cedar-Users"
                          onSelect={item => {
                            const foundUser = foundUsers?.userObj[item];
                            setFieldValue('fullName', foundUser?.commonName);
                            setFieldValue('euaUserID', foundUser?.euaUserId);
                            setFieldValue('email', foundUser?.email);
                          }}
                        >
                          <ComboboxInput
                            className="usa-select"
                            selectOnClick
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSearchTerm(e?.target?.value);
                              if (values.fullName || values.euaUserId) {
                                setFieldValue('fullName', '');
                                setFieldValue('euaUserID', '');
                              }
                            }}
                          />
                          {foundUsers?.formattedUsers && (
                            <ComboboxPopover>
                              {foundUsers.formattedUsers.length > 0 ? (
                                <ComboboxList>
                                  {foundUsers.formattedUsers.map(
                                    (user, index) => {
                                      const str = `${user.label}, ${user.value}`;
                                      return (
                                        <ComboboxOption
                                          key={str}
                                          index={index}
                                          value={str}
                                        />
                                      );
                                    }
                                  )}
                                </ComboboxList>
                              ) : (
                                <span className="display-block margin-1">
                                  {h('noResults')}
                                </span>
                              )}
                            </ComboboxPopover>
                          )}
                        </Combobox>
                      )}
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="teamRole"
                      error={!!flatErrors.teamRole}
                    >
                      <Label htmlFor="IntakeForm-RequesterComponent">
                        {t('teamMemberRole')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.teamRole}</FieldErrorMsg>
                      <Field
                        as={Dropdown}
                        id="collaborator-role"
                        name="role"
                        value={values.teamRole || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('teamRole', e.target.value);
                        }}
                      >
                        <option key="default-select" disabled value="">
                          {`-${h('select')}-`}
                        </option>
                        {Object.keys(teamRoles).map(role => {
                          return (
                            <option
                              key={`Collaborator-Role-${translateTeamRole(
                                teamRoles[role]
                              )}`}
                              value={role || ''}
                            >
                              {translateTeamRole(teamRoles[role])}
                            </option>
                          );
                        })}
                      </Field>
                    </FieldGroup>

                    <Alert
                      type="info"
                      slim
                      data-testid="mandatory-fields-alert"
                      className="margin-y-4"
                    >
                      <span className="mandatory-fields-alert__text">
                        {t('searchMemberInfo')}
                      </span>
                    </Alert>

                    <div className="margin-y-4 display-block">
                      <Button
                        type="submit"
                        disabled={!values.fullName || !values.teamRole}
                        onClick={() => setErrors({})}
                      >
                        {!collaboratorId
                          ? t('addTeamMemberButton')
                          : t('updateTeamMember')}
                      </Button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>
          <UswdsReactLink to={`/models/new-plan/${modelID}/collaborators`}>
            <span>&larr; </span>{' '}
            {!collaboratorId
              ? t('dontAddTeamMember')
              : t('dontUpdateTeamMember')}
          </UswdsReactLink>
        </div>
      </div> */}
    </MainContent>
  );
};

export default AddCRTDL;
