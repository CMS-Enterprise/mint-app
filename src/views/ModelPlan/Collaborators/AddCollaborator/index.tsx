import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Dropdown, Label, TextInput } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import CedarContactSelect from 'components/CedarContactSelect';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import teamRoles from 'constants/enums/teamRoles';
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

const Collaborators = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const formikRef = useRef<FormikProps<CollaboratorFormType>>(null);

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
                      <Label htmlFor="new-plan-model-name">
                        {t('teamMemberName')}
                      </Label>
                      <FieldErrorMsg>{flatErrors.fullName}</FieldErrorMsg>

                      {collaboratorId ? (
                        <Field
                          as={TextInput}
                          disabled
                          error={!!flatErrors.fullName}
                          className="margin-top-1"
                          id="collaboration-full-name"
                          name="fullName"
                        />
                      ) : (
                        <>
                          <Label
                            htmlFor="model-team-cedar-contact"
                            className="text-normal margin-top-1 margin-bottom-105 text-base"
                            hint
                          >
                            {t('startTyping')}
                          </Label>
                          <CedarContactSelect
                            id="model-team-cedar-contact"
                            name="model-team-cedar-contact"
                            value={
                              collaborator?.euaUserID
                                ? {
                                    euaUserId: collaborator.euaUserID,
                                    commonName: collaborator.fullName,
                                    email: collaborator.email
                                  }
                                : undefined
                            }
                            onChange={cedarContact => {
                              setFieldValue(
                                'fullName',
                                cedarContact?.commonName
                              );
                              setFieldValue(
                                'euaUserID',
                                cedarContact?.euaUserId
                              );
                              setFieldValue('email', cedarContact?.email);
                            }}
                          />
                        </>
                      )}
                    </FieldGroup>

                    <FieldGroup
                      scrollElement="teamRole"
                      error={!!flatErrors.teamRole}
                    >
                      <Label htmlFor="collaborator-role">
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
