import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card, CardGroup, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/Divider';
import { OperationalSolutionCategoryRoute } from 'data/operationalSolutionCategories';

import {
  AboutConfigType,
  getTransLinkComponents
} from '../../SolutionDetails/Solutions/Generic/about';
import { HelpSolutionType } from '../../solutionsMap';
import SolutionsTag from '../SolutionsTag';

import './index.scss';

type SolutionCardProps = {
  className?: string;
  category?: OperationalSolutionCategoryRoute | null;
  solution: HelpSolutionType;
};

const SolutionHelpCard = ({
  className,
  category,
  solution
}: SolutionCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const aboutConfig: AboutConfigType = t(`solutions.${solution.key}.about`, {
    returnObjects: true
  });

  const primaryContact = solution?.pointsOfContact?.find(
    contact => contact.isPrimary
  );

  const location = useLocation();

  return (
    <CardGroup className="flex-no-wrap">
      <Card
        className={classNames(
          'solution-card margin-bottom-2 shadow',
          className
        )}
      >
        <div className="padding-3 solution-card__container solution-card__fill-card-space">
          <div className="solution-card__header solution-card__fill-card-space">
            <h3
              className="margin-bottom-0 margin-top-0 solutions-checkbox__header"
              style={{ wordBreak: 'break-word' }}
            >
              {solution.name}
            </h3>

            {solution.acronym && (
              <p className="margin-y-0">{solution.acronym}</p>
            )}

            <div className="display-flex flex-wrap padding-top-05">
              {!category &&
                solution.categories.map(categoryTag => (
                  <SolutionsTag
                    key={categoryTag}
                    category={categoryTag}
                    route={categoryTag}
                  />
                ))}
            </div>

            <p className="solution-card__body">
              <Trans
                i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.description`}
                components={{
                  ...getTransLinkComponents(aboutConfig.links),
                  bold: <strong />
                }}
              />
            </p>

            <Grid
              tablet={{ col: 6 }}
              className={classNames({ 'margin-bottom-2': solution.name })}
            >
              <p className="text-bold margin-bottom-0">{t('contact')}</p>

              <p className="margin-y-0">{primaryContact?.name}</p>
            </Grid>
          </div>

          <div>
            <Divider />

            <UswdsReactLink
              className="display-flex flex-align-center usa-button usa-button--unstyled margin-top-2"
              aria-label={`${t('aboutSolutionAriaLabel')} ${solution.name}`}
              to={`/help-and-knowledge/operational-solutions${location.search}${
                location.search ? '&' : '?'
              }solution=${solution.route}&section=about`}
            >
              {t('aboutSolution')}
              <Icon.ArrowForward className="margin-left-1" />
            </UswdsReactLink>
          </div>
        </div>
      </Card>
    </CardGroup>
  );
};

export default SolutionHelpCard;
