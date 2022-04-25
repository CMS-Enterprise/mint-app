import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Button, Dropdown, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
// import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import teamRoles from 'constants/enums/teamRoles';
import CreateModelPlanCollaborator from 'queries/CreateModelPlanCollaborator';
import GetCedarUser from 'queries/GetCedarUser';
import GetModelPlanCollaborators from 'queries/GetModelCollaborators';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType
} from 'queries/types/GetModelCollaborators';
import {
  CreateModelPlanCollaborator as CreateCollaboratorsType,
  CreateModelPlanCollaborator_createPlanCollaborator as CollaboratorsType
} from 'queries/types/CreateModelPlanCollaborator';
import { GetCedarUser_cedarPersonsByCommonName as GetCedarUserType } from 'queries/types/GetCedarUser';
import {
  UpdateModelPlanCollaborator as UpdateModelPlanCollaboratorType,
  UpdateModelPlanCollaborator_updatePlanCollaborator as UpdateCollaboratorsType
} from 'queries/types/UpdateModelPlanCollaborator';
import UpdateModelPlanCollaborator from 'queries/UpdateModelPlanCollaborator';
import { CollaboratorForm } from 'types/collaborator';
import flattenErrors from 'utils/flattenErrors';
import translateTeamRole from 'utils/modelPlan';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

const Collaborators = () => {
  const client = useApolloClient();
  const { modelId } = useParams<{ modelId: string }>();
    const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const formikRef = useRef<FormikProps<CollaboratorForm>>(null);

  const history = useHistory();
  const [create] = useMutation<CreateCollaboratorsType>(
    CreateModelPlanCollaborator
  );
  const [update] = useMutation<UpdateModelPlanCollaboratorType>(
    UpdateModelPlanCollaborator
  );

  const { data } = useQuery<GetModelCollaborators>(
    GetModelPlanCollaborators,
    {
      variables: {
        id: modelId
      }
    }
  );

  const collaborators = (data?.modelPlan?.collaborators ??
    []) as GetCollaboratorsType[];

  const handleUpdateDraftModelPlan = (formikValues?: CollaboratorForm) => {
    const { fullName, teamRole, euaUserID } = formikValues || {};

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
      }).then(response => {
        if (!response?.errors) {
          history.push(`/models/new-plan/${modelId}/collaborators`);
        }
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
    // }
  };

  // load options using GQL CEDAR call
  const loadOptions = (inputValue: string) => {
    return client
      .query({
        query: GetCedarUser,
        variables: { commonName: inputValue }
      })
      .then(res => {
        return res.data.cedarPersonsByCommonName;
      });
  };

  const initialValues: CollaboratorForm = {
    euaUserID: '',
    fullName: '',
    teamRole: ''
  };

  const customStyles: StylesConfig = {
    option: (provided: any, state) => ({
      ...provided,
      color: 'white',
      padding: 10,
      backgroundColor: state.isSelected ? '#4c8bf5' : '#565c65',
      '&:hover': {
        borderColor: '#4c8bf5'
      }
    }),
    noOptionsMessage: provided => ({
      ...provided,
      color: 'white',
      padding: 10,
      backgroundColor: '565c65'
    }),
    control: base => ({
      ...base,
      border: '1px solid black',
      borderRadius: '0px',
      maxWidth: '30rem',
      width: '100%'
    }),
    menu: provided => ({
      ...provided,
      maxWidth: '30rem',
      width: '100%'
    }),
    menuList: provided => ({
      ...provided,
      borderRadius: '5px',
      border: '1px solid black',
      backgroundColor: '#565c65'
    }),
    indicatorsContainer: provided => ({
      ...provided,
      svg: {
        fill: 'black'
      }
    })
  };

  return (
    <MainContent className="margin-bottom-5">
      <div className="grid-container">
        <div className="desktop:grid-col-6">
          <PageHeading className="margin-top-6 margin-bottom-2">
            {t('addATeamMember')}
          </PageHeading>
          <div className="margin-bottom-6 line-height-body-6">
            {t('searchTeamInfo')}
          </div>

          <Formik
            initialValues={initialValues}
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

                      <AsyncSelect
                        styles={customStyles}
                        cacheOptions
                        getOptionLabel={(selectedUser: GetCedarUserType) =>
                          selectedUser.commonName
                        }
                        getOptionValue={(selectedUser: GetCedarUserType) =>
                          selectedUser.euaUserId
                        }
                        onChange={(selectedUser: GetCedarUserType) => {
                          setFieldValue('euaUserID', selectedUser?.euaUserId);
                          setFieldValue('fullName', selectedUser?.commonName);
                        }}
                        loadOptions={loadOptions}
                        defaultOptions
                      />
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
                        defaultValue=""
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
                        {t('addTeamMemberButton')}
                      </Button>
                    </div>
                  </Form>
                  {/* <AutoSave
                    values={values}
                    onSave={() => {
                      handleUpdateDraftModelPlan(formikRef?.current?.values);
                    }}
                    debounceDelay={3000}
                  /> */}
                </>
              );
            }}
          </Formik>
          <UswdsReactLink to={`/models/new-plan/${modelId}/collaborators`}>
            <span>&larr; </span> {t('dontAddTeamMember')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
