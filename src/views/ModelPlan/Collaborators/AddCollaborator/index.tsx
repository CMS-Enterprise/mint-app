import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, ComboBox, Dropdown, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { isValid } from 'js-base64';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { DescriptionDefinition } from 'components/shared/DescriptionGroup';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import teamRoles from 'constants/enums/teamRoles';
import UpdateDraftModelPlan from 'queries/UpdateDraftModelPlan';
import { CollaboratorForm } from 'types/collaborator';
import flattenErrors from 'utils/flattenErrors';
import CollaboratorsValidationSchema from 'validations/modelPlanCollaborators';

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const formikRef = useRef<FormikProps<CollaboratorForm>>(null);

  const history = useHistory();
  const [mutate] = useMutation(UpdateDraftModelPlan);

  const handleUpdateDraftModelPlan = (formikValues?: CollaboratorForm) => {
    console.log('hey');
    // const { modelName } = formikValues;
    // mutate({
    //   variables: {
    //     input: {
    //       modelName
    //     }
    //   }
    // }).then(response => {
    //   if (!response?.errors) {
    //     const { id } = response?.data?.createModelPlan;
    //     history.push(`/models/new-plan/${id}/collaborators`);
    //   }
    // });
  };

  // TODO: Replace mocked data with call to CEDAR for users
  const userMocks = useMemo(() => {
    return [
      {
        id: '123',
        fullName: 'John Doe',
        euaUserID: 'ABCD',
        teamRole: 'MODEL_LEAD'
      },
      {
        id: '456',
        fullName: 'Jane Oddball',
        euaUserID: 'WASD',
        teamRole: 'MODEL_LEAD'
      }
    ];
  }, []);

  const initialValues: CollaboratorForm = {
    fullName: '',
    teamRole: ''
  };

  // Convert user to obj for keying selected user in combobox
  const users = useMemo(() => {
    const userObj: any = {}; // TODO: Replace with CEDAR user type

    userMocks.forEach(user => {
      userObj[user.id] = user;
    });

    return userObj;
  }, [userMocks]);

  const projectComboBoxOptions = useMemo(() => {
    return (userMocks || []).map(user => {
      return {
        label: `${user.fullName} - ${user.euaUserID}`,
        value: user.id
      };
    });
  }, [userMocks]);

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
                      <Label htmlFor="new-plan-model-name">
                        {t('teamMemberName')}
                      </Label>
                      <DescriptionDefinition
                        className="line-height-body-3 text-base-dark"
                        definition={t('teamNameInfo')}
                      />
                      <FieldErrorMsg>{flatErrors.fullName}</FieldErrorMsg>
                      <ComboBox
                        id="collaborator-user"
                        name="collaboratorComboBox"
                        inputProps={{
                          id: 'collaborator-user',
                          name: 'collaborator',
                          'aria-label': 'application',
                          'aria-describedby': 'Draft-Model-Plan-Collaborator'
                        }}
                        options={projectComboBoxOptions}
                        onChange={(user: any) => {
                          setFieldValue('fullName', users[user]?.fullName);
                        }}
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
                        {teamRoles.map(roles => {
                          const { id, name } = roles;
                          return (
                            <option
                              key={`Collaborator-Role-${name}`}
                              value={id}
                            >
                              {name}
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
                  <AutoSave
                    values={values}
                    onSave={() => {
                      handleUpdateDraftModelPlan(formikRef?.current?.values);
                    }}
                    debounceDelay={3000}
                  />
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
