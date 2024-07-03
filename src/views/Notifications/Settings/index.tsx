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
    datesChangedNotificationType,
    dataExchangeApproachCompleted
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
    if (!changes.datesChangedNotificationType && changes.datesChanged?.length) {
      // If datesChangedNotificationType is subscribed, then manually set datesChangedNotificationType to ALL_MODELS
      changes.datesChangedNotificationType =
        DatesChangedNotificationType.ALL_MODELS;
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
    // if loading, then abort
    if (loading) return;

    // if no unsubscribe email params, then abort
    if (!unsubscribeEmailParams) return;

    // if params are not valid, throw error
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
      (unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN &&
        !isSubscribedModelPlanEmail) ||
      (unsubscribeEmailParams === ActivityType.DATES_CHANGED &&
        !isSubscribedDatesChangedEmail)
    ) {
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
      params.delete('unsubscribe_email');
      history.replace({ search: params.toString() });
      return;
    }

    // Unsubscribe from New Model Plan email notifications
    if (
      unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN ||
      unsubscribeEmailParams === ActivityType.DATES_CHANGED
    ) {
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
      }

      params.delete('unsubscribe_email');
      history.replace({ search: params.toString() });
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
    datesChangedNotificationType: datesChangedNotificationType ?? undefined,
    dataExchangeApproachCompleted: dataExchangeApproachCompleted ?? []
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
                            {setting === 'newModelPlan' && (
                              <Grid mobile={{ col: 12 }}>
                                <h4 className="margin-top-5 margin-bottom-0">
                                  {notificationsT(
                                    'settings.sections.additionalNotifications.heading'
                                  )}
                                </h4>
                              </Grid>
                            )}
                            {setting === 'datesChanged' && (
                              <Grid mobile={{ col: 12 }}>
                                <h4 className="margin-top-5 margin-bottom-0">
                                  {notificationsT(
                                    'settings.sections.additionalNotifications.heading'
                                  )}
                                </h4>
                              </Grid>
                            )}
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
                                checked={(values?.[setting] ?? []).includes(
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
                                disabled={
                                  setting !== 'datesChanged' &&
                                  setting !== 'newModelPlan'
                                }
                                checked={(values?.[setting] ?? []).includes(
                                  UserNotificationPreferenceFlag.IN_APP
                                )}
                              />
                            </Grid>
                          </Grid>
                        );
                      })}

                      {/* Additional Notification Section */}
                      <Grid row>
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
