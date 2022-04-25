import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import useUserSearch from 'hooks/getCedarUsers';
import CreateModelPlanCollaborator from 'queries/CreateModelPlanCollaborator';
import GetModelPlanCollaborators from 'queries/GetModelCollaborators';
import { CreateModelPlanCollaborator as CreateCollaboratorsType } from 'queries/types/CreateModelPlanCollaborator';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType
} from 'queries/types/GetModelCollaborators';
import { UpdateModelPlanCollaborator as UpdateModelPlanCollaboratorType } from 'queries/types/UpdateModelPlanCollaborator';
import UpdateModelPlanCollaborator from 'queries/UpdateModelPlanCollaborator';
import { CollaboratorForm } from 'types/collaborator';
import flattenErrors from 'utils/flattenErrors';
import translateTeamRole from 'utils/modelPlan';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

import '@reach/combobox/styles.css';

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const formikRef = useRef<FormikProps<CollaboratorForm>>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const foundUsers = useUserSearch(searchTerm);

  const history = useHistory();
  const [create] = useMutation<CreateCollaboratorsType>(
    CreateModelPlanCollaborator
  );
  const [update] = useMutation<UpdateModelPlanCollaboratorType>(
    UpdateModelPlanCollaborator
  );

  const { data } = useQuery<GetModelCollaborators>(GetModelPlanCollaborators, {
    variables: {
      id: modelId
    },
    skip: !collaboratorId
  });

  // TODO: Replace with query for single user once BE complete
  const collaborator = (data?.modelPlan?.collaborators.filter(
    user => user.id === collaboratorId
  )[0] ?? {
    euaUserID: '',
    fullName: '',
    teamRole: ''
  }) as GetCollaboratorsType;

  const handleUpdateDraftModelPlan = (formikValues?: CollaboratorForm) => {
    const { fullName = '', teamRole = '', euaUserID = '' } = formikValues || {};

    if (collaboratorId) {
      update({
        variables: {
          input: {
            fullName,
            teamRole,
            euaUserID,
            cmsCenter: 'CMMI',
            modelPlanID: modelId
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/new-plan/${modelId}/collaborators`);
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
            euaUserID,
            cmsCenter: 'CMMI',
            modelPlanID: modelId
          }
        }
      })
        .then(response => {
          if (!response?.errors) {
            history.push(`/models/new-plan/${modelId}/collaborators`);
          }
        })
        .catch(errors => {
          formikRef?.current?.setErrors(errors);
        });
    }
  };

  const initialValues: CollaboratorForm = collaborator;

  return (
    <MainContent className="margin-bottom-5">
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
            {(
              formikProps: FormikProps<{
                euaUserId: string;
                fullName: string;
                teamRole: string;
              }>
            ) => {
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
                      heading="Please check and fix the following"
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
                          }}
                        >
                          <ComboboxInput
                            className="usa-select"
                            selectOnClick
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSearchTerm(e?.target?.value);
                            }}
                          />
                          {foundUsers?.formattedUsers && (
                            <ComboboxPopover>
                              {foundUsers.formattedUsers.length > 0 ? (
                                <ComboboxList>
                                  {foundUsers.formattedUsers.map(user => {
                                    const str = `${user.label}, ${user.value}`;
                                    return (
                                      <ComboboxOption key={str} value={str} />
                                    );
                                  })}
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
                        value={values.teamRole}
                        onChange={(e: any) => {
                          setFieldValue('teamRole', e.target.value);
                        }}
                      >
                        <option value="" key="default-select" disabled>
                          {`-${h('select')}-`}
                        </option>
                        {Object.keys(teamRoles).map(role => {
                          return (
                            <option
                              key={`Collaborator-Role-${translateTeamRole(
                                teamRoles[role]
                              )}`}
                              value={role}
                            >
                              {translateTeamRole(teamRoles[role])}
                            </option>
                          );
                        })}
                      </Field>
                    </FieldGroup>

                    {!collaboratorId && (
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
                    )}

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
          <UswdsReactLink to={`/models/new-plan/${modelId}/collaborators`}>
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
