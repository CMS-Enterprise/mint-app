import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import { GetOperationalSolution_operationalSolution as GetOperationalSolutionType } from 'queries/ITSolutions/types/GetOperationalSolution';

import NeedQuestionAndAnswer from '../NeedQuestionAndAnswer';
import SolutionCard from '../SolutionCard';

type SolutionDetailCardProps = {
  solution: GetOperationalSolutionType;
  operationalNeedID: string;
  modelID: string;
  className?: string;
};

const SolutionDetailCard = ({
  solution,
  operationalNeedID,
  modelID,
  className
}: SolutionDetailCardProps) => {
  const { t } = useTranslation('itSolutions');

  return (
    <div className={classNames('bg-base-lightest', className)}>
      <NeedQuestionAndAnswer
        operationalNeedID={operationalNeedID}
        modelID={modelID}
        solutionMode
      />

      <div className="padding-x-3 padding-top-0">
        <Divider className="margin-bottom-3" />
      </div>

      <Grid row gap className="padding-x-3">
        <Grid desktop={{ col: 6 }}>
          <p className="text-bold margin-top-0 margin-bottom-1">
            {t('solution')}
          </p>
          <SolutionCard solution={solution} shadow />
        </Grid>
      </Grid>
    </div>
  );
};

export default SolutionDetailCard;
