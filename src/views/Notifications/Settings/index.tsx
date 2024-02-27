import React, { useRef } from 'react';
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
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

type GetNotifcationSettingsType = GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | '__typename'
>;

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
    dailyDigestComplete: dailyDigestComplete ?? [],
    addedAsCollaborator: addedAsCollaborator ?? [],
    taggedInDiscussion: taggedInDiscussion ?? [],
    taggedInDiscussionReply: taggedInDiscussionReply ?? [],
    newDiscussionReply: newDiscussionReply ?? [],
    modelPlanShared: modelPlanShared ?? []
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

          <PageHeading className="margin-top-4 margin-bottom-2">
            {notificationsT('settings.heading')}
          </PageHeading>

          <p className="margin-bottom-6 font-body-md line-height-sans-4">
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
              const {
                errors,
                values,
                handleSubmit,
                setFieldValue
              } = formikProps;

              const flatErrors = flattenErrors(errors);

              return (
                <>
                  {Object.keys(errors).length > 0 && (
                    <ErrorAlert
                      testId="formik-validation-errors"
                      classNames="margin-top-3"
                      heading={miscellaneousT('checkAndFix')}
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

                  <Grid row>
                    <Grid mobile={{ col: 6 }}>
                      <h3>{notificationsT('settings.notification')}</h3>
                    </Grid>

                    <Grid mobile={{ col: 3 }}>
                      <h3>{notificationsT('settings.email')}</h3>
                    </Grid>

                    <Grid mobile={{ col: 3 }}>
                      <h3>{notificationsT('settings.inApp')}</h3>
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
                              <p className="text-wrap">
                                {notificationSettings[setting]}
                              </p>
                            </Grid>

                            <Grid mobile={{ col: 3 }}>
                              <Field
                                as={Checkbox}
                                id={`notification-setting-email-${setting}`}
                                className="padding-left-2"
                                name={setting}
                                value={values[setting]}
                                checked={values?.[setting].includes(
                                  UserNotificationPreferenceFlag.EMAIL_ONLY
                                )}
                                onChange={(
                                  value: UserNotificationPreferenceFlag
                                ) => {
                                  if (setting === 'taggedInDiscussion') {
                                    setFieldValue(
                                      'taggedInDiscussionReply',
                                      value
                                    );
                                  }
                                }}
                              />
                            </Grid>

                            <Grid mobile={{ col: 3 }}>
                              <Field
                                as={Checkbox}
                                id={`notification-setting-in-app-${setting}`}
                                className="padding-left-2"
                                name={setting}
                                value={values[setting]}
                                disabled
                                checked={values?.[setting].includes(
                                  UserNotificationPreferenceFlag.IN_APP_ONLY
                                )}
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
