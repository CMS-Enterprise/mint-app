import React from 'react';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Divider from 'components/Divider';

import Contractors from '../../../PointsOfContact/_components/Contractors';
import MailboxesAndTeamMembers from '../../../PointsOfContact/_components/MailboxesAndTeamMembers';
import Owners from '../../../PointsOfContact/_components/Owners';

export const GenericPointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { pointsOfContact, contractors, systemOwners } = solution;

  return (
    <div>
      <MailboxesAndTeamMembers pointsOfContact={pointsOfContact || []} />

      <>
        <Divider className="margin-y-6" />
        <Owners owners={systemOwners || []} />
      </>

      <>
        <Divider className="margin-y-6" />
        <Contractors contractors={contractors || []} />
      </>
    </div>
  );
};

export default GenericPointsOfContact;
