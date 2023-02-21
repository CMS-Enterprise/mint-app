/*
SolutionCard component for rendering custom solution details
Contains links to edit solution details or remove details
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardGroup,
  Grid,
  IconArrowForward
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import OperationalSolutionCategories from 'data/operationalSolutionCategories';

import {
  HelpSolutionType,
  operationalSolutionCategoryMap
} from '../../solutionsMap';
import SolutionsTag from '../SolutionsTag';

import './index.scss';

type SolutionCardProps = {
  className?: string;
  solution: HelpSolutionType;
};

const SolutionHelpCard = ({ className, solution }: SolutionCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <CardGroup className="flex-column flex-no-wrap">
      <Card
        className={classNames(
          'solution-card margin-bottom-2 shadow',
          className
        )}
      >
        <div className="padding-3">
          <h3
            className="margin-bottom-0 margin-top-0 solutions-checkbox__header"
            style={{ wordBreak: 'break-word' }}
          >
            {solution.name}
          </h3>

          {solution.acronym && <p className="margin-y-0">{solution.acronym}</p>}

          {solution.categories.map(category => (
            <SolutionsTag
              className="margin-bottom-1"
              category={category}
              route={
                operationalSolutionCategoryMap[
                  category as OperationalSolutionCategories
                ].route
              }
            />
          ))}

          <p className="solution-card__body">
            {t(`solutions.${solution.key}.about`)}
          </p>

          <Grid
            tablet={{ col: 6 }}
            className={classNames({ 'margin-bottom-2': solution.name })}
          >
            <p className="text-bold margin-bottom-0">{t('contact')}</p>

            <p className="margin-y-0">{solution.pocName}</p>
          </Grid>

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
        </div>
      </Card>
    </CardGroup>
  );
};

export default SolutionHelpCard;
