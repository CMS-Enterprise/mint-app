import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Icon
} from '@trussworks/react-uswds';
import {
  HelpSolutionType,
  SystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';
import Divider from 'components/Divider';

import ContractorCard from './contractorCard';
import MailboxAndTeamMemberCard from './mailboxAndTeamMemberCard';

const GenericCard = ({ contact }: { contact: SystemOwnerType }) => {
  return (
    <Card
      key={contact.system}
      className="margin-bottom-0"
      containerProps={{
        className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
      }}
    >
      <CardBody className="padding-0 margin-bottom-1">
        {contact.system}
      </CardBody>
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
  const { t } = useTranslation('helpAndKnowledge');
  const { contractors } = solution;

  const pointsOfContactSorted = [...(solution?.pointsOfContact || [])].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
  const hasContractors = contractors && contractors?.length > 0;

  return (
    <div>
      {/* Sort to have primary first in array */}
      {[
        ...(pointsOfContactSorted.filter(x => x.isPrimary) || []),
        ...(pointsOfContactSorted.filter(x => !x.isPrimary) || [])
      ].map(contact => (
        <MailboxAndTeamMemberCard pointOfContact={contact} key={contact.name} />
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

        <h2 className="margin-bottom-2">{t('contractors')}</h2>
        <Button type="button" className="margin-bottom-3" unstyled>
          <Icon.Add aria-hidden />
          {t('addContractor')}
        </Button>

        {hasContractors ? (
          contractors.map(contact => <ContractorCard contact={contact} />)
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
