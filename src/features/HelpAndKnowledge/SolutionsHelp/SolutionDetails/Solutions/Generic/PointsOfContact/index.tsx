import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardFooter } from '@trussworks/react-uswds';
import {
  HelpSolutionType,
  SystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Divider from 'components/Divider';

import Contractors from '../_components/Contractors';
import MailboxesAndTeamMembers from '../_components/MailboxesAndTeamMembers';

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
  const { pointsOfContact, contractors } = solution;

  return (
    <div>
      <MailboxesAndTeamMembers pointsOfContact={pointsOfContact || []} />

      {solution.systemOwner && (
        <>
          <Divider className="margin-y-6" />

          <h2>{t('systemOwner')}</h2>

          <GenericCard contact={solution.systemOwner} />
        </>
      )}

      <>
        <Divider className="margin-y-6" />
        <Contractors contractors={contractors || []} />
      </>
    </div>
  );
};

export default GenericPointsOfContact;
