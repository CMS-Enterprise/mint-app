import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { solutionCategories } from 'i18n/en-US/helpAndKnowledge/helpAndKnowledge';
import { OperationalSolutionCategoryRoute } from 'types/operationalSolutionCategories';

type HeaderProps = {
  className?: string;
  solution: HelpSolutionType;
};

const Header = ({ className, solution }: HeaderProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  // Maps all related categories into a comma separated string
  const solutionsHeader = solution.categories.map(
    (categoryKey, index) =>
      `${t(`categories.${categoryKey}.header`)} ${
        (solutionCategories[categoryKey as OperationalSolutionCategoryRoute]
          ?.subHeader &&
          t(`categories.${categoryKey}.subHeader`)) ||
        ''
      }${
        solution.categories.length > 1 &&
        index !== solution.categories.length - 1
          ? ', '
          : ''
      } `
  );

  return (
    <div
      className={classNames(
        className,
        'bg-primary-darker text-white padding-x-4 padding-top-5 padding-bottom-6'
      )}
    >
      <div>
        <h4 className="margin-0 text-primary-lighter">{solutionsHeader}</h4>

        <h1 className="margin-0 margin-top-05 line-height-body-2">
          {solution.name}
          {solution.acronym && (
            <span className="margin-0 font-body-lg text-normal margin-left-1">
              ({solution.acronym})
            </span>
          )}
        </h1>
      </div>
    </div>
  );
};

export default Header;
