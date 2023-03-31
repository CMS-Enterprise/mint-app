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

  return (
    <CardGroup className="flex-column flex-no-wrap">
      <Card className={classNames('solution-card', { shadow }, className)}>
        <div className="padding-3">
          <h3
            className="margin-bottom-2 margin-top-0 solutions-checkbox__header"
            style={{ wordBreak: 'break-word' }}
          >
            {solution.nameOther || solution.name}
          </h3>

          {solution.pocName ? (
            <Grid
              tablet={{ col: 6 }}
              className={classNames({ 'margin-bottom-2': solution.name })}
            >
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{solution.pocName}</p>

              <Link
                aria-label={h('contactInfo.sendAnEmail')}
                className="line-height-body-5 display-flex flex-align-center"
                href={`mailto:${solution.pocEmail}`}
                target="_blank"
              >
                <div>{solution.pocEmail}</div>
                <IconMailOutline className="margin-left-05 text-tbottom" />
              </Link>
            </Grid>
          ) : (
            <Grid
              tablet={{ col: 6 }}
              className={classNames({ 'margin-bottom-2': solution.name })}
            >
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{tempSolutionPOC.pocName}</p>

              <Link
                aria-label={h('contactInfo.sendAnEmail')}
                className="line-height-body-5 display-flex flex-align-center"
                href={`mailto:${tempSolutionPOC.pocEmail}`}
                target="_blank"
              >
                <div>{tempSolutionPOC.pocEmail}</div>
                <IconMailOutline className="margin-left-05 text-tbottom" />
              </Link>
            </Grid>
          )}

          {/* Show 'About Dettails' link if not updating solution details and not a custom solution */}
          {renderSolutionCardLinks && solution.name && (
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
          {(addingCustom || !solution.name) && (
            <>
              {!addingCustom && <Divider className="margin-top-2" />}
              <div
                className="display-flex margin-top-2"
                data-testid="custom-solution-card"
              >
                <UswdsReactLink
                  className="margin-right-2 display-flex flex-align-center"
                  to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}`}
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
