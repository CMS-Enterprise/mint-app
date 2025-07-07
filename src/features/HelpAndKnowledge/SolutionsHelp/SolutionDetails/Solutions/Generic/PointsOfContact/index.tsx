import React from 'react';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Divider from 'components/Divider';

import Contractors from '../_components/Contractors';
import MailboxesAndTeamMembers from '../_components/MailboxesAndTeamMembers';
import Owners from '../_components/Owners';

export const GenericPointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { pointsOfContact, contractors } = solution;
  // TODO: replace test data with query result once implemented
  const testOwnersData = [
    {
      name: 'Medicare Plan Payment Group, Division of Payment Operations',
      system: 'Center for Medicare'
    },
    {
      name: 'Enterprise Systems Solutions Group, Division of Applications Development and Support',
      system: 'Office of Information Technology'
    }
  ];

  return (
    <div>
      <MailboxesAndTeamMembers pointsOfContact={pointsOfContact || []} />

      <>
        <Divider className="margin-y-6" />
        <Owners owners={testOwnersData} />
      </>

      <>
        <Divider className="margin-y-6" />
        <Contractors contractors={contractors || []} />
      </>
    </div>
  );
};

export default GenericPointsOfContact;
