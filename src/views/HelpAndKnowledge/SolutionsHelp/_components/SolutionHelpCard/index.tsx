import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardGroup,
  Grid,
  IconArrowForward
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';

import { HelpSolutionType } from '../../solutionsMap';
import SolutionsTag from '../SolutionsTag';

import './index.scss';

type SolutionCardProps = {
  className?: string;
  category?: string | null;
  solution: HelpSolutionType;
};

const SolutionHelpCard = ({
  className,
  category,
  solution
}: SolutionCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const location = useLocation();

  return (
    <CardGroup className="flex-column flex-no-wrap">
      <Card
        className={classNames(
          'solution-card margin-bottom-2 shadow',
          className
        )}
      >
        <div className="padding-3 solution-card__container">
          <div className="solution-card__header">
            <h3
              className="margin-bottom-0 margin-top-0 solutions-checkbox__header"
              style={{ wordBreak: 'break-word' }}
            >
              {solution.name}
            </h3>

            {solution.acronym && (
              <p className="margin-y-0">{solution.acronym}</p>
            )}

            {!category &&
              solution.categories.map(categoryTag => (
                <SolutionsTag
                  className="margin-bottom-1 margin-top-05"
                  key={categoryTag}
                  category={categoryTag}
                  route={categoryTag}
                />
              ))}

            <p className="solution-card__body">
              {t(`solutions.${solution.key}.about.description`)}
            </p>

            <Grid
              tablet={{ col: 6 }}
              className={classNames({ 'margin-bottom-2': solution.name })}
            >
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{solution.pointsOfContact[0].name}</p>
            </Grid>
          </div>

          <div>
            <Divider />

            <UswdsReactLink
              className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
              to={`/help-and-knowledge/operational-solutions${location.search}${
                location.search ? '&' : '?'
              }solution=${solution.route}&section=about`}
            >
              {t('aboutSolution')}
              <IconArrowForward className="margin-left-1" />
            </UswdsReactLink>
          </div>
        </div>
      </Card>
    </CardGroup>
  );
};

export default SolutionHelpCard;
