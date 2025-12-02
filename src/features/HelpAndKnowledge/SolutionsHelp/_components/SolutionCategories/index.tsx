import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { MtoCommonSolutionSubject } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { getKeys } from 'types/translation';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

import CategoryCard from '../CategoryCard';

type OperationalSolutionsHelpProps = {
  className?: string;
};

const OperationalSolutionsHelp = ({
  className
}: OperationalSolutionsHelpProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div
      id={convertToLowercaseAndDashes(t('operationalSolutionsAndITSystems'))}
      className={classNames(
        className,
        'padding-y-4 padding-bottom-6 bg-primary-darker text-white'
      )}
      style={{ scrollMarginTop: '3.5rem' }}
    >
      <GridContainer>
        <h2 className="margin-0">{t('operationalSolutions')}</h2>

        <p className="margin-bottom-4 font-body-md">
          {t('operationalSolutionsInfo')}
        </p>

        <CardGroup className={className}>
          {getKeys(MtoCommonSolutionSubject).map(key => {
            return (
              <Grid
                tablet={{ col: 6 }}
                desktop={{ col: 3 }}
                key={key}
                className="display-flex flex-align-stretch"
              >
                <CategoryCard categoryKey={key as MtoCommonSolutionSubject} />
              </Grid>
            );
          })}
        </CardGroup>

        <UswdsReactLink
          to="/help-and-knowledge/operational-solutions?page=1"
          variant="unstyled"
          className="usa-button text-white"
        >
          {t('viewAllButton')}
        </UswdsReactLink>
      </GridContainer>
    </div>
  );
};

export default OperationalSolutionsHelp;
