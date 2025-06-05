import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import { HelpSolutionType } from '../../solutionsMap';
import GenericPointsOfContact from '../Solutions/Generic/pointsOfContact';

export const PointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const SolutionPointsOfContact = !solution.components['points-of-contact'] ? (
    <GenericPointsOfContact solution={solution} />
  ) : (
    solution.components['points-of-contact']({
      solution
    })
  );

  return (
    <div>
      <h2 className="margin-top-0 margin-bottom-2">
        {t('mailboxesAndTeamMembers')}
      </h2>
      <div className="height-3 margin-bottom-2">
        <Button type="button" className="usa-button usa-button--unstyled">
          <Icon.Add aria-hidden />
          {t('addTeamMailbox')}
        </Button>

        <div className="display-inline height-full width-1px border-left border-width-1px border-base-light margin-left-2 margin-right-1" />

        <Button type="button" className="usa-button usa-button--unstyled">
          <Icon.Add aria-hidden />
          {t('addTeamMember')}
        </Button>
      </div>
      {SolutionPointsOfContact}
    </div>
  );
};

export default PointsOfContact;
