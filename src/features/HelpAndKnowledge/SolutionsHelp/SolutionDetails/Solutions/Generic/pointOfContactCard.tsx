import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Link,
  Tooltip
} from '@trussworks/react-uswds';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

const NotificationStatus = ({
  receiveEmails,
  label,
  tooltipLabel
}: {
  receiveEmails: boolean;
  label: string;
  tooltipLabel: string;
}) => {
  return (
    <Tooltip
      label={tooltipLabel}
      position="right"
      className="bg-white padding-0 text-base-dark"
      style={{ gap: '0.25rem' }}
    >
      {receiveEmails ? <Icon.Notifications /> : <Icon.NotificationsOff />}
      <p className="margin-0">{label}</p>
    </Tooltip>
  );
};

const PointOfContactCard = ({
  pointOfContact
}: {
  pointOfContact: SolutionContactType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const {
    userAccount,
    isTeam,
    mailboxTitle,
    mailboxAddress,
    role,
    isPrimary,
    receiveEmails
  } = pointOfContact;
  const nameOnCard = isTeam
    ? mailboxTitle
    : `${userAccount.givenName} ${userAccount.familyName}`;
  const emailOnCard = isTeam ? mailboxAddress : userAccount.email;

  return (
    <div className="margin-bottom-3">
      <Card
        className="margin-bottom-0"
        containerProps={{
          className: 'radius-md padding-2 margin-bottom-1 margin-x-0'
        }}
      >
        <CardHeader className="padding-0">
          <h3 className="display-inline margin-bottom-0 margin-right-1">
            {nameOnCard}
          </h3>
          <NotificationStatus
            receiveEmails={receiveEmails}
            label={t(
              receiveEmails
                ? 'receivesNotifications'
                : 'notReceivesNotifications'
            )}
            tooltipLabel={t(
              receiveEmails
                ? 'receivesNotificationsTooltip'
                : 'notReceivesNotificationsTooltips'
            )}
          />
        </CardHeader>
        <CardBody className="padding-0 margin-bottom-1 display-flex flex-align-center">
          <Link
            aria-label={emailOnCard}
            className="margin-0 line-height-body-5"
            href={`mailto:${emailOnCard}`}
            target="_blank"
          >
            {emailOnCard}

            <Icon.MailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
          </Link>
        </CardBody>
        {isPrimary && (
          <h5 className="padding-0 margin-0 font-body-xs text-base-dark text-normal">
            {t('primaryPointOfContact')}
          </h5>
        )}
        {role && (
          <CardFooter className="padding-0 font-body-xs">{role}</CardFooter>
        )}
      </Card>
      <div>
        <Button
          type="button"
          className="usa-button usa-button--unstyled margin-right-2"
        >
          {t('edit')}
        </Button>
        <Button
          type="button"
          className="text-error usa-button usa-button--unstyled"
        >
          {t('removePointOfContact')}
        </Button>
      </div>
    </div>
  );
};

export default PointOfContactCard;
