import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

type HeaderProps = {
  className?: string;
  solution: HelpSolutionType;
};

const Header = ({ className, solution }: HeaderProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  // Maps all related categories into a comma separated string
  const solutionsHeader = solution.categories.map(
    (categoryKey, index) =>
      `${t(`categories.${categoryKey}.header`)}${
        solution.categories.length > 1 &&
        index !== solution.categories.length - 1
          ? ', '
          : ''
      }`
  );

  return (
    <div
      className={classNames(
        className,
        'padding-y-4 padding-bottom-4 bg-primary-darker text-white padding-left-4'
      )}
    >
      <div>
        <p className="margin-0">{solutionsHeader}</p>

        <h1 className="margin-top-2 line-height-body-2">{solution.name}</h1>
      </div>
    </div>
  );
};

export default Header;
