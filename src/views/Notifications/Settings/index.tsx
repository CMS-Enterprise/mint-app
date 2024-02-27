import React, { Fragment, useRef } from 'react';
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
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formDiff';
import sanitizeStatus from 'utils/status';
import { NotFoundPartial } from 'views/NotFound';

type GetNotifcationSettingsType = GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | '__typename'
>;

export const calculateNotificationSetting = (
  values: GetNotifcationSettingsType,
  field: keyof NotificationSettingsFormType
) => {
  const currentValue = values[field];
};

const NotificationSettings = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: notificationsT } = useTranslation('notifications');

  const notificationSettings: Record<
    keyof NotificationSettingsFormType,
    string
  > = notificationsT('settings.configurations', { returnObjects: true });

  const formikRef = useRef<FormikProps<NotificationSettingsFormType>>(null);

  const history = useHistory();

  const { data, loading, error } = useGetNotificationSettingsQuery();

  const {
    dailyDigestComplete,
    addedAsCollaborator,
    taggedInDiscussion,
    taggedInDiscussionReply,
    newDiscussionReply,
    modelPlanShared
  } = (data?.currentUser.notificationPreferences ||
    {}) as GetNotifcationSettingsType;

  const [update] = useUpdateNotificationSettingsMutation();

  const handleFormSubmit = () => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    if (dirtyInputs.status) {
      dirtyInputs.status = sanitizeStatus(dirtyInputs.status);
    }

    update({
      variables: {
        changes: dirtyInputs
      }
    })
      .then(response => {
        if (!response?.errors) {
          history.push('/notifications');
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: NotificationSettingsFormType = {
    dailyDigestComplete: dailyDigestComplete ?? null,
    addedAsCollaborator: addedAsCollaborator ?? null,
    taggedInDiscussion: taggedInDiscussion ?? null,
    taggedInDiscussionReply: taggedInDiscussionReply ?? null,
    newDiscussionReply: newDiscussionReply ?? null,
    modelPlanShared: modelPlanShared ?? null
  };

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="new-plan">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
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

          <PageHeading className="margin-top-4 margin-bottom-2">
            {notificationsT('settings.heading')}
          </PageHeading>

          <p className="margin-bottom-6 font-body-md line-height-sans-4">
            {notificationsT('settings.subHeading')}
          </p>

          <Grid row>
            <Grid desktop={{ col: 6 }}>
              <h3>{notificationsT('settings.notification')}</h3>
            </Grid>

            <Grid desktop={{ col: 3 }}>
              <h3>{notificationsT('settings.email')}</h3>
            </Grid>

            <Grid desktop={{ col: 3 }}>
              <h3>{notificationsT('settings.inApp')}</h3>
            </Grid>
          </Grid>

          <Formik
            initialValues={initialValues}
            onSubmit={() => {
              handleFormSubmit();
            }}
            enableReinitialize
            innerRef={formikRef}
          >
            {(formikProps: FormikProps<NotificationSettingsFormType>) => {
              const { handleSubmit, values } = formikProps;

              return (
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    {getKeys(notificationSettings).map(setting => {
                      return (
                        <Grid row key={setting}>
                          <Grid desktop={{ col: 6 }}>
                            <p>{notificationSettings[setting]}</p>
                          </Grid>

                          <Grid desktop={{ col: 3 }}>
                            <Field
                              as={Checkbox}
                              id={`notification-setting-email-${setting}`}
                              className="padding-left-2"
                              name={setting}
                              value={values[setting]}
                              checked={
                                values?.[setting] ===
                                  UserNotificationPreferenceFlag.ALL ||
                                values?.[setting] ===
                                  UserNotificationPreferenceFlag.EMAIL_ONLY
                              }
                            />
                          </Grid>

                          <Grid desktop={{ col: 3 }}>
                            <Field
                              as={Checkbox}
                              id={`notification-setting-in-app-${setting}`}
                              className="padding-left-2"
                              name={setting}
                              value={values[setting]}
                              checked={
                                values?.[setting] ===
                                  UserNotificationPreferenceFlag.ALL ||
                                values?.[setting] ===
                                  UserNotificationPreferenceFlag.IN_APP_ONLY
                              }
                            />
                          </Grid>
                        </Grid>
                      );
                    })}

                    <div className="margin-top-6 margin-bottom-3">
                      <Button type="submit">
                        {notificationsT('settings.save')}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      className="usa-button usa-button--unstyled"
                      onClick={() => history.push('/notifications')}
                    >
                      <Icon.ArrowBack className="margin-right-1" aria-hidden />

                      {notificationsT('settings.dontUpdate')}
                    </Button>
                  </Fieldset>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationSettings;
