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
import {
  HelpSolutionType,
  SolutionContactType,
  SystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';
import Divider from 'components/Divider';

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

const GenericCard = ({ contact }: { contact: SystemOwnerType }) => {
  return (
    <Card
      key={contact.system}
      className="margin-bottom-0"
      containerProps={{
        className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
      }}
    >
      <CardHeader className="font-body-xs padding-0">
        {contact.system}
      </CardHeader>
      {contact.name && (
        <CardFooter className="padding-0">
          <h3 className="margin-0 line-height-sans-2">{contact.name}</h3>
        </CardFooter>
      )}
    </Card>
  );
};

export const GenericPointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  console.log('hello pointsOfContact list', solution);
  const { t } = useTranslation('helpAndKnowledge');
  const { contractors } = solution;
  const test: SolutionContactType[] = [
    {
      __typename: 'MTOCommonSolutionContact',
      id: '123',
      mailboxTitle: '',
      mailboxAddress: '',
      userAccount: {
        __typename: 'UserAccount',
        id: '456',
        givenName: 'John',
        familyName: 'May',
        email: 'email@email.com'
      },
      isTeam: false,
      isPrimary: false,
      role: 'IC',
      receiveEmails: false
    },
    {
      __typename: 'MTOCommonSolutionContact',
      id: '123',
      mailboxTitle: '',
      mailboxAddress: '',
      userAccount: {
        __typename: 'UserAccount',
        id: '456',
        givenName: 'June',
        familyName: 'Month',
        email: 'email2@email.com'
      },
      isTeam: false,
      isPrimary: true,
      role: 'owner',
      receiveEmails: true
    },
    {
      __typename: 'MTOCommonSolutionContact',
      id: '123',
      mailboxTitle: 'Mint Team mailbox',
      mailboxAddress: 'mint-team@email.com',
      userAccount: {
        __typename: 'UserAccount',
        id: '',
        givenName: '',
        familyName: '',
        email: ''
      },
      isTeam: true,
      isPrimary: false,
      role: 'team',
      receiveEmails: true
    }
  ];
  const pointsOfContactSorted = [...(test || [])].sort((a, b) =>
    a.userAccount.givenName.localeCompare(b.userAccount.givenName)
  );
  const hasContractors = contractors && contractors?.length > 0;

  return (
    <div>
      {/* Sort to have primary first in array */}
      {[
        ...(pointsOfContactSorted.filter(x => x.isPrimary) || []),
        ...(pointsOfContactSorted.filter(x => !x.isPrimary) || [])
      ].map(contact => (
        <PointOfContactCard pointOfContact={contact} key={contact.id} />
      ))}

      {solution.systemOwner && (
        <>
          <Divider className="margin-y-6" />

          <h2>{t('systemOwner')}</h2>

          <GenericCard contact={solution.systemOwner} />
        </>
      )}

      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-bottom-1">{t('contractors')}</h2>
        <Button
          type="button"
          className="usa-button usa-button--unstyled margin-bottom-3"
        >
          <Icon.Add aria-hidden />
          {t('addContractor')}
        </Button>

        {hasContractors ? (
          contractors.map(contact => (
            <GenericCard contact={contact} key={contact.name} />
          ))
        ) : (
          <Alert type="info" slim>
            {t('noContractors')}
          </Alert>
        )}

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
          {t('removeContractor')}
        </Button>
      </>
    </div>
  );
};

export default GenericPointsOfContact;
