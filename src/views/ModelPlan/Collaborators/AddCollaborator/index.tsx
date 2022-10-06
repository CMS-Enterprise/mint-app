import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover
} from '@reach/combobox';
import { Button, Dropdown, Label, TextInput } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import teamRoles from 'constants/enums/teamRoles';
import useUserSearch from 'hooks/useCedarUsers';
import CreateModelPlanCollaborator from 'queries/Collaborators/CreateModelPlanCollaborator';
import GetModelPlanCollaborator from 'queries/Collaborators/GetModelPlanCollaborator';
import { CreateModelPlanCollaborator as CreateCollaboratorsType } from 'queries/Collaborators/types/CreateModelPlanCollaborator';
import {
  GetModelCollaborator,
  GetModelCollaborator_planCollaboratorByID as CollaboratorFormType
} from 'queries/Collaborators/types/GetModelCollaborator';
import { UpdateModelPlanCollaborator as UpdateModelPlanCollaboratorType } from 'queries/Collaborators/types/UpdateModelPlanCollaborator';
import UpdateModelPlanCollaborator from 'queries/Collaborators/UpdateModelPlanCollaborator';
import flattenErrors from 'utils/flattenErrors';
import { translateTeamRole } from 'utils/modelPlan';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

import '@reach/combobox/styles.css';

const Collaborators = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const formikRef = useRef<FormikProps<CollaboratorFormType>>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Custom hook for live searching users from CEDAR
  const foundUsers = useUserSearch(searchTerm);

  const history = useHistory();
  const [create] = useMutation<CreateCollaboratorsType>(
    CreateModelPlanCollaborator
  );
  const [update] = useMutation<UpdateModelPlanCollaboratorType>(
    UpdateModelPlanCollaborator
  );

  const { data } = useQuery<GetModelCollaborator>(GetModelPlanCollaborator, {
    variables: {
      id: collaboratorId
    },
    skip: !collaboratorId
  });

  const collaborator =
    data?.planCollaboratorByID ?? ({} as CollaboratorFormType);

  const handleUpdateDraftModelPlan = (formikValues?: CollaboratorFormType) => {
    const { fullName = '', teamRole = '', euaUserID = '', email = '' } =
      formikValues || {};

    if (collaboratorId) {
      update({
        variables: {
          id: collaboratorId,
          newRole: teamRole
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/${modelID}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    } else {
      create({
        variables: {
          input: {
            fullName,
            teamRole,
            email,
            euaUserID,
            modelPlanID: modelID
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/${modelID}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  const initialValues: CollaboratorFormType = collaborator;

  return (
    <MainContent>
      <div className="grid-container">
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
            {(formikProps: FormikProps<CollaboratorFormType>) => {
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
          <UswdsReactLink to={`/models/${modelID}/collaborators`}>
            <span>&larr; </span>{' '}
            {!collaboratorId
              ? t('dontAddTeamMember')
              : t('dontUpdateTeamMember')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
