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
import classNames from 'classnames';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetNotificationSettingsQuery,
  useGetNotificationSettingsQuery,
  UserNotificationPreferenceFlag,
  useUpdateNotificationSettingsMutation
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Expire from 'components/Expire';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { statusAlert, useErrorMessage } from 'contexts/ErrorContext';
import useMessage from 'hooks/useMessage';
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formUtil';
import { tObject } from 'utils/translation';

import {
  UnsubscribableActivities,
  verifyEmailParams
} from '../Home/_components/_utils';

type GetNotifcationSettingsType =
  GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | 'taggedInDiscussionReply' | '__typename'
>;

type SelectNotificationType<Key extends string> =
  Key extends `${string}NotificationType` ? Key : never;

const NotificationSettings = () => {
  const { t: notificationsT } = useTranslation('notifications');

  // matching notification i18n
  const notificationSections = tObject<
    string,
    {
      heading: string;
      subHeading?: string;
      info?: string;
      notifications: {
        name: keyof NotificationSettingsFormType;
        copy: string;
        disable?: UserNotificationPreferenceFlag[];
        modelSpecific?: 'whichModelTypes';
        notificationType: SelectNotificationType<
          keyof NotificationSettingsFormType
        >;
      }[];
    }
  >('notifications:settings.sections');

  const whichModelType = tObject<string, string>(
    'notifications:settings.additionalConfigurations.whichModelTypes'
  );

  const formikRef = useRef<FormikProps<NotificationSettingsFormType>>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const unsubscribeEmailParams = params.get('unsubscribe_email');
  const isEmailParamsValid = verifyEmailParams(unsubscribeEmailParams);

  const { message } = useMessage();
  const { setErrorMeta } = useErrorMessage();

  const { data, loading, error } = useGetNotificationSettingsQuery();

  const [update] = useUpdateNotificationSettingsMutation();

  const notificationPreferences: Partial<NotificationSettingsFormType> =
    useMemo(
      () => data?.currentUser.notificationPreferences || {},
      [data?.currentUser.notificationPreferences]
    );

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
  } = notificationPreferences;

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

  const handleFormSubmit = () => {
    const dirtyInputs = dirtyInput(
      formikRef?.current?.initialValues,
      formikRef?.current?.values
    );

    const changes = {
      ...dirtyInputs
    };

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
    if (!isEmailParamsValid) {
      statusAlert({
        message: notificationsT('settings.unsubscribedMessage.error'),
        type: 'error'
      });
      return;
    }
    const unsubscribeNotification =
      UnsubscribableActivities[unsubscribeEmailParams];

    const unsubscribeNotificationPreferences =
      notificationPreferences[unsubscribeNotification] || [];

    // if chosen notification email preferance is unchecked then show error alert banner
    if (
      !unsubscribeNotificationPreferences.includes(
        UserNotificationPreferenceFlag.EMAIL
      )
    ) {
      statusAlert({
        message: (
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
        ),
        type: 'error'
      });

      params.delete('unsubscribe_email');
      navigate({ search: params.toString() }, { replace: true });
      return;
    }

    // if chosen notification has email preferance checked
    // adjust payload if in-app notifications are checked
    const changes = {
      [unsubscribeNotification]: unsubscribeNotificationPreferences.filter(
        pref => pref !== UserNotificationPreferenceFlag.EMAIL
      )
    };

    // Proceed to unsubscribe, update user notification preferences if changes are present
    setErrorMeta({
      overrideMessage: notificationsT('settings.unsubscribedMessage.error')
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

    params.delete('unsubscribe_email');
    navigate({ search: params.toString() }, { replace: true });
  }, [
    navigate,
    loading,
    notificationsT,
    params,
    unsubscribeEmailParams,
    update,
    setErrorMeta,
    isEmailParamsValid,
    notificationPreferences
  ]);

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
              const { dirty, setFieldValue, values } = formikProps;

              return (
                <MINTForm
                  className="maxw-none"
                  data-testid="notification-settings-form"
                  id="notification-settings-form"
                >
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
                  </Grid>

                  {getKeys(notificationSections).map((section, index) => (
                    <Fieldset key={section}>
                      {/* notification section info */}
                      <Grid mobile={{ col: 6 }}>
                        <h4
                          className={classNames('margin-bottom-0', {
                            [index === 0 ? 'margin-top-0' : 'margin-top-5']:
                              true
                          })}
                        >
                          {notificationSections[section].heading}
                        </h4>

                        {notificationSections[section].subHeading && (
                          <p className="margin-top-0 margin-bottom-1 text-base-dark">
                            {notificationSections[section].subHeading}
                          </p>
                        )}

                        {notificationSections[section].info && (
                          <div className="display-flex flex-align-center bg-base-lightest padding-x-2">
                            <Icon.InfoOutline
                              size={3}
                              className="margin-right-1"
                              aria-label="info icon"
                            />
                            <p className="text-italic">
                              <Trans
                                i18nKey={`notifications:settings:sections:${section}:info`}
                                values={{
                                  count:
                                    data?.currentUser.leadModelPlanCount || 0
                                }}
                              />
                            </p>
                          </div>
                        )}
                      </Grid>

                      {/* notifications in each section */}
                      {notificationSections[section].notifications.map(
                        notification => (
                          <div key={notification.name}>
                            <Grid row className="flex-align-start">
                              <Grid mobile={{ col: 6 }}>
                                <p className="text-wrap margin-y-105">
                                  {notification.copy}
                                </p>
                              </Grid>

                              <Grid mobile={{ col: 3 }}>
                                <Field
                                  as={Checkbox}
                                  id={`notification-setting-email-${notification.name}`}
                                  data-testid={`notification-setting-email-${notification.name}`}
                                  className="padding-left-2"
                                  name={notification.name}
                                  value={UserNotificationPreferenceFlag.EMAIL}
                                  disabled={notification.disable?.includes(
                                    UserNotificationPreferenceFlag.EMAIL
                                  )}
                                  checked={(
                                    values?.[notification.name] ?? []
                                  ).includes(
                                    UserNotificationPreferenceFlag.EMAIL
                                  )}
                                />
                              </Grid>

                              <Grid mobile={{ col: 3 }}>
                                <Field
                                  as={Checkbox}
                                  id={`notification-setting-in-app-${notification.name}`}
                                  data-testid={`notification-setting-in-app-${notification.name}`}
                                  className="padding-left-2"
                                  name={notification.name}
                                  value={UserNotificationPreferenceFlag.IN_APP}
                                  disabled={notification.disable?.includes(
                                    UserNotificationPreferenceFlag.IN_APP
                                  )}
                                  checked={(
                                    values?.[notification.name] ?? []
                                  ).includes(
                                    UserNotificationPreferenceFlag.IN_APP
                                  )}
                                />
                              </Grid>
                            </Grid>

                            {notification.modelSpecific ===
                              'whichModelTypes' && (
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
                                    data-testid={`notification-setting-whichModel-${notification.name}`}
                                    name={notification.notificationType}
                                    value={
                                      values?.[notification.notificationType]
                                    }
                                    disabled={
                                      !values[notification.name]?.length
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      setFieldValue(
                                        notification.notificationType,
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
                          </div>
                        )
                      )}
                    </Fieldset>
                  ))}
                  <div className="margin-top-6 margin-bottom-3">
                    <Button type="submit" disabled={!dirty}>
                      {notificationsT('settings.save')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    unstyled
                    onClick={() => navigate('/notifications')}
                  >
                    <Icon.ArrowBack
                      className="margin-right-1"
                      aria-hidden
                      aria-label="back"
                    />

                    {notificationsT('settings.dontUpdate')}
                  </Button>
                </MINTForm>
              );
            }}
          </Formik>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationSettings;
