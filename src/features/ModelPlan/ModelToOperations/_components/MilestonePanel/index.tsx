import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import {
  HelpSolutionBaseType,
  helpSolutions
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import useModalSolutionState from 'hooks/useModalSolutionState';

import { MilestoneCardType } from '../../MilestoneLibrary';

import '../../index.scss';

type MilestonePanelProps = {
  milestone: MilestoneCardType;
};

const MilestonePanel = ({ milestone }: MilestonePanelProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  // Map the common solutions to the FE help solutions
  const mappedSolutions = milestone.commonSolutions.map(solution => {
    return helpSolutions.find(s => s.enum === solution.key);
  });

  // Map the translated text for facilitated by roles into a joined string
  const facilitatedByUsers = milestone.facilitatedByRole
    .map(role => t(`milestoneLibrary.facilitatedBy.${role}`))
    .join(', ');

  return (
    <GridContainer className="padding-8">
      <Grid row>
        <Grid col={12}>
          {milestone.isSuggested && (
            <div className="margin-bottom-4">
              <span className="padding-right-1 model-to-operations__milestone-tag padding-y-05">
                <Icon.LightbulbOutline
                  className="margin-left-1"
                  style={{ top: '2px' }}
                />{' '}
                {t('milestoneLibrary.suggested')}
              </span>
            </div>
          )}

          <h2 className="margin-y-2 line-height-large">{milestone.name}</h2>

          <p className="text-base-dark margin-top-0 margin-bottom-2">
            {t('milestoneLibrary.category', {
              category: milestone.categoryName
            })}{' '}
            {milestone.subCategoryName && ` (${milestone.subCategoryName})`}
          </p>

          <p>
            {t(`milestoneLibrary.milestoneMap.${milestone.key}.description`)}
          </p>

          <p className="text-base-dark margin-top-0 margin-bottom-4">
            {t('milestoneLibrary.facilitatedByArray', {
              facilitatedBy: facilitatedByUsers
            })}
          </p>

          <div className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
            {!milestone.isAdded ? (
              <Button
                type="button"
                outline
                className="margin-right-2"
                onClick={() => null}
              >
                {t('milestoneLibrary.addToMatrix')}
              </Button>
            ) : (
              <Button
                type="button"
                disabled
                className="margin-right-2 model-to-operations__milestone-added text-normal"
              >
                <Icon.Check />
                {t('milestoneLibrary.added')}
              </Button>
            )}
          </div>

          <h3 className="margin-y-2">
            {t('milestoneLibrary.commonSolutions')}
          </h3>

          {mappedSolutions.map(solution =>
            solution ? (
              <SolutionCard key={solution.key} solution={solution} />
            ) : null
          )}
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export const SolutionCard = ({
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

  // Set the solution route params
  params.set('solution', solution.route);
  params.set('section', 'about');

  const { prevPathname, selectedSolution, renderModal } = useModalSolutionState(
    solution.enum
  );

  return (
    <Grid desktop={{ col: 9 }} className="display-flex">
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library`}
        />
      )}

      <Card
        className={classNames('width-full', className)}
        containerProps={{
          className: classNames(
            'padding-3 flex-justify radius-md shadow-2 margin-0'
          )
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
            onClick={() => history.replace({ search: params.toString() })}
          >
            {t('milestoneLibrary.aboutSolution')}
          </Button>
        </div>
      </Card>
    </Grid>
  );
};

export default MilestonePanel;
