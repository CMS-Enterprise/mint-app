import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/Alert';
import usePagination from 'hooks/usePagination';
import {
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'types/operationalSolutionCategories';

import {
  HelpSolutionType,
  operationalSolutionSubCategoryMap
} from '../../solutionsMap';
import SolutionHelpCard from '../SolutionHelpCard';

import './index.scss';

type SolutionHelpCardGroupProps = {
  className?: string;
  solutions: HelpSolutionType[];
  category?: OperationalSolutionCategoryRoute | null;
  setResultsNum: (offset: number) => void;
};

// Return mapped solution component based on category or query
function Solutions({
  currentSolutions,
  category
}: {
  currentSolutions: HelpSolutionType[];
  category?: OperationalSolutionCategoryRoute | null;
}) {
  const { t } = useTranslation('helpAndKnowledge');

  if (category && operationalSolutionSubCategoryMap[category]) {
    return (
      <div className="margin-top-6">
        {operationalSolutionSubCategoryMap[category]!.map(subCategory => {
          let subCategorySolutions = currentSolutions.filter(solution =>
            solution.subCategories?.includes(subCategory)
          );

          // Order of subcatery for APPLICATIONS is not alphabetical like other, needs a certain order
          if (subCategory === OperationalSolutionSubCategories.APPLICATIONS) {
            const setIndexes = [3, 4, 2, 0, 1];
            subCategorySolutions = setIndexes.map(i => subCategorySolutions[i]);
          }

          // Order of subcatery for PARTICIPANT_AGREEMENT_APPS is not alphabetical like other, needs a certain order
          if (
            subCategory ===
            OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
          ) {
            const setIndexes = [2, 3, 1, 0];
            subCategorySolutions = setIndexes.map(i => subCategorySolutions[i]);
          }

          return (
            <React.Fragment key={subCategory}>
              <h2>{t(`subCategories.${subCategory}`)}</h2>
              <Grid row gap>
                {subCategorySolutions
                  .filter(solution => !!solution)
                  .map(solution => (
                    <Grid
                      tablet={{ col: 6 }}
                      desktop={{ col: 4 }}
                      key={solution?.key}
                      className="display-flex flex-align-stretch"
                    >
                      <SolutionHelpCard
                        solution={solution}
                        category={category}
                      />
                    </Grid>
                  ))}
              </Grid>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <Grid row gap={2} className="margin-bottom-2 margin-top-6">
      {currentSolutions.map(solution => (
        <Grid
          tablet={{ col: 6 }}
          desktop={{ col: 4 }}
          key={solution.key}
          className="display-flex flex-align-stretch"
        >
          <SolutionHelpCard solution={solution} category={category} />
        </Grid>
      ))}
    </Grid>
  );
}

const SolutionHelpCardGroup = ({
  className,
  solutions,
  category,
  setResultsNum
}: SolutionHelpCardGroupProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { t: h } = useTranslation('generalReadOnly');

  const { currentItems, Pagination } = usePagination<HelpSolutionType[]>({
    items: solutions,
    itemsPerPage: 9,
    withQueryParams: 'page'
  });

  // Updates the result nums
  useEffect(() => {
    setResultsNum(currentItems.length);
  }, [setResultsNum, currentItems]);

  return (
    <GridContainer className={classNames(className, 'margin-top-4')}>
      {currentItems.length === 0 ? (
        <Alert
          type="info"
          heading={t('noResults.header')}
          className="margin-top-6"
        >
          <span className="mandatory-fields-alert__text">
            <span>{t('noResults.content')}</span>
            <Link
              aria-label={h('contactInfo.sendAnEmail')}
              className="line-height-body-5"
              href="mailto:MINTTeam@cms.hhs.gov"
              target="_blank"
            >
              MINTTeam@cms.hhs.gov
            </Link>
            .
          </span>
        </Alert>
      ) : (
        <>
          <Solutions currentSolutions={currentItems} category={category} />
          {Pagination}
        </>
      )}
    </GridContainer>
  );
};

export default SolutionHelpCardGroup;
