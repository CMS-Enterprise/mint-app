import React, { useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Fieldset,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  ActivityType,
  DataExchangeApproachMarkedCompleteNotificationType,
  DatesChangedNotificationType,
  GetNotificationSettingsQuery,
  NewDiscussionAddedNotificationType,
  useGetNotificationSettingsQuery,
  UserNotificationPreferenceFlag,
  useUpdateNotificationSettingsMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Expire from 'components/Expire';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import useMessage from 'hooks/useMessage';
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formUtil';
import { tObject } from 'utils/translation';

type GetNotifcationSettingsType =
  GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | 'taggedInDiscussionReply' | '__typename'
>;

const NotificationSettings = () => {
  const { t: notificationsT } = useTranslation('notifications');

  const notificationSettings = tObject<
    keyof NotificationSettingsFormType,
    string
  >('notifications:settings.configurations');

  const whichModelType = tObject<string, string>(
    'notifications:settings.additionalConfigurations.whichModelTypes'
  );

  const formikRef = useRef<FormikProps<NotificationSettingsFormType>>(null);

  const { showMessage } = useMessage();

  const navigate = useNavigate();
  const { message } = useMessage();
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const { setErrorMeta } = useErrorMessage();

  const unsubscribeEmailParams = params.get('unsubscribe_email');

  const { data, loading, error } = useGetNotificationSettingsQuery();

  const {
    dailyDigestComplete,
    addedAsCollaborator,
    taggedInDiscussion,
    newDiscussionAdded,
    newDiscussionAddedNotificationType,
    newDiscussionReply,
    modelPlanShared,
    incorrectModelStatus,
    newModelPlan,
    datesChanged,
    datesChangedNotificationType,
    dataExchangeApproachMarkedComplete,
    dataExchangeApproachMarkedCompleteNotificationType
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

    // if newDiscussionAddedNotificationType is not changed by user, but newDiscussionAdded is changed, then do the following logic
    if (
      !changes.newDiscussionAddedNotificationType &&
      changes.newDiscussionAdded?.length
    ) {
      // If newDiscussionAddedNotificationType is subscribed, then manually set newDiscussionAddedNotificationType to ALL_MODELS
      changes.newDiscussionAddedNotificationType =
        NewDiscussionAddedNotificationType.ALL_MODELS;
    }

    // if dataExchangeApproachMarkedCompleteNotificationType is not changed by user, but dataExchangeApproachMarkedComplete is changed, then do the following logic
    if (
      !changes.dataExchangeApproachMarkedCompleteNotificationType &&
      changes.dataExchangeApproachMarkedComplete?.length
    ) {
      // If dataExchangeApproachMarkedCompleteNotificationType is subscribed, then manually set dataExchangeApproachMarkedCompleteNotificationType to ALL_MODELS
      changes.dataExchangeApproachMarkedCompleteNotificationType =
        DataExchangeApproachMarkedCompleteNotificationType.ALL_MODELS;
    }

    if (dirtyInputs.taggedInDiscussion) {
      changes.taggedInDiscussionReply = dirtyInputs.taggedInDiscussion;
    }

    setErrorMeta({
      overrideMessage: notificationsT('settings.errorMessage')
    });

    update({
      variables: {
        changes
      }
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(notificationsT('settings.successMessage'));

        navigate('/notifications');
      }
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

    // Incorrect Model Status variables
    const isSubscribedIncorrectModelStatusEmail = incorrectModelStatus.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedIncorrectModelStatusInApp = incorrectModelStatus.includes(
      UserNotificationPreferenceFlag.IN_APP
    );

    // New Model Plan variables
    const isSubscribedModelPlanEmail = newModelPlan.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedModelPlanInApp = newModelPlan.includes(
      UserNotificationPreferenceFlag.IN_APP
    );

    // New Discussion variables
    const isSubscribedNewDiscussionAddedEmail = newDiscussionAdded.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedNewDiscussionAddedInApp = newDiscussionAdded.includes(
      UserNotificationPreferenceFlag.IN_APP
    );

    // Dates Changed variables
    const isSubscribedDatesChangedEmail = datesChanged.includes(
      UserNotificationPreferenceFlag.EMAIL
    );
    const isSubscribedDatesChangedInApp = datesChanged.includes(
      UserNotificationPreferenceFlag.IN_APP
    );
    // Data Exchange Approach Marked Complete variables
    const isSubscribedDataExchangeApproachMarkedCompleteEmail =
      dataExchangeApproachMarkedComplete.includes(
        UserNotificationPreferenceFlag.EMAIL
      );

    const isSubscribedDataExchangeApproachMarkedCompleteInApp =
      dataExchangeApproachMarkedComplete.includes(
        UserNotificationPreferenceFlag.IN_APP
      );

    // if already unsubscribed to new model plan email notifications and/or dates changed email notifications,
    // then show error alert banner
    if (
      (unsubscribeEmailParams === ActivityType.INCORRECT_MODEL_STATUS &&
        !isSubscribedIncorrectModelStatusEmail) ||
      (unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN &&
        !isSubscribedModelPlanEmail) ||
      (unsubscribeEmailParams === ActivityType.NEW_DISCUSSION_ADDED &&
        !isSubscribedNewDiscussionAddedEmail) ||
      (unsubscribeEmailParams === ActivityType.DATES_CHANGED &&
        !isSubscribedDatesChangedEmail) ||
      (unsubscribeEmailParams ===
        ActivityType.DATA_EXCHANGE_APPROACH_MARKED_COMPLETE &&
        !isSubscribedDataExchangeApproachMarkedCompleteEmail)
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
      navigate({ search: params.toString() }, { replace: true });
      return;
    }

    // Unsubscribe from email notifications
    if (
      unsubscribeEmailParams === ActivityType.INCORRECT_MODEL_STATUS ||
      unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN ||
      unsubscribeEmailParams === ActivityType.NEW_DISCUSSION_ADDED ||
      unsubscribeEmailParams === ActivityType.DATES_CHANGED ||
      unsubscribeEmailParams ===
        ActivityType.DATA_EXCHANGE_APPROACH_MARKED_COMPLETE
    ) {
      // if user has email notifications, then proceeed to unsubscribe
      if (
        isSubscribedIncorrectModelStatusEmail ||
        isSubscribedModelPlanEmail ||
        isSubscribedNewDiscussionAddedEmail ||
        isSubscribedDatesChangedEmail ||
        isSubscribedDataExchangeApproachMarkedCompleteEmail
      ) {
        let changes;
        // Adjust payload if Incorrect Model Status in-app notifications are enabled
        if (unsubscribeEmailParams === ActivityType.INCORRECT_MODEL_STATUS) {
          changes = {
            incorrectModelStatus: isSubscribedIncorrectModelStatusInApp
              ? [UserNotificationPreferenceFlag.IN_APP]
              : []
          };
        }

        // Adjust payload if New Model Plan in-app notifications are enabled
        if (unsubscribeEmailParams === ActivityType.NEW_MODEL_PLAN) {
          changes = {
            newModelPlan: isSubscribedModelPlanInApp
              ? [UserNotificationPreferenceFlag.IN_APP]
              : []
          };
        }
        // Adjust payload if New Discussion Added in-app notifications are enabled
        if (unsubscribeEmailParams === ActivityType.NEW_DISCUSSION_ADDED) {
          changes = {
            newDiscussionAdded: isSubscribedNewDiscussionAddedInApp
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
        // Adjust payload if Data Exchange Approach in-app notifications are enabled
        if (
          unsubscribeEmailParams ===
          ActivityType.DATA_EXCHANGE_APPROACH_MARKED_COMPLETE
        ) {
          changes = {
            dataExchangeApproachMarkedComplete:
              isSubscribedDataExchangeApproachMarkedCompleteInApp
                ? [UserNotificationPreferenceFlag.IN_APP]
                : []
          };
        }

        // Proceed to update user notification preferences if changes are present
        if (changes) {
          setErrorMeta({
            overrideMessage: notificationsT(
              'settings.unsubscribedMessage.error'
            )
          });

          update({ variables: { changes } }).then(response => {
            if (!response?.errors) {
              toastSuccess(
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
              );
            }
          });
        }
      }

      params.delete('unsubscribe_email');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [
    dataExchangeApproachMarkedComplete,
    datesChanged,
    navigate,
    loading,
    newModelPlan,
    notificationsT,
    params,
    showMessage,
    unsubscribeEmailParams,
    update,
    setErrorMeta,
    newDiscussionAdded,
    incorrectModelStatus
  ]);

  const initialValues: NotificationSettingsFormType = {
    dailyDigestComplete: dailyDigestComplete ?? [],
    addedAsCollaborator: addedAsCollaborator ?? [],
    taggedInDiscussion: taggedInDiscussion ?? [],
    newDiscussionAdded: newDiscussionAdded ?? [],
    newDiscussionAddedNotificationType:
      newDiscussionAddedNotificationType ?? undefined,
    newDiscussionReply: newDiscussionReply ?? [],
    incorrectModelStatus: incorrectModelStatus ?? [],
    modelPlanShared: modelPlanShared ?? [],
    newModelPlan: newModelPlan ?? [],
    datesChanged: datesChanged ?? [],
    datesChangedNotificationType: datesChangedNotificationType ?? undefined,
    dataExchangeApproachMarkedComplete:
      dataExchangeApproachMarkedComplete ?? [],
    dataExchangeApproachMarkedCompleteNotificationType:
      dataExchangeApproachMarkedCompleteNotificationType ?? undefined
  };

  const getModelsSelectValue = (
    setting: keyof NotificationSettingsFormType,
    values: NotificationSettingsFormType
  ) => {
    switch (setting) {
      case 'newDiscussionAdded':
        return values.newDiscussionAddedNotificationType;
      case 'datesChanged':
        return values.datesChangedNotificationType;
      case 'dataExchangeApproachMarkedComplete':
        return values.dataExchangeApproachMarkedCompleteNotificationType;
      default:
        return '';
    }
  };

  if ((!loading && error) || (!loading && !data?.currentUser)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent data-testid="notification-setting-page">
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs
            className="margin-bottom-4"
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.NOTIFICATIONS
            ]}
            customItem={notificationsT('settings.heading')}
          />

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
              const { dirty, handleSubmit, setFieldValue, values } =
                formikProps;

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

                  <MINTForm
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      handleSubmit(e);
                    }}
                  >
                    <Fieldset disabled={!!error || loading}>
                      {getKeys(notificationSettings).map(setting => {
                        return (
                          <React.Fragment key={setting}>
                            {setting === 'incorrectModelStatus' && (
                              <Grid row>
                                <Grid mobile={{ col: 6 }}>
                                  <h4 className="margin-top-5 margin-bottom-0">
                                    {notificationsT(
                                      'settings.sections.notificationAboutMyModels.heading'
                                    )}
                                  </h4>
                                  <p className="margin-top-0 margin-bottom-1 text-base-dark">
                                    {notificationsT(
                                      'settings.sections.notificationAboutMyModels.subHeading'
                                    )}
                                  </p>
                                  <div className="display-flex flex-align-center bg-base-lightest padding-x-2">
                                    <Icon.InfoOutline
                                      size={3}
                                      className="margin-right-1"
                                      aria-label="info icon"
                                    />
                                    <p className="text-italic">
                                      <Trans
                                        i18nKey="notifications:settings:sections:notificationAboutMyModels:info"
                                        values={{
                                          count:
                                            data?.currentUser
                                              .leadModelPlanCount || 0
                                        }}
                                      />
                                    </p>
                                  </div>
                                </Grid>
                              </Grid>
                            )}
                            <Grid row>
                              {setting === 'newModelPlan' && (
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
                                    setting !== 'incorrectModelStatus' &&
                                    setting !== 'datesChanged' &&
                                    setting !== 'newDiscussionAdded' &&
                                    setting !== 'newModelPlan' &&
                                    setting !==
                                      'dataExchangeApproachMarkedComplete'
                                  }
                                  checked={(values?.[setting] ?? []).includes(
                                    UserNotificationPreferenceFlag.IN_APP
                                  )}
                                />
                              </Grid>
                            </Grid>
                            {(setting === 'datesChanged' ||
                              setting ===
                                'dataExchangeApproachMarkedComplete' ||
                              setting === 'newDiscussionAdded') && (
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
                                    data-testid={`notification-setting-whichModel-${setting}`}
                                    name={`${setting}NotificationType`}
                                    value={
                                      getModelsSelectValue(setting, values)
                                      // setting === 'datesChanged'
                                      //   ? values.datesChangedNotificationType
                                      //   : values.dataExchangeApproachMarkedCompleteNotificationType
                                    }
                                    disabled={!values[setting].length}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      setFieldValue(
                                        `${setting}NotificationType`,
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
                            )}
                          </React.Fragment>
                        );
                      })}

                      <div className="margin-top-6 margin-bottom-3">
                        <Button type="submit" disabled={!dirty}>
                          {notificationsT('settings.save')}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => navigate('/notifications')}
                      >
                        <Icon.ArrowBack
                          className="margin-right-1"
                          aria-hidden
                          aria-label="back"
                        />

                        {notificationsT('settings.dontUpdate')}
                      </Button>
                    </Fieldset>
                  </MINTForm>
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
