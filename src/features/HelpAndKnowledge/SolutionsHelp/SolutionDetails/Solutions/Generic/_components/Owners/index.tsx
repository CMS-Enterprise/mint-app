import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Alert from 'components/Alert';

import OwnerCard from '../OwnerCard';
import OwnerModal from '../OwnerModal';

const Owners = ({ owners }: { owners: SolutionSystemOwnerType[] }) => {
  const { t } = useTranslation('helpAndKnowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasOwners = owners && owners?.length > 0;
  const sortedOwners = [...owners].sort((a, b) =>
    a.cmsComponent.localeCompare(b.cmsComponent)
  );

  return (
    <div>
      <OwnerModal
        isModalOpen={isModalOpen}
        mode="addSystemOwner"
        closeModal={() => setIsModalOpen(false)}
      />
      <h2 className="margin-bottom-0">{t('systemOwner')}</h2>
      <p className="margin-bottom-2">{t('systemOwnerDescription')}</p>
      <Button
        type="button"
        className="margin-bottom-3"
        unstyled
        onClick={() => setIsModalOpen(true)}
      >
        <Icon.Add aria-hidden />
        {t('addOwner')}
      </Button>
      {hasOwners ? (
        <div data-testid="owner-cards">
          {sortedOwners.map(owner => (
            <OwnerCard owner={owner} key={owner.id} />
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
