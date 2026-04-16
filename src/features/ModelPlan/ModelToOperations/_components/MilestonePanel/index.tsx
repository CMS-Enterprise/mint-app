import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import CommonMilestoneActions from 'features/HelpAndKnowledge/HKCMilestoneLibrary/_components/CommonMilestoneActions';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCardGroup';
import i18next from 'i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import { isAssessment } from 'utils/user';

import { SolutionCard } from '../SolutionCard';

import '../../index.scss';

type MilestonePanelProps = {
  milestone: MilestoneCardType;
  mode: 'mtoMilestoneLibrary' | 'hkcMilestoneLibrary';
};

const MilestonePanel = ({ milestone, mode }: MilestonePanelProps) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);

  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const isHKCMilestoneLibrary = mode === 'hkcMilestoneLibrary';
  const isMtoMilestoneLibrary = mode === 'mtoMilestoneLibrary';

  // Map the common solutions to the FE help solutions
  const mappedSolutions = milestone.commonSolutions.map(solution => {
    return helpSolutions[solution.key];
  });

  // Map the translated text for facilitated by roles into a joined string
  const facilitatedByUsers = milestone.facilitatedByRole
    .map(role => i18next.t(`mtoMilestone:facilitatedBy.options.${role}`))
    .join(', ');

  return (
    <>
      <div className="padding-8 maxw-tablet">
        <div className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
          {milestone.suggested.isSuggested && (
            <div className="margin-bottom-4">
              <span className="padding-right-1 model-to-operations__milestone-tag padding-y-05">
                <Icon.LightbulbOutline
                  className="margin-left-1"
                  style={{ top: '2px' }}
                  aria-label="lightbulb"
                />{' '}
                {modelToOperationsMiscT('milestoneLibrary.suggested')}
              </span>
            </div>
          )}

          <h2 className="margin-y-2 line-height-large">{milestone.name}</h2>

          <p className="text-base-dark margin-top-0 margin-bottom-2">
            {modelToOperationsMiscT('milestoneLibrary.category', {
              category: milestone.categoryName
            })}{' '}
            {milestone.subCategoryName && ` (${milestone.subCategoryName})`}
          </p>

          <p style={{ whiteSpace: 'pre-line' }}>{milestone.description}</p>

          <p className="text-base-dark margin-top-0 margin-bottom-4">
            {modelToOperationsMiscT('milestoneLibrary.facilitatedByArray', {
              facilitatedBy: facilitatedByUsers
            })}
          </p>

          {isHKCMilestoneLibrary && isAssessmentTeam && (
            <CommonMilestoneActions milestone={milestone} />
          )}

          {isMtoMilestoneLibrary &&
            (!milestone.isAdded ? (
              <Button
                type="button"
                outline
                className="margin-right-2"
                onClick={() => {
                  params.set('add-milestone', milestone.id);
                  navigate({ search: params.toString() }, { replace: true });
                }}
              >
                {modelToOperationsMiscT('milestoneLibrary.addToMatrix')}
              </Button>
            ) : (
              <Button
                type="button"
                disabled
                className="margin-right-2 model-to-operations__milestone-added text-normal"
              >
                <Icon.Check aria-label="check" />
                {modelToOperationsMiscT('milestoneLibrary.added')}
              </Button>
            ))}
        </div>

        <h3 className="margin-y-2">
          {modelToOperationsMiscT('milestoneLibrary.commonSolutions')}
        </h3>

        {mappedSolutions.map(solution =>
          solution ? (
            <SolutionCard key={solution.key} solution={solution} />
          ) : null
        )}
      </div>
    </>
  );
};

export default MilestonePanel;
