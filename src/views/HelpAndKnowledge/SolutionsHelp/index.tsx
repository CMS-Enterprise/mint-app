import React from 'react';
// import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';

import CategoryFooter from './_components/CategoryFooter';
import SolutionHelpCard from './_components/SolutionHelpCard';
import SolutionsHeader from './_components/SolutionsHeader';
import { helpSolutions } from './solutionsMap';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const SolutionsHelp = ({ className }: OperationalSolutionsHelpProps) => {
  // const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className={classNames(className)}>
      <SolutionsHeader />
      <GridContainer className="margin-top-4">
        <Grid row gap={2}>
          {helpSolutions.map(solution => (
            <Grid tablet={{ col: 4 }} key={solution.key}>
              <SolutionHelpCard solution={solution} />
            </Grid>
          ))}
        </Grid>
        <Divider />
        <CategoryFooter />
      </GridContainer>
    </div>
  );
};

export default SolutionsHelp;
