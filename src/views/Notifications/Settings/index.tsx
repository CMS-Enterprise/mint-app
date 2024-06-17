import React, { useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Checkbox,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  ActivityType,
  DatesChangedNotificationType,
  GetNotificationSettingsQuery,
  useGetNotificationSettingsQuery,
  UserNotificationPreferenceFlag,
  useUpdateNotificationSettingsMutation
} from 'gql/gen/graphql';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
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
  const whichModelType: Record<string, string> = notificationsT(
    'settings.additionalConfigurations.whichModelTypes',
    {
      returnObjects: true
    }
  );

  const formikRef = useRef<FormikProps<NotificationSettingsFormType>>(null);

  const { showMessage, showMessageOnNextPage } = useMessage();

  const history = useHistory();
  const { message } = useMessage();
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.search), [
    location.search
  ]);
  const unsubscribeEmailParams = params.get('unsubscribe_email');

  const { data, loading, error } = useGetNotificationSettingsQuery();

  const {
    dailyDigestComplete,
    addedAsCollaborator,
    taggedInDiscussion,
    newDiscussionReply,
    modelPlanShared,
    newModelPlan,
    datesChanged,
    datesChangedNotificationType
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

    // if datesChangedNotificationType is not changed by user, but datesChanged is changed, then do the following logic
    if (!changes.datesChangedNotificationType) {
      if (changes.datesChanged?.length) {
        // If Dates Changed notification is subscribed, then manually set datesChangedNotificationType to ALL_MODELS
        changes.datesChangedNotificationType =
          DatesChangedNotificationType.ALL_MODELS;
      } else {
        // If Dates Changed notification is unsubscribed, set datesChangedNotificationType to null
        changes.datesChangedNotificationType = null;
      }
    }

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
            <Alert
              type="success"
              slim
              data-testid="success-alert"
              className="margin-y-4"
            >
              {notificationsT('settings.successMessage')}
            </Alert>
          );
          history.push('/notifications');
        }
      })
      .catch(() => {
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            {notificationsT('settings.errorMessage')}
          </Alert>
        );
      });
  };

  // Unsubscribe from email
  useEffect(() => {
    const alreadyUnsubbed = () => {
      showMessage(
        <Alert
          type="error"
          slim
          data-testid="error-alert"
          className="margin-y-4"
        >
          <Trans
            t={notificationsT}
            i18nKey="settings.unsubscribedMessage.alreadyUnsubscribed"
            values={{
              notificationType: notificationsT(
                `settings.unsubscribedMessage.activityType.${unsubscribeEmailParams}`
              )
            }}
            components={{
              bold: <strong />
            }}
          />
        </Alert>
      );
    };
    const cleanUpParams = () => {
      params.delete('unsubscribe_email');
      history.replace({ search: params.toString() });
    };

    // if no unsubscribe email params, then abort
    if (loading) return;
    if (!unsubscribeEmailParams) return;
    // if params are not valid
    if (!Object.keys(ActivityType).includes(unsubscribeEmailParams)) {
      showMessage(
        <Alert
          type="error"
          slim
          data-testid="error-alert"
          className="margin-y-4"
        >
          {notificationsT('settings.unsubscribedMessage.error')}
        </Alert>
      );
      return;
    }

    // Setting variables
    // New Model Plan variables
    const isSubscribedModelPlanEmail = newModelPlan.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedModelPlanInApp = newModelPlan.includes(
      UserNotificationPreferenceFlag.IN_APP
    );
    // Dates Changed variables
    const isSubscribedDatesChangedEmail = datesChanged.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedDatesChangedInApp = datesChanged.includes(
      UserNotificationPreferenceFlag.IN_APP
    );

    // if already unsubscribed to new model plan email notifications and/or dates changed email notifications,
    // then show error alert banner
    if (
      unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN &&
      !isSubscribedModelPlanEmail
    ) {
      alreadyUnsubbed();
      cleanUpParams();
      return;
    }
    if (
      unsubscribeEmailParams === ActivityType.DATES_CHANGED &&
      !isSubscribedDatesChangedEmail
    ) {
      alreadyUnsubbed();
      cleanUpParams();
      return;
    }

    // Unsubscribe from New Model Plan email notifications
    if (
      (newModelPlan?.length || datesChanged?.length) &&
      (unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN ||
        unsubscribeEmailParams === ActivityType.DATES_CHANGED)
    ) {
      // // New Model Plan variables
      // const isSubscribedModelPlanEmail = newModelPlan.includes(
      //   UserNotificationPreferenceFlag.EMAIL
      // );
      // const isSubscribedModelPlanInApp = newModelPlan.includes(
      //   UserNotificationPreferenceFlag.IN_APP
      // );
      // // Dates Changed variables
      // const isSubscribedDatesChangedEmail = datesChanged.includes(
      //   UserNotificationPreferenceFlag.EMAIL
      // );
      // const isSubscribedDatesChangedInApp = datesChanged.includes(
      //   UserNotificationPreferenceFlag.IN_APP
      // );

      // if user has email notifications, then proceeed to unsubscribe
      if (isSubscribedModelPlanEmail || isSubscribedDatesChangedEmail) {
        let changes;
        // Adjust payload if New Model Plan in-app notifications are enabled
        if (unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN) {
          changes = {
            newModelPlan: isSubscribedModelPlanInApp
              ? [UserNotificationPreferenceFlag.IN_APP]
              : []
          };
        }
        // Adjust payload if Dates Changed in-app notifications are enabled
        if (unsubscribeEmailParams === ActivityType.DATES_CHANGED) {
          changes = {
            datesChanged: isSubscribedDatesChangedInApp
              ? [UserNotificationPreferenceFlag.IN_APP]
              : []
          };
        }

        // Proceed to update user notification preferences if changes are present
        if (changes) {
          update({ variables: { changes } })
            .then(response => {
              if (!response?.errors) {
                showMessage(
                  <Alert
                    type="success"
                    slim
                    data-testid="success-alert"
                    className="margin-y-4"
                  >
                    <Trans
                      t={notificationsT}
                      i18nKey="settings.unsubscribedMessage.success"
                      values={{
                        notificationType: notificationsT(
                          `settings.unsubscribedMessage.activityType.${unsubscribeEmailParams}`
                        )
                      }}
                      components={{
                        bold: <strong />
                      }}
                    />
                  </Alert>
                );
              }
            })
            .catch(() => {
              showMessage(
                <Alert
                  type="error"
                  slim
                  data-testid="error-alert"
                  className="margin-y-4"
                >
                  {notificationsT('settings.unsubscribedMessage.error')}
                </Alert>
              );
            });
        }
      } else {
        // if already unsubscribed to new model plan email notifications
        showMessage(
          <Alert
            type="error"
            slim
            data-testid="error-alert"
            className="margin-y-4"
          >
            <Trans
              t={notificationsT}
              i18nKey="settings.unsubscribedMessage.alreadyUnsubscribed"
              values={{
                notificationType: notificationsT(
                  `settings.unsubscribedMessage.activityType.${unsubscribeEmailParams}`
                )
              }}
              components={{
                bold: <strong />
              }}
            />
          </Alert>
        );
      }

      cleanUpParams();
    }
  }, [
    datesChanged,
    history,
    loading,
    newModelPlan,
    notificationsT,
    params,
    showMessage,
    unsubscribeEmailParams,
    update
  ]);

  const initialValues: NotificationSettingsFormType = {
    dailyDigestComplete: dailyDigestComplete ?? [],
    addedAsCollaborator: addedAsCollaborator ?? [],
    taggedInDiscussion: taggedInDiscussion ?? [],
    newDiscussionReply: newDiscussionReply ?? [],
    modelPlanShared: modelPlanShared ?? [],
    newModelPlan: newModelPlan ?? [],
    datesChanged: datesChanged ?? [],
    datesChangedNotificationType: datesChangedNotificationType ?? null
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

          {message && <Expire delay={45000}>{message}</Expire>}

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
              const {
                dirty,
                handleSubmit,
                setFieldValue,
                values
              } = formikProps;

              type Obj = { [key: string]: any };

              /**
               * Returns an object containing the keys and values from `obj1` that also exist in `obj2`.
               *
               * @param obj1 - The first object to compare.
               * @param obj2 - The second object to compare.
               * @returns An object containing the matching keys and values from `obj1`.
               */
              const getMatchingKeys = (obj1: Obj, obj2: Obj): Obj =>
                Object.keys(obj1)
                  .filter(key =>
                    Object.prototype.hasOwnProperty.call(obj2, key)
                  )
                  .reduce((acc, key) => {
                    acc[key] = obj1[key];
                    return acc;
                  }, {} as Obj);

              const basicNotificationKeys = getMatchingKeys(
                values,
                notificationSettings
              );

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
                                checked={basicNotificationKeys[
                                  setting
                                ].includes(
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
                                checked={basicNotificationKeys[
                                  setting
                                ].includes(
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
                              'settings.additionalConfigurations.NEW_MODEL_PLAN'
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

                        <Grid mobile={{ col: 6 }}>
                          <p className="text-wrap margin-y-105">
                            {notificationsT(
                              'settings.additionalConfigurations.datesChanged'
                            )}
                          </p>
                        </Grid>

                        <Grid mobile={{ col: 3 }}>
                          <Field
                            as={Checkbox}
                            id="notification-setting-email-datesChanged"
                            data-testid="notification-setting-email-datesChanged"
                            className="padding-left-2"
                            name="datesChanged"
                            value={UserNotificationPreferenceFlag.EMAIL}
                            checked={values?.datesChanged.includes(
                              UserNotificationPreferenceFlag.EMAIL
                            )}
                          />
                        </Grid>

                        <Grid mobile={{ col: 3 }}>
                          <Field
                            as={Checkbox}
                            id="notification-setting-in-app-datesChanged"
                            data-testid="notification-setting-in-app-datesChanged"
                            className="padding-left-2"
                            name="datesChanged"
                            value={UserNotificationPreferenceFlag.IN_APP}
                            checked={values?.datesChanged.includes(
                              UserNotificationPreferenceFlag.IN_APP
                            )}
                          />
                        </Grid>

                        <Grid
                          className="tablet:padding-left-3"
                          tablet={{ col: 6 }}
                        >
                          <Label
                            htmlFor="notification-setting-whichModel"
                            className="text-normal margin-top-0"
                          >
                            {notificationsT(
                              'settings.additionalConfigurations.whichModel'
                            )}
                          </Label>

                          <Field
                            as={Select}
                            id="notification-setting-whichModel"
                            data-testid="notification-setting-whichModel"
                            name="datesChangedNotificationType"
                            value={values.datesChangedNotificationType}
                            disabled={!values.datesChanged.length}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue(
                                'datesChangedNotificationType',
                                e.target.value
                              );
                            }}
                          >
                            {/* TODO: if datesChanged.length is 0, then default to empty */}
                            {getKeys(whichModelType).map(type => {
                              return (
                                <option key={type} value={type}>
                                  {whichModelType[type]}
                                </option>
                              );
                            })}
                          </Field>
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
