import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import {
  HelpSolutionType,
  SolutionContactType,
  SystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';
import Divider from 'components/Divider';

import PointOfContactCard from './pointOfContactCard';

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
  // console.log('hello pointsOfContact list', solution);
  const { t } = useTranslation('helpAndKnowledge');
  const { contractors } = solution;
  // TODO:(Elle) Remove below test data once gql is hooked to db
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
      role: 'Owner',
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
      role: null,
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
        <Button type="button" className="margin-bottom-3" unstyled>
          <Icon.Add aria-hidden />
          {t('addContractor')}
        </Button>

        {hasContractors ? (
          contractors.map(contact => (
            <>
              <GenericCard contact={contact} key={contact.name} />
              <Button type="button" className="margin-right-2" unstyled>
                {t('edit')}
              </Button>
              <Button type="button" className="text-error" unstyled>
                {t('removeContractor')}
              </Button>
            </>
          ))
        ) : (
          <Alert type="info" slim>
            {t('noContractors')}
          </Alert>
        )}
      </>
    </div>
  );
};

export default GenericPointsOfContact;
