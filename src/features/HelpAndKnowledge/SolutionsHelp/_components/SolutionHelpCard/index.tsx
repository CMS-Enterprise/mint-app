import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card, CardGroup, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import { tObject } from 'utils/translation';

import {
  AboutConfigType,
  getTransLinkComponents
} from '../../SolutionDetails/Solutions/Generic/About';
import { HelpSolutionType } from '../../solutionsMap';
import SolutionsTag from '../SolutionsTag';

import './index.scss';

type SolutionCardProps = {
  className?: string;
  category?: MtoCommonSolutionSubject | null;
  solution: HelpSolutionType;
};

const SolutionHelpCard = ({
  className,
  category,
  solution
}: SolutionCardProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  const aboutConfig = tObject<keyof AboutConfigType, any>(
    `helpAndKnowledge:solutions.${solution.key}.about`
  );

  const primaryContact = solution?.pointsOfContact?.find(
    contact => contact.isPrimary
  );

  const location = useLocation();

  return (
    <CardGroup className="flex-no-wrap width-full">
      <Card
        className={classNames(
          'solution-card margin-bottom-2 shadow width-full',
          className
        )}
        containerProps={{
          className: 'margin-0'
        }}
      >
        <div className="padding-3 solution-card__container solution-card__fill-card-space width-full">
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

            {t(
              `helpAndKnowledge:solutions.${solution.key}.about.description`
            ) !== '' && (
              <p className="solution-card__body">
                <Trans
                  i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.description`}
                  components={{
                    ...getTransLinkComponents(aboutConfig.links),
                    bold: <strong />
                  }}
                />
              </p>
            )}

            <Grid
              tablet={{ col: 12 }}
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
              }solution-key=${solution.key}&section=about`}
            >
              {t('aboutSolution')}
              <Icon.ArrowForward
                className="margin-left-1"
                aria-label="forward"
              />
            </UswdsReactLink>
          </div>
        </div>
      </Card>
    </CardGroup>
  );
};

export default SolutionHelpCard;
