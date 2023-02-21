import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const SolutionsHeader = ({ className }: OperationalSolutionsHelpProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div
      className={classNames(
        className,
        'padding-y-4 padding-bottom-6 bg-primary-darker text-white'
      )}
    >
      <GridContainer>
        <h2 className="margin-0">{t('operationalSolutions')}</h2>

        <p className="margin-bottom-4">{t('operationalSolutionsInfo')}</p>
      </GridContainer>
    </div>
  );
};

export default SolutionsHeader;
