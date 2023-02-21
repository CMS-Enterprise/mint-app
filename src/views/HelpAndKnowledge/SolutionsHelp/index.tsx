import React from 'react';
// import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CategoryFooter from './_components/CategoryFooter';
import SolutionsHeader from './_components/SolutionsHeader';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  // const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className={classNames(className)}>
      <SolutionsHeader />
      <GridContainer>
        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
