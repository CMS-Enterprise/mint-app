import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import i18next from 'i18next';

import { MilestoneCardType } from '../../MilestoneLibrary';
import { SolutionCard } from '../SolutionCard';

import '../../index.scss';

type MilestonePanelProps = {
  milestone: MilestoneCardType;
};

const MilestonePanel = ({ milestone }: MilestonePanelProps) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const history = useHistory();

  const params = useMemo(
    () => new URLSearchParams(history.location.search),
    [history]
  );

  // Map the common solutions to the FE help solutions
  const mappedSolutions = milestone.commonSolutions.map(solution => {
    return helpSolutions.find(s => s.enum === solution.key);
  });

  // Map the translated text for facilitated by roles into a joined string
  const facilitatedByUsers = milestone.facilitatedByRole
    .map(role => i18next.t(`mtoMilestone:facilitatedBy.options.${role}`))
    .join(', ');

  return (
    <>
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
                  onClick={() => {
                    params.set('add-milestone', milestone.key);
                    history.replace({ search: params.toString() });
                  }}
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
    </>
  );
};

export default MilestonePanel;
