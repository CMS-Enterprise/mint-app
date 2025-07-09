import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import { SystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';

import OwnerCard from '../OwnerCard';

const Owners = ({ owners }: { owners: SystemOwnerType[] }) => {
  const { t } = useTranslation('helpAndKnowledge');
  const hasOwners = owners && owners?.length > 0;
  const sortedOwners = [...owners].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h2 className="margin-bottom-0">{t('systemOwner')}</h2>
      <p className="margin-bottom-2">{t('systemOwnerDescription')}</p>
      <Button
        type="button"
        className="margin-bottom-3"
        unstyled
        onClick={() => {}}
      >
        <Icon.Add aria-hidden />
        {t('addOwner')}
      </Button>
      {hasOwners ? (
        <div data-testid="owner-cards">
          {sortedOwners.map((owner, ind) => (
            // eslint-disable-next-line react/no-array-index-key
            <OwnerCard owner={owner} key={owner.name + ind} />
          ))}
        </div>
      ) : (
        <Alert type="info" slim>
          {t('noOwners')}
        </Alert>
      )}
    </div>
  );
};
export default Owners;
