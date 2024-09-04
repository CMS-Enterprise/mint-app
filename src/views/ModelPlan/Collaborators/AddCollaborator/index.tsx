import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Fieldset, Label, TextInput } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetIndividualModelPlanCollaboratorQuery,
  GetModelCollaboratorsQuery,
  TeamRole,
  useCreateModelPlanCollaboratorMutation,
  useGetModelCollaboratorsQuery,
  useUpdateModelPlanCollaboratorMutation
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import OktaUserSelect from 'components/OktaUserSelect';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MultiSelect from 'components/shared/MultiSelect';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { composeMultiSelectOptions } from 'utils/modelPlan';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

import RoleInfo from '../_components/RoleInfo';
import { isLastModelLead } from '..';

type GetCollaboratorsType =
  GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];
type CollaboratorFormType =
  GetIndividualModelPlanCollaboratorQuery['planCollaboratorByID'];

type LocationProps = {
  fromCollaborationArea: boolean;
  pathname: string;
  state: {
    fromCollaborationArea: boolean;
  };
};

const Collaborators = () => {
  const { t: collaboratorsT } = useTranslation('collaborators');
  const { t: collaboratorsMiscT } = useTranslation('collaboratorsMisc');
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { teamRoles: teamRolesConfig } = usePlanTranslation('collaborators');

  const history = useHistory();

  const location = useLocation<LocationProps>();

  const isFromCollaborationArea = location.state?.fromCollaborationArea;

  const params = new URLSearchParams(location.search);

  const manageOrAdd = params.get('view') || 'manage';

  const { showMessageOnNextPage } = useMessage();

  const { modelID, collaboratorId } = useParams<{
    modelID: string;
    collaboratorId: string;
  }>();

  const formikRef = useRef<FormikProps<CollaboratorFormType>>(null);

  const [create, { loading }] = useCreateModelPlanCollaboratorMutation();

  const [update, { loading: updateLoading }] =
    useUpdateModelPlanCollaboratorMutation();

  const { data: allCollaboratorsData, loading: queryLoading } =
    useGetModelCollaboratorsQuery({
      variables: {
        id: modelID
      }
    });

  const allCollaborators =
    allCollaboratorsData?.modelPlan?.collaborators ??
    ([] as GetCollaboratorsType[]);

  const specificCollaborator = allCollaborators.filter(
    collab => collab.id === collaboratorId
  );

  const initialValues: CollaboratorFormType = specificCollaborator[0] ?? {
    userAccount: {}
  };

  const isModelLead = specificCollaborator[0]?.teamRoles?.includes(
    TeamRole.MODEL_LEAD
  );

  const handleUpdateDraftModelPlan = (formikValues?: CollaboratorFormType) => {
    const {
      userAccount: { username, commonName },
      teamRoles
    } = formikValues || { userAccount: { userName: null } };
    if (collaboratorId) {
      update({
        variables: {
          id: collaboratorId,
          newRole: teamRoles!
        }
      })
        .then(response => {
          if (!response?.errors) {
            showMessageOnNextPage(
              <>
                <Alert
                  type="success"
                  slim
                  data-testid="success-collaborator-alert"
                  className="margin-y-4"
                >
                  {collaboratorsMiscT('successUpdateMessage', {
                    collaborator: commonName,
                    role: teamRoles
                      ?.map((role: TeamRole) => {
                        return collaboratorsT(`teamRoles.options.${role}`);
                      })
                      .join(', ')
                  })}
                </Alert>
              </>
            );
            history.push(
              `/models/${modelID}/collaboration-area/collaborators?view=${manageOrAdd}`
            );
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    } else {
      create({
        variables: {
          input: {
            modelPlanID: modelID,
            userName: username!,
            teamRoles: teamRoles!
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            showMessageOnNextPage(
              <>
                <Alert
                  type="success"
                  slim
                  data-testid="success-collaborator-alert"
                  className="margin-y-4"
                >
                  {collaboratorsMiscT('successMessage', {
                    collaborator: commonName,
                    role: teamRoles
                      ?.map((role: TeamRole) => {
                        return collaboratorsT(`teamRoles.options.${role}`);
                      })
                      .join(', ')
                  })}
                </Alert>
              </>
            );
            history.push(
              `/models/${modelID}/collaboration-area/collaborators?view=${manageOrAdd}`
            );
          }
        })
        .catch(errors => {
          const collaboratorExistingError =
            errors.graphQLErrors[0]?.message.includes(
              'unique_collaborator_per_plan'
            );
          if (collaboratorExistingError) {
            formikRef?.current?.setErrors({
              userAccount: {
                username: collaboratorsMiscT('existingMember')
              }
            });
          } else {
            formikRef?.current?.setErrors(errors);
          }
        });
    }
  };

  const breadcrumbs = [BreadcrumbItemOptions.HOME];

  if (manageOrAdd === 'manage') {
    breadcrumbs.push(BreadcrumbItemOptions.COLLABORATION_AREA);
  }

  if (!isFromCollaborationArea || manageOrAdd === 'add') {
    breadcrumbs.push(BreadcrumbItemOptions.COLLABORATORS);
  }

  return (
    <MainContent>
      <div className="grid-container">
        <Breadcrumbs
          items={breadcrumbs}
          customItem={
            collaboratorId
              ? collaboratorsMiscT('collaboratorsMisc:updateATeamMember')
              : collaboratorsMiscT('collaboratorsMisc:addATeamMember')
          }
        />
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {collaboratorId
              ? collaboratorsMiscT('updateATeamMember')
              : collaboratorsMiscT('addATeamMember')}
          </PageHeading>

          {!collaboratorId && (
            <div className="margin-bottom-2 font-body-md line-height-body-5">
              {!collaboratorId && collaboratorsMiscT('searchTeamInfo')}{' '}
              {collaboratorsMiscT('teamInfo')}
            </div>
          )}

          <p className="margin-bottom-5">
            <Trans
              i18nKey={miscellaneousT('allFieldsRequired')}
              components={{
                s: <span className="text-secondary-dark" />
              }}
            />
          </p>

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
              const { errors, values, setFieldValue, handleSubmit } =
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

                  <Form
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Fieldset disabled={queryLoading}>
                      <FieldGroup
                        className="margin-top-0"
                        scrollElement="userAccount.commonName"
                        error={!!flatErrors['userAccount.commonName']}
                      >
                        <Label
                          htmlFor="model-team-cedar-contact"
                          id="label-model-team-cedar-contact"
                        >
                          {collaboratorsT('username.label')}
                          <RequiredAsterisk />
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors['userAccount.commonName']}
                        </FieldErrorMsg>

                        <Label
                          id="hint-model-team-cedar-contact"
                          htmlFor="model-team-cedar-contact"
                          className="text-normal margin-top-1 margin-bottom-105 text-base maxw-none"
                          hint
                        >
                          {collaboratorsMiscT('startTyping')}
                        </Label>

                        {collaboratorId ? (
                          <Field
                            as={TextInput}
                            disabled
                            error={!!flatErrors['userAccount.commonName']}
                            className="margin-top-1"
                            id="collaboration-full-name"
                            name="userAccount.commonName"
                          />
                        ) : (
                          <OktaUserSelect
                            id="model-team-cedar-contact"
                            name="model-team-cedar-contact"
                            ariaLabelledBy="label-model-team-cedar-contact"
                            ariaDescribedBy="hint-model-team-cedar-contact"
                            onChange={oktaUser => {
                              setFieldValue(
                                'userAccount.commonName',
                                oktaUser?.displayName
                              );
                              setFieldValue(
                                'userAccount.username',
                                oktaUser?.username
                              );
                            }}
                          />
                        )}
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="teamRoles"
                        error={!!flatErrors.teamRoles}
                      >
                        <Label htmlFor="collaborator-role">
                          {collaboratorsT('teamRoles.label')}
                          <RequiredAsterisk />
                        </Label>

                        <FieldErrorMsg>{flatErrors.teamRoles}</FieldErrorMsg>

                        <Field
                          as={MultiSelect}
                          id="collaborator-role"
                          name="role"
                          selectedLabel={collaboratorsMiscT('selectedRoles')}
                          options={composeMultiSelectOptions(
                            teamRolesConfig.options,
                            undefined,
                            isModelLead && isLastModelLead(allCollaborators)
                              ? TeamRole.MODEL_LEAD
                              : ''
                          )}
                          onChange={(value: TeamRole[]) => {
                            setFieldValue('teamRoles', value);
                          }}
                          initialValues={initialValues.teamRoles}
                          tagOrder={
                            teamRolesConfig.options[TeamRole.MODEL_LEAD]
                          }
                          disabledOption={
                            isModelLead && isLastModelLead(allCollaborators)
                          }
                          disabledLabel={
                            teamRolesConfig.options[TeamRole.MODEL_LEAD]
                          }
                        />
                      </FieldGroup>

                      <RoleInfo
                        className={classNames('margin-bottom-5', {
                          'margin-bottom-6': collaboratorId
                        })}
                      />

                      {!collaboratorId && (
                        <Alert
                          type="info"
                          slim
                          data-testid="mandatory-fields-alert"
                          className="margin-y-3"
                        >
                          <span className="mandatory-fields-alert__text">
                            {isModelLead && isLastModelLead(allCollaborators)
                              ? collaboratorsMiscT('lastModelLeadMemberInfo')
                              : collaboratorsMiscT('searchMemberInfo')}
                          </span>
                        </Alert>
                      )}

                      <div className="margin-y-3 display-block">
                        <Button
                          type="submit"
                          disabled={
                            !values.userAccount.commonName || !values.teamRoles
                          }
                        >
                          {!collaboratorId
                            ? collaboratorsMiscT('addTeamMemberButton')
                            : collaboratorsMiscT('saveChanges')}
                        </Button>

                        {(loading || updateLoading) && (
                          <Spinner className="margin-left-2" />
                        )}
                      </div>
                    </Fieldset>
                  </Form>
                </>
              );
            }}
          </Formik>

          <UswdsReactLink
            to={
              isFromCollaborationArea
                ? `/models/${modelID}/collaboration-area`
                : `/models/${modelID}/collaboration-area/collaborators?view=${manageOrAdd}`
            }
          >
            <span>&larr; </span>{' '}
            {!collaboratorId
              ? collaboratorsMiscT('dontAddTeamMember')
              : collaboratorsMiscT('dontUpdateTeamMember')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
