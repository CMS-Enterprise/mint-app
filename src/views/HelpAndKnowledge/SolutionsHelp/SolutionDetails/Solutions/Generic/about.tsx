import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

export const GenericAbout = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const components = t(`solutions.${solution.key}.about.components`, {
    returnObjects: true
  });

  const hasComponents = Array.isArray(components);

  return (
    <div>
      <p className="margin-top-0 text-pre-wrap ">
        {t(`solutions.${solution.key}.about.description`)}
      </p>

      {hasComponents &&
        components.map(component => (
          <div key={component.header}>
            <h3>{component.header}</h3>
            <ul>
              {component.items.map((item: string, index: number) => (
                <li key={item}>
                  {component.itemHeaders && (
                    <span className="text-bold">
                      {component.itemHeaders[index]} -{' '}
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default GenericAbout;
