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

  return (
    <div>
      <MailboxesAndTeamMembers pointsOfContact={pointsOfContact || []} />

      <>
        <Divider className="margin-y-6" />
        <Owners owners={solution.systemOwner ? [solution.systemOwner] : []} />
      </>

      <>
        <Divider className="margin-y-6" />
        <Contractors contractors={contractors || []} />
      </>
    </div>
  );
};

export default GenericPointsOfContact;
