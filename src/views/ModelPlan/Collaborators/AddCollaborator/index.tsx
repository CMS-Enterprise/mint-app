import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, ComboBox, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import UpdateDraftModelPlan from 'queries/UpdateDraftModelPlan';
import flattenErrors from 'utils/flattenErrors';

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');

  const history = useHistory();
  const [mutate] = useMutation(UpdateDraftModelPlan);

  const handleUpdateDraftModelPlan = (formikValues: { modelName: string }) => {
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
        name: 'John Doe',
        eua: 'ABCD'
      }
    ];
  }, []);

  const users = useMemo(() => {
    const userObj: any = {}; // TODO: Replace with CEDAR user type

    userMocks.forEach(user => {
      userObj[user.id] = user;
    });

    return userObj;
  }, [userMocks]);

  const projectComboBoxOptions = useMemo(() => {
    const queriedUsers = userMocks || [];
    return queriedUsers.map(user => {
      const { id, eua, name } = user;
      return {
        label: `${name} - ${eua}`,
        value: id
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
            initialValues={{ modelName: '' }}
            onSubmit={handleUpdateDraftModelPlan}
            // validationSchema={NewModelPlanValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<{ modelName: string }>) => {
              const {
                errors,
                setErrors,
                setFieldValue,
                handleSubmit,
                isValid,
                dirty
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
                      scrollElement="modelName"
                      error={!!flatErrors.modelName}
                    >
                      <Label htmlFor="new-plan-model-name">
                        {t('teamMemberName')}
                      </Label>
                      <DescriptionDefinition
                        className="line-height-body-3 text-base-dark"
                        definition={t('teamNameInfo')}
                      />
                      <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
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
                          const selectedUser = users[user];
                          if (selectedUser) {
                            setFieldValue('requestName', selectedUser.name);
                          }
                        }}
                      />
                    </FieldGroup>
                    {/* <div className="margin-top-5 display-block">
                      <UswdsReactLink
                        className="usa-button usa-button--outline"
                        variant="unstyled"
                        to="/models/steps-overview"
                      >
                        {h('cancel')}
                      </UswdsReactLink>
                      <Button
                        type="submit"
                        disabled={!(dirty && isValid)}
                        onClick={() => setErrors({})}
                      >
                        {h('next')}
                      </Button>
                    </div> */}
                  </Form>
                </>
              );
            }}
          </Formik>

          <UswdsReactLink
            className="usa-button margin-top-2"
            variant="unstyled"
            to="/models/steps-overview"
          >
            {t('addTeamMemberButton')}
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
