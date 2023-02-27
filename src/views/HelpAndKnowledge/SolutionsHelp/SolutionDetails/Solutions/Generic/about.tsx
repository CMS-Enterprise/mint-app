import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

type ListItemType = {
  header: string;
  items: string[];
};

export const GenericAbout = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const descriptionItems = t(`solutions.${solution.key}.about.items`, {
    returnObjects: true
  });
  const hasDescriptionItems = Array.isArray(descriptionItems);

  const components = t(`solutions.${solution.key}.about.components`, {
    returnObjects: true
  });
  const hasComponents = Array.isArray(components);

  return (
    <div>
      <p className="margin-top-0 text-pre-wrap margin-bottom-0">
        {t(`solutions.${solution.key}.about.description`)}
      </p>

      {hasDescriptionItems && (
        <ul className="padding-left-4 margin-top-0">
          {descriptionItems.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {hasComponents &&
        components.map(component => (
          <div key={component.header} className="margin-top-4">
            <h3 className="margin-bottom-2">{component.header}</h3>

            {component.description && (
              <span className="text-pre-wrap ">{component.description}</span>
            )}

            <ul className="padding-left-4 margin-top-0">
              {component.items.map(
                (item: string | ListItemType, index: number) => (
                  <li key={typeof item === 'object' ? item.header : item}>
                    {component.itemHeaders && (
                      <span className="text-bold">
                        {component.itemHeaders[index]} -{' '}
                      </span>
                    )}
                    {typeof item === 'object' ? (
                      <>
                        <span>{item.header}</span>
                        <ul className="padding-left-4 margin-top-0">
                          {item.items.map(subItem => (
                            <li key={subItem}>{subItem}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      item
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default GenericAbout;
