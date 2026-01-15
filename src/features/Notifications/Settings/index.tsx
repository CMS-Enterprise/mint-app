import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Fieldset,
  Form,
  Grid,
  GridContainer,
  Icon,
  Label,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import NotFound from 'features/NotFound';
import {
  DataExchangeApproachMarkedCompleteNotificationType,
  DatesChangedNotificationType,
  GetNotificationSettingsQuery,
  IddocQuestionnaireCompletedNotificationType,
  NewDiscussionAddedNotificationType,
  useGetNotificationSettingsQuery,
  UserNotificationPreferenceFlag,
  useUpdateNotificationSettingsMutation
} from 'gql/generated/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Expire from 'components/Expire';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { statusAlert, useErrorMessage } from 'contexts/ErrorContext';
import useMessage from 'hooks/useMessage';
import {
  NotificationSettingsSection,
  SelectNotificationType
} from 'i18n/en-US/notifications';
import { getKeys } from 'types/translation';
import { dirtyInput } from 'utils/formUtil';
import { tObject } from 'utils/translation';

import {
  getUpdatedNotificationPreferences,
  UnsubscribableActivities,
  verifyEmailParams
} from '../Home/_components/_utils';

type GetNotifcationSettingsType =
  GetNotificationSettingsQuery['currentUser']['notificationPreferences'];

export type NotificationSettingsFormType = Omit<
  GetNotifcationSettingsType,
  'id' | 'taggedInDiscussionReply' | '__typename'
>;

const NotificationSettings = () => {
  const { t: notificationsT } = useTranslation('notifications');

  const notificationSectionsConfig = tObject<
    string,
    NotificationSettingsSection
  >('notifications:settings.sections');

  const whichModelTypeConfig = tObject<string, string>(
    'notifications:settings.additionalConfigurations.whichModelTypes'
  );

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

  const reformedDefaultValues = useMemo(
    () =>
      data
        ? {
            ...data.currentUser.notificationPreferences,
            newDiscussionAddedNotificationType:
              data.currentUser.notificationPreferences
                .newDiscussionAddedNotificationType ??
              NewDiscussionAddedNotificationType.ALL_MODELS,
            datesChangedNotificationType:
              data.currentUser.notificationPreferences
                .datesChangedNotificationType ??
              DatesChangedNotificationType.ALL_MODELS,
            dataExchangeApproachMarkedCompleteNotificationType:
              data.currentUser.notificationPreferences
                .dataExchangeApproachMarkedCompleteNotificationType ??
              DataExchangeApproachMarkedCompleteNotificationType.ALL_MODELS,
            iddocQuestionnaireCompletedNotificationType:
              (data.currentUser.notificationPreferences as any)
                .iddocQuestionnaireCompletedNotificationType ??
              IddocQuestionnaireCompletedNotificationType.ALL_MODELS
          }
        : undefined,
    [data]
  );

  const notificationPreferences: Partial<NotificationSettingsFormType> =
    useMemo(() => reformedDefaultValues || {}, [reformedDefaultValues]);

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
    dataExchangeApproachMarkedCompleteNotificationType,
    iddocQuestionnaireComplete,
    iddocQuestionnaireCompletedNotificationType
  } = notificationPreferences as typeof notificationPreferences & {
    iddocQuestionnaireComplete?: UserNotificationPreferenceFlag[];
    iddocQuestionnaireCompletedNotificationType?: IddocQuestionnaireCompletedNotificationType;
  };

  const methods = useForm<NotificationSettingsFormType>({
    defaultValues: {
      dailyDigestComplete: dailyDigestComplete ?? [],
      addedAsCollaborator: addedAsCollaborator ?? [],
      taggedInDiscussion: taggedInDiscussion ?? [],
      newDiscussionAdded: newDiscussionAdded ?? [],
      newDiscussionAddedNotificationType,
      newDiscussionReply: newDiscussionReply ?? [],
      incorrectModelStatus: incorrectModelStatus ?? [],
      modelPlanShared: modelPlanShared ?? [],
      newModelPlan: newModelPlan ?? [],
      datesChanged: datesChanged ?? [],
      datesChangedNotificationType,
      dataExchangeApproachMarkedComplete:
        dataExchangeApproachMarkedComplete ?? [],
      dataExchangeApproachMarkedCompleteNotificationType,
      iddocQuestionnaireComplete: iddocQuestionnaireComplete ?? [],
      iddocQuestionnaireCompletedNotificationType
    },
    values: reformedDefaultValues,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch
  } = methods;

  const [notificationTypesChanges, setNotificationTypesChanges] = useState<
    SelectNotificationType<keyof NotificationSettingsFormType>[]
  >([]);

  const onSubmit = (formData: NotificationSettingsFormType) => {
    const dirtyInputs = dirtyInput(notificationPreferences, formData);

    const notificationTypeChanges = notificationTypesChanges.reduce<
      Partial<
        Pick<
          NotificationSettingsFormType,
          SelectNotificationType<keyof NotificationSettingsFormType>
        >
      >
    >((allChangedTypes, changedType) => {
      const dirtyType = dirtyInputs[changedType];
      return {
        ...allChangedTypes,
        [changedType]: dirtyType ?? notificationPreferences[changedType]
      };
    }, {});

    const changes = {
      ...notificationTypeChanges,
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
    return <NotFound />;
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
          <FormProvider {...methods}>
            <Form
              className="maxw-none"
              data-testid="notification-settings-form"
              id="notification-settings-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Fieldset disabled={loading}>
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

                {getKeys(notificationSectionsConfig).map((section, index) => (
                  <Fieldset key={section}>
                    {/* notification section info */}
                    <Grid mobile={{ col: 6 }}>
                      <h4
                        className={classNames('margin-bottom-0', {
                          [index === 0 ? 'margin-top-0' : 'margin-top-5']: true
                        })}
                      >
                        {notificationSectionsConfig[section].heading}
                      </h4>

                      {notificationSectionsConfig[section].subHeading && (
                        <p className="margin-top-0 margin-bottom-1 text-base-dark">
                          {notificationSectionsConfig[section].subHeading}
                        </p>
                      )}

                      {notificationSectionsConfig[section].info && (
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
                                count: data?.currentUser.leadModelPlanCount || 0
                              }}
                            />
                          </p>
                        </div>
                      )}
                    </Grid>

                    {/* notifications in each section */}
                    {notificationSectionsConfig[section].notifications.map(
                      notification => (
                        <div key={notification.name}>
                          <Grid row className="flex-align-start">
                            <Grid mobile={{ col: 6 }}>
                              <p className="text-wrap margin-y-105">
                                {notification.copy}
                              </p>
                            </Grid>

                            <Controller
                              name={notification.name}
                              control={control}
                              render={({
                                field: { ref, ...field },
                                formState
                              }) => (
                                <>
                                  <Grid mobile={{ col: 3 }}>
                                    <Checkbox
                                      id={`notification-setting-email-${notification.name}`}
                                      data-testid={`notification-setting-email-${notification.name}`}
                                      className="padding-left-2"
                                      name={notification.name}
                                      value={
                                        UserNotificationPreferenceFlag.EMAIL
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        const chosenValue = e.target
                                          .value as UserNotificationPreferenceFlag;
                                        if (Array.isArray(field.value)) {
                                          field.onChange(
                                            getUpdatedNotificationPreferences(
                                              field.value,
                                              chosenValue
                                            )
                                          );
                                        }

                                        const hasPrefchanged =
                                          formState.dirtyFields[
                                            notification.name
                                          ];

                                        setNotificationTypesChanges(prev =>
                                          hasPrefchanged
                                            ? [
                                                ...prev,
                                                notification.notificationType
                                              ]
                                            : prev.filter(
                                                type =>
                                                  type !==
                                                  notification.notificationType
                                              )
                                        );
                                      }}
                                      disabled={notification.disable?.includes(
                                        UserNotificationPreferenceFlag.EMAIL
                                      )}
                                      checked={(field.value || []).includes(
                                        UserNotificationPreferenceFlag.EMAIL
                                      )}
                                      label=""
                                    />
                                  </Grid>

                                  <Grid mobile={{ col: 3 }}>
                                    <Checkbox
                                      id={`notification-setting-in-app-${notification.name}`}
                                      data-testid={`notification-setting-in-app-${notification.name}`}
                                      className="padding-left-2"
                                      name={notification.name}
                                      value={
                                        UserNotificationPreferenceFlag.IN_APP
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        const chosenValue = e.target
                                          .value as UserNotificationPreferenceFlag;
                                        if (Array.isArray(field.value)) {
                                          field.onChange(
                                            getUpdatedNotificationPreferences(
                                              field.value,
                                              chosenValue
                                            )
                                          );
                                        }

                                        const hasPrefchanged =
                                          formState.dirtyFields[
                                            notification.name
                                          ];

                                        setNotificationTypesChanges(prev =>
                                          hasPrefchanged
                                            ? [
                                                ...prev,
                                                notification.notificationType
                                              ]
                                            : prev.filter(
                                                type =>
                                                  type !==
                                                  notification.notificationType
                                              )
                                        );
                                      }}
                                      disabled={notification.disable?.includes(
                                        UserNotificationPreferenceFlag.IN_APP
                                      )}
                                      checked={(field.value || []).includes(
                                        UserNotificationPreferenceFlag.IN_APP
                                      )}
                                      label=""
                                    />
                                  </Grid>
                                </>
                              )}
                            />
                          </Grid>

                          {notification.modelSpecific === 'whichModelTypes' && (
                            <Controller
                              name={notification.notificationType}
                              control={control}
                              render={({ field: { ref, ...field } }) => (
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

                                    <Select
                                      {...field}
                                      id="notification-setting-whichModel"
                                      data-testid={`notification-setting-whichModel-${notification.name}`}
                                      name={notification.notificationType}
                                      value={field.value ?? undefined}
                                      disabled={
                                        watch(notification.name)?.length === 0
                                      }
                                    >
                                      {getKeys(whichModelTypeConfig).map(
                                        type => {
                                          return (
                                            <option key={type} value={type}>
                                              {whichModelTypeConfig[type]}
                                            </option>
                                          );
                                        }
                                      )}
                                    </Select>
                                  </Grid>
                                </Grid>
                              )}
                            />
                          )}
                        </div>
                      )
                    )}
                  </Fieldset>
                ))}

                <div className="margin-top-6 margin-bottom-3">
                  <Button type="submit" disabled={!isDirty || isSubmitting}>
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
              </Fieldset>
            </Form>
          </FormProvider>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default NotificationSettings;
