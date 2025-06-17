import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import MailboxAndTeamMemberCard from '../MailboxAndTeamMemberCard';

const MailboxesAndTeamMembers = ({
  pointsOfContact
}: {
  pointsOfContact: SolutionContactType[];
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  // Sort by primary first, then alphabetically
  const pointsOfContactSorted = [...(pointsOfContact || [])].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) {
      return a.isPrimary ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <h2 className="margin-top-0 margin-bottom-2">
        {t('mailboxesAndTeamMembers')}
      </h2>
      <div className="height-3 margin-bottom-2">
        <Button type="button" unstyled>
          <Icon.Add aria-hidden />
          {t('addTeamMailbox')}
        </Button>

        <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-left-2 margin-right-1" />

        <Button type="button" unstyled>
          <Icon.Add aria-hidden />
          {t('addTeamMember')}
        </Button>
      </div>

      {pointsOfContactSorted.map(contact => (
        <MailboxAndTeamMemberCard pointOfContact={contact} key={contact.name} />
      ))}
    </div>
  );
};

export default MailboxesAndTeamMembers;
