import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import useModalSolutionState from 'hooks/useModalSolutionState';

import { MilestoneCardType } from '../../MilestoneLibrary';

type MilestonePanelProps = {
  milestone: MilestoneCardType;
};

const MilestonePanel = ({ milestone }: MilestonePanelProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const mappedMilestones = milestone.commonSolutions.map(solution => {
    return helpSolutions.find(s => s.enum === solution.key);
  });

  return (
    <GridContainer className="padding-8 side-panel--cr-and-tdl">
      <Grid row>
        <Grid col={12}>
          <h1>{milestone.name}</h1>

          {mappedMilestones.map(solution =>
            solution ? (
              <SolutionCard key={solution.key} solution={solution} />
            ) : (
              <></>
            )
          )}
        </Grid>
      </Grid>
    </GridContainer>
  );
};

const SolutionCard = ({
  solution,
  className
}: {
  solution: HelpSolutionBaseType;
  className?: string;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  params.set('solution', solution.route);
  params.set('section', 'about');

  const { prevPathname, selectedSolution } = useModalSolutionState();

  return (
    <Grid desktop={{ col: 9 }} className="display-flex">
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library`}
        />
      )}

      <Card
        className={classNames('width-full', className)}
        containerProps={{
          className: classNames('padding-3 flex-justify radius-md')
        }}
      >
        <p className="margin-top-0 margin-bottom-05 text-base-dark">
          {solution?.type}
        </p>

        <h3 className="margin-0">{solution?.name}</h3>

        {solution?.acronym && (
          <p className="margin-top-0">{solution?.acronym}</p>
        )}

        <div className="border-top border-base-light padding-top-2">
          <Button
            type="button"
            unstyled
            onClick={() => history.push({ search: params.toString() })}
          >
            {t('milestoneLibrary.aboutSolution')}
          </Button>
        </div>
      </Card>
    </Grid>
  );
};

export default MilestonePanel;
