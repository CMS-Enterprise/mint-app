import React from 'react';
import { useTranslation } from 'react-i18next';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

type ListItemType = {
  header: string;
  items: string[];
};

type AboutComponentType = {
  header: string;
  description?: string;
  level?: 'h3' | 'h4';
  items: string[] | ListItemType;
  ordered?: boolean;
};

type AboutConfigType = {
  description: string;
  items?: string[];
  ordered?: boolean;
  components: AboutComponentType[];
};

const returnListType = (
  ordered: boolean | undefined
): keyof JSX.IntrinsicElements =>
  `${ordered ? 'o' : 'u'}l` as keyof JSX.IntrinsicElements;

export const GenericAbout = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const aboutConfig: AboutConfigType = t(`solutions.${solution.key}.about`, {
    returnObjects: true
  });

  const descriptionItems = aboutConfig?.items;
  const hasDescriptionItems = Array.isArray(descriptionItems);
  const isDescriptionItemsOrdered = aboutConfig?.ordered;

  const components = t(`solutions.${solution.key}.about.components`, {
    returnObjects: true
  });
  const hasComponents = Array.isArray(components);

  // Render ordered list or unordered dynaically
  const ListType = returnListType(isDescriptionItemsOrdered);

  return (
    <div className="line-height-body-5 font-body-md">
      <p className="margin-top-0 text-pre-wrap margin-bottom-0">
        {t(`solutions.${solution.key}.about.description`)}
      </p>

      {hasDescriptionItems && (
        <ListType className="padding-left-4 margin-top-0">
          {descriptionItems?.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ListType>
      )}

      {hasComponents &&
        components.map(component => {
          const ComponentListType = returnListType(component.ordered);

          return (
            <div key={component.header} className="margin-top-4">
              <component.level className="margin-bottom-2">
                {component.header}
              </component.level>

              {component.description && (
                <span className="text-pre-wrap ">{component.description}</span>
              )}

              <ComponentListType className="padding-left-4 margin-top-0">
                {component.items.map(
                  (item: string | AboutComponentType, index: number) => (
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
                            {(item as ListItemType).items.map(
                              (subItem: string) => (
                                <li key={subItem}>{subItem}</li>
                              )
                            )}
                          </ul>
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  )
                )}
              </ComponentListType>
            </div>
          );
        })}
    </div>
  );
};

export default GenericAbout;
