import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
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
      <p className="margin-0 text-normal">{label}</p>
    </Tooltip>
  );
};

const PointOfContactCard = ({
  pointOfContact
}: {
  pointOfContact: SolutionContactType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

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
            {pointOfContact.name}
          </h3>
          <NotificationStatus
            receiveEmails={pointOfContact.receiveEmails}
            label={t(
              pointOfContact.receiveEmails
                ? 'receivesNotifications'
                : 'notReceivesNotifications'
            )}
            tooltipLabel={t(
              pointOfContact.receiveEmails
                ? 'receivesNotificationsTooltip'
                : 'notReceivesNotificationsTooltips'
            )}
          />
        </CardHeader>
        <CardBody className="padding-0 margin-bottom-1 display-flex flex-align-center">
          <Link
            aria-label={pointOfContact.email}
            className="margin-0 line-height-body-5"
            href={`mailto:${pointOfContact.email}`}
            target="_blank"
          >
            {pointOfContact.email}

            <Icon.MailOutline className="margin-left-05 margin-bottom-1px text-tbottom" />
          </Link>
        </CardBody>
        {pointOfContact.isPrimary && (
          <CardBody className="padding-0 margin-bottom-1 text-base-dark">
            {t('primaryPointOfContact')}
          </CardBody>
        )}
        {pointOfContact.role && (
          <CardBody className="padding-0">{pointOfContact.role}</CardBody>
        )}
      </Card>
      <div>
        <Button type="button" className="margin-right-2" unstyled>
          {t('edit')}
        </Button>
        <Button
          type="button"
          className={pointOfContact.isPrimary ? 'text-gray' : 'text-error'}
          disabled={pointOfContact.isPrimary}
          unstyled
        >
          {t('removePointOfContact')}
        </Button>
      </div>
    </div>
  );
};

export default PointOfContactCard;
