import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

type ListItemType = {
  header: string;
  items: string[];
};

interface AboutComponentType {
  header: string;
  description?: string;
  level?: 'h3' | 'h4';
  items: string[] | ListItemType;
  ordered?: boolean;
  itemHeaders?: string[]; // Must be the same number of items as items[]
  links?: string[]; // Must be the same number of items as items[]
}

export interface AboutConfigType {
  description: string;
  subDescription?: string;
  items?: string[];
  ordered?: boolean;
  components?: AboutComponentType[];
}

const returnListType = (
  ordered: boolean | undefined
): keyof JSX.IntrinsicElements =>
  `${ordered ? 'o' : 'u'}l` as keyof JSX.IntrinsicElements;

const returnHeadingLevel = (
  level: 'h4' | undefined
): keyof JSX.IntrinsicElements =>
  (level || 'h3') as keyof JSX.IntrinsicElements;

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
    <div className="operational-solution-details line-height-body-5 font-body-md">
      <p className="margin-top-0 text-pre-wrap margin-bottom-0">
        {t(`solutions.${solution.key}.about.description`)}
      </p>

      {hasDescriptionItems && (
        <ListType className="padding-left-4 margin-top-0">
          {descriptionItems?.map((item: string) => (
            <li key={item} className="list-item">
              {item}
            </li>
          ))}
        </ListType>
      )}

      {hasComponents &&
        components.map((component, componentIndex) => {
          const ComponentListType = returnListType(component.ordered);

          const HeadingLevel = returnHeadingLevel(component.level);

          return (
            <div
              key={component.header + componentIndex} // eslint-disable-line react/no-array-index-key
              className="margin-top-4"
            >
              <HeadingLevel
                className={classNames('margin-bottom-2', {
                  'margin-bottom-0': component.level === 'h4'
                })}
              >
                {component.header}
              </HeadingLevel>

              {component.description && (
                <span className="text-pre-wrap ">{component.description}</span>
              )}

              <ComponentListType className="padding-left-4 margin-top-0">
                {component.items.map(
                  (item: string | AboutComponentType, index: number) => {
                    const listItem = component.links ? (
                      <Link
                        aria-label="Open in a new tab"
                        href={component.links[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="external"
                      >
                        {item}
                      </Link>
                    ) : (
                      item
                    );

                    return (
                      <li
                        key={
                          typeof item === 'object' ? item.header : item + index
                        }
                        className="list-item"
                      >
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
                                  <li key={subItem} className="list-item">
                                    {subItem}
                                  </li>
                                )
                              )}
                            </ul>
                          </>
                        ) : (
                          listItem
                        )}
                      </li>
                    );
                  }
                )}
              </ComponentListType>
            </div>
          );
        })}

      {aboutConfig.subDescription && <span>{aboutConfig.subDescription}</span>}
    </div>
  );
};

export default GenericAbout;
