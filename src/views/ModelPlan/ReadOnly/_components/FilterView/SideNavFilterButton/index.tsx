import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

interface SideNavFilterButtonProps {
  openFilterModal: () => void;
}

const SideNavFilterButton = ({ openFilterModal }: SideNavFilterButtonProps) => {
  const { t } = useTranslation('generalReadOnly');

  return (
    <div className="bg-base-lightest padding-2 margin-bottom-4">
      <p className="margin-top-0 text-bold line-height-sans-5">
        {t('filterView.question')}
      </p>
      <Button type="button" onClick={openFilterModal}>
        {t('filterView.text')}
      </Button>
    </div>
  );
};

export default SideNavFilterButton;
