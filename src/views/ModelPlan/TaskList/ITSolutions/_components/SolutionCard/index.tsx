/*
SolutionCard component for rendering custom solution details
Contains links to edit solution details or remove details
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
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
import { GetOperationalNeed_operationalNeed_solutions as GetOperationalNeedSolutionsType } from 'queries/ITSolutions/types/GetOperationalNeed';
import { OperationalSolutionKey } from 'types/graphql-global-types';
import { translateOperationalSolutionKey } from 'utils/modelPlan';

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

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('generalReadOnly');

  // TODO: remove once solutions have temp POC
  const tempSolutionPOC = {
    pocName: 'John Doe',
    pocEmail: 'john.doe@oddball.io'
  };

  const treatAsOtherSolutions = [
    OperationalSolutionKey.CONTRACTOR,
    OperationalSolutionKey.CROSS_MODEL_CONTRACT,
    OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS,
    OperationalSolutionKey.INTERNAL_STAFF
  ];

  const isDefaultSolutionOptions =
    solution.name !== null && solution.pocEmail === null;

  return (
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

          <Grid
            tablet={{ col: 6 }}
            className={classNames({ 'margin-bottom-2': solution.name })}
          >
            <p className="text-bold margin-bottom-0">{t('contact')}</p>

            <p className="margin-y-0">
              {solution.pocName ?? tempSolutionPOC.pocName}
            </p>

            <Link
              aria-label={h('contactInfo.sendAnEmail')}
              className="line-height-body-5 display-flex flex-align-center"
              href={`mailto:${solution.pocEmail ?? tempSolutionPOC.pocEmail}`}
              target="_blank"
            >
              <div>{solution.pocEmail ?? tempSolutionPOC.pocEmail}</div>
              <IconMailOutline className="margin-left-05 text-tbottom" />
            </Link>
          </Grid>

          {/* Show 'About Details' link if not updating solution details and not a custom solution */}
          {renderSolutionCardLinks && solution.name && !solution.otherHeader && (
            <>
              <Divider />

              <Button
                type="button"
                className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
              >
                {t('aboutSolution')}
                <IconArrowForward className="margin-left-1" />
              </Button>
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
  );
};

export default SolutionCard;
