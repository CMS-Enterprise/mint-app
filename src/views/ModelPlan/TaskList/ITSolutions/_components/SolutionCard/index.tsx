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
};

const SolutionCard = ({
  className,
  shadow,
  solution,
  addingCustom
}: SolutionCardProps) => {
  const { modelID, operationalNeedID } = useParams<{
    modelID: string;
    operationalNeedID: string;
  }>();

  const { t } = useTranslation('itSolutions');
  const { t: h } = useTranslation('generalReadOnly');

  return (
    <CardGroup className="flex-column">
      <Card className={classNames('solution-card', { shadow }, className)}>
        <div className="padding-3">
          <h3 className="margin-bottom-2 margin-top-0 solutions-checkbox__header ">
            {solution.nameOther || solution.name}
          </h3>

          {solution.pocName && (
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
          )}

          {solution.name && (
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

          {addingCustom && (
            <div className="display-flex margin-top-2">
              <UswdsReactLink
                className="margin-right-2"
                to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}`}
              >
                {t('updateTheseDetails')}
              </UswdsReactLink>

              {(solution.pocName || solution.pocEmail) && (
                <UswdsReactLink
                  className="text-red"
                  to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/add-custom-solution/${solution.id}#remove-details`}
                >
                  {t('removeTheseDetails')}
                </UswdsReactLink>
              )}
            </div>
          )}
        </div>
      </Card>
    </CardGroup>
  );
};

export default SolutionCard;
