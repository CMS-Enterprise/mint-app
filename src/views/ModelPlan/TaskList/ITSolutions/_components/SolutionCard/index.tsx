/*
SolutionCard component for rendering custom solution details
Contains links to edit solution details or remove details
*/

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import {
  Card,
  CardGroup,
  Grid,
  IconArrowForward,
  IconMailOutline,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { GetOperationalNeed_operationalNeed_solutions as GetOperationalNeedSolutionsType } from 'queries/ITSolutions/types/GetOperationalNeed';
import { OperationalSolutionKey } from 'types/graphql-global-types';
import { translateOperationalSolutionKey } from 'utils/modelPlan';
import SolutionDetailsModal from 'views/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { findSolutionByKey } from '../CheckboxCard';

import './index.scss';

export type SolutionCardType = Omit<
  GetOperationalNeedSolutionsType,
  'mustStartDts' | 'mustFinishDts' | 'status'
>;

type SolutionCardProps = {
  className?: string;
  shadow?: boolean;
  solution: SolutionCardType;
  addingCustom?: boolean; // Used to render additional card actions/links when adding a custom solution
  renderSolutionCardLinks?: boolean;
};

const SolutionCard = ({
  className,
  shadow,
  solution,
  addingCustom,
  renderSolutionCardLinks = true
}: SolutionCardProps) => {
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('generalReadOnly');

  const { prevPathname, selectedSolution, renderModal } = useModalSolutionState(
    solution.key
  );

  const solutionMap = findSolutionByKey(solution.key, helpSolutions);

  const detailRoute = solutionMap?.route
    ? `${initLocation}${location.search}${
        location.search ? '&' : '?'
      }solution=${solutionMap?.route || ''}&section=about`
    : `${initLocation}${location.search}`;

  const treatAsOtherSolutions = [
    OperationalSolutionKey.CONTRACTOR,
    OperationalSolutionKey.CROSS_MODEL_CONTRACT,
    OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS,
    OperationalSolutionKey.INTERNAL_STAFF
  ];

  const isDefaultSolutionOptions =
    solution.name !== null && solution.pocEmail === null;

  return (
    <>
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute={initLocation}
        />
      )}
      <CardGroup className="flex-column flex-no-wrap">
        <Card className={classNames('solution-card', { shadow }, className)}>
          <div className="padding-3">
            {solution.key &&
              treatAsOtherSolutions.includes(solution.key) &&
              !isDefaultSolutionOptions && (
                <>
                  <h3 className="margin-y-0 solutions-checkbox__header">
                    {solution.otherHeader}
                  </h3>
                  <h5 className="text-normal margin-top-0 margin-bottom-2">
                    {translateOperationalSolutionKey(solution.key)}
                  </h5>
                </>
              )}

            {(!solution.key ||
              !treatAsOtherSolutions.includes(solution.key) ||
              isDefaultSolutionOptions) && (
              <h3
                className="margin-bottom-2 margin-top-0 solutions-checkbox__header"
                style={{ wordBreak: 'break-word' }}
              >
                {solution.nameOther || solution.name}
              </h3>
            )}

            {solutionMap?.pointsOfContact[0].name && (
              <Grid
                tablet={{ col: 6 }}
                className={classNames({ 'margin-bottom-2': solution.name })}
              >
                <p className="text-bold margin-bottom-0">{t('contact')}</p>

                <p className="margin-y-0">
                  {solutionMap?.pointsOfContact[0].name}
                </p>

                <Link
                  aria-label={h('contactInfo.sendAnEmail')}
                  className="line-height-body-5 display-flex flex-align-center"
                  href={`mailto:${solutionMap?.pointsOfContact[0].email}`}
                  target="_blank"
                >
                  <div>${solutionMap?.pointsOfContact[0].email}</div>
                  <IconMailOutline className="margin-left-05 text-tbottom" />
                </Link>
              </Grid>
            )}

            {solution.pocName && (
              <>
                <p className="text-bold margin-bottom-0">{t('contact')}</p>

                <p className="margin-y-0">{solution.pocName}</p>

                <Link
                  aria-label={h('contactInfo.sendAnEmail')}
                  className="line-height-body-5"
                  href={`mailto:${solution.pocEmail}`}
                  target="_blank"
                >
                  <div className="margin-bottom-2">{solution.pocEmail}</div>
                </Link>
              </>
            )}

            {/* Show 'About Details' link if not updating solution details and not a custom solution */}
            {renderSolutionCardLinks && solution.name && !solution.otherHeader && (
              <>
                <Divider />

                <UswdsReactLink
                  className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
                  to={detailRoute}
                >
                  {t('aboutSolution')}
                  <IconArrowForward className="margin-left-1" />
                </UswdsReactLink>
              </>
            )}

            {/* Renders links to either update solution details or remove solution details */}
            {(addingCustom || !solution.name || solution.otherHeader) && (
              <>
                {!addingCustom && <Divider className="margin-top-2" />}
                <div
                  className="display-flex margin-top-2"
                  data-testid="custom-solution-card"
                >
                  <UswdsReactLink
                    className="margin-right-2 display-flex flex-align-center"
                    to={{
                      pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}`,
                      state: { selectedSolution: solution.key }
                    }}
                  >
                    {t('updateTheseDetails')}
                    {!addingCustom && (
                      <IconArrowForward className="margin-left-1" />
                    )}
                  </UswdsReactLink>

                  {addingCustom && (solution.pocName || solution.pocEmail) && (
                    <UswdsReactLink
                      className="text-red"
                      to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}#remove-details`}
                    >
                      {t('removeTheseDetails')}
                    </UswdsReactLink>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </CardGroup>
    </>
  );
};

export default SolutionCard;
