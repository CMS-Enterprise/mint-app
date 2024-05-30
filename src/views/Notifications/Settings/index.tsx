import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Checkbox,
  Fieldset,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetNotificationSettingsQuery,
  useGetNotificationSettingsQuery,
  UserNotificationPreferenceFlag,
  useUpdateNotificationSettingsMutation
} from 'gql/gen/graphql';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

type GetNotifcationSettingsType = GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | 'taggedInDiscussionReply' | '__typename'
>;

const NotificationSettings = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: notificationsT } = useTranslation('notifications');

  const notificationSettings: Record<
    keyof NotificationSettingsFormType,
    string
  > = notificationsT('settings.configurations', {
    returnObjects: true
  });

  const formikRef = useRef<FormikProps<NotificationSettingsFormType>>(null);

  const { showMessageOnNextPage } = useMessage();

  const history = useHistory();

  const [mutationError, setMutationError] = useState<string>('');

  const { data, loading, error } = useGetNotificationSettingsQuery();

  const {
    dailyDigestComplete,
    addedAsCollaborator,
    taggedInDiscussion,
    newDiscussionReply,
    modelPlanShared,
    newModelPlan
  } = (data?.currentUser.notificationPreferences ||
    {}) as GetNotifcationSettingsType;

  const [update] = useUpdateNotificationSettingsMutation();

  const handleFormSubmit = () => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    const changes = {
      ...dirtyInputs
    };

    if (dirtyInputs.taggedInDiscussion) {
      changes.taggedInDiscussionReply = dirtyInputs.taggedInDiscussion;
    }

    update({
      variables: {
        changes
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
                {notificationsT('settings.success')}
              </Alert>
            </>
          );
          history.push('/notifications');
        }
      })
      .catch(() => {
        setMutationError(notificationsT('settings.error'));
      });
  };

  const initialValues: NotificationSettingsFormType = {
    dailyDigestComplete: dailyDigestComplete ?? [],
    addedAsCollaborator: addedAsCollaborator ?? [],
    taggedInDiscussion: taggedInDiscussion ?? [],
    newDiscussionReply: newDiscussionReply ?? [],
    modelPlanShared: modelPlanShared ?? [],
    newModelPlan: newModelPlan ?? []
  };

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="new-plan">
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{miscellaneousT('home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/notifications">
                <span>{notificationsT('breadcrumb')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>
              {notificationsT('settings.heading')}
            </Breadcrumb>
          </BreadcrumbBar>

          {mutationError && (
            <Alert type="error" slim className="margin-y-4" headingLevel="h4">
              {mutationError}
            </Alert>
          )}

          <PageHeading className="margin-top-4 margin-bottom-2">
            {notificationsT('settings.heading')}
          </PageHeading>

          <p className="margin-bottom-6 font-body-lg line-height-sans-4">
            {notificationsT('settings.subHeading')}
          </p>

          <Formik
            initialValues={initialValues}
            onSubmit={() => {
              handleFormSubmit();
            }}
            enableReinitialize
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<NotificationSettingsFormType>) => {
              const { values, handleSubmit, dirty } = formikProps;

              return (
                <>
                  <Grid row>
                    <Grid mobile={{ col: 6 }}>
                      <h3 className="margin-bottom-3 padding-bottom-105 margin-top-0 border-bottom border-ink">
                        {notificationsT('settings.notification')}
                      </h3>
                    </Grid>

                    <Grid mobile={{ col: 3 }}>
                      <h3 className="margin-bottom-3 padding-bottom-105 margin-top-0 border-bottom border-ink">
                        {notificationsT('settings.email')}
                      </h3>
                    </Grid>

                    <Grid mobile={{ col: 3 }}>
                      <h3 className="margin-bottom-3 padding-bottom-105 margin-top-0 border-bottom border-ink">
                        {notificationsT('settings.inApp')}
                      </h3>
                    </Grid>

                    <Grid mobile={{ col: 6 }}>
                      <h4 className="margin-top-0 margin-bottom-05">
                        {notificationsT(
                          'settings.sections.basicNotifications.heading'
                        )}
                      </h4>
                      <p className="margin-top-0 margin-bottom-1 text-base-dark">
                        {notificationsT(
                          'settings.sections.basicNotifications.subHeading'
                        )}
                      </p>
                    </Grid>
                  </Grid>

                  <Form
                    onSubmit={e => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={!!error || loading}>
                      {getKeys(notificationSettings).map(setting => {
                        return (
                          <Grid row key={setting}>
                            <Grid mobile={{ col: 6 }}>
                              <p className="text-wrap margin-y-105">
                                {notificationSettings[setting]}
                              </p>
                            </Grid>

                            <Grid mobile={{ col: 3 }}>
                              <Field
                                as={Checkbox}
                                id={`notification-setting-email-${setting}`}
                                data-testid={`notification-setting-email-${setting}`}
                                className="padding-left-2"
                                name={setting}
                                value={UserNotificationPreferenceFlag.EMAIL}
                                checked={values?.[setting].includes(
                                  UserNotificationPreferenceFlag.EMAIL
                                )}
                              />
                            </Grid>

                            <Grid mobile={{ col: 3 }}>
                              <Field
                                as={Checkbox}
                                id={`notification-setting-in-app-${setting}`}
                                data-testid={`notification-setting-in-app-${setting}`}
                                className="padding-left-2"
                                name={setting}
                                value={UserNotificationPreferenceFlag.IN_APP}
                                disabled
                                checked={values?.[setting].includes(
                                  UserNotificationPreferenceFlag.IN_APP
                                )}
                              />
                            </Grid>
                          </Grid>
                        );
                      })}

                      {/* Additional Notification Section */}
                      <Grid row>
                        <Grid mobile={{ col: 12 }}>
                          <h4 className="margin-top-5 margin-bottom-0">
                            {notificationsT(
                              'settings.sections.additionalNotifications.heading'
                            )}
                          </h4>
                        </Grid>

                        <Grid mobile={{ col: 6 }}>
                          <p className="text-wrap margin-y-105">
                            {notificationsT(
                              'settings.additionalConfigurations.modelCreation'
                            )}
                          </p>
                        </Grid>
                        <Grid mobile={{ col: 3 }}>
                          <Field
                            as={Checkbox}
                            id="notification-setting-email-newModelPlan"
                            data-testid="notification-setting-email-newModelPlan"
                            className="padding-left-2"
                            name="newModelPlan"
                            value={UserNotificationPreferenceFlag.EMAIL}
                            checked={values?.newModelPlan.includes(
                              UserNotificationPreferenceFlag.EMAIL
                            )}
                          />
                        </Grid>

                        <Grid mobile={{ col: 3 }}>
                          <Field
                            as={Checkbox}
                            id="notification-setting-in-app-newModelPlan"
                            data-testid="notification-setting-in-app-newModelPlan"
                            className="padding-left-2"
                            name="newModelPlan"
                            value={UserNotificationPreferenceFlag.IN_APP}
                            checked={values?.newModelPlan.includes(
                              UserNotificationPreferenceFlag.IN_APP
                            )}
                          />
                        </Grid>
                      </Grid>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button type="submit" disabled={!dirty}>
                          {notificationsT('settings.save')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => history.push('/notifications')}
                      >
                        <Icon.ArrowBack
                          className="margin-right-1"
                          aria-hidden
                        />

                        {notificationsT('settings.dontUpdate')}
                      </Button>
                    </Fieldset>
                  </Form>
                </>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationSettings;
