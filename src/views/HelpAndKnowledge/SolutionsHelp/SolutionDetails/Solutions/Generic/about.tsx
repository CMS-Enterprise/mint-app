import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

type ListItemType = {
  header: string;
  items: string[];
  description?: string;
};

type LinkType = {
  link: string;
  external: boolean;
};

interface AboutComponentType {
  header: string;
  description?: string;
  level?: 'h3' | 'h4';
  items: (string | ListItemType)[];
  ordered?: boolean;
  itemHeaders?: string[]; // Must be the same number of items as items[]
  links?: LinkType[]; // Must be the same number of items as items[]
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

/*
Formats Trans component from array of links to be embedded
Returns links as MINT/internal or external links
Used with <link1>, <link2>, etc embedded tags in translation file
*/
const getTransLinkComponents = (links?: LinkType[]) => {
  const linkObj: Record<string, React.ReactNode> = {};
  if (links) {
    links.forEach((link, index) => {
      linkObj[`link${index + 1}`] = link.external ? (
        <Link
          aria-label="Open in a new tab"
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          variant="external"
        >
          link
        </Link>
      ) : (
        <UswdsReactLink to={link.link}>link</UswdsReactLink>
      );
    });
  }
  return linkObj;
};

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
                  'margin-bottom-0 font-body-md': component.level === 'h4'
                })}
              >
                <Trans
                  i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.header`}
                  components={getTransLinkComponents(component.links)}
                />
              </HeadingLevel>

              {component.description && (
                <span className="text-pre-wrap ">
                  <Trans
                    i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.description`}
                    components={getTransLinkComponents(component.links)}
                  />
                </span>
              )}

              <ComponentListType
                className={classNames('padding-left-4', {
                  'list-style-none padding-left-0 margin-top-neg-2':
                    component.items.length === 1,
                  'margin-top-0': component.items.length > 1
                })}
              >
                {component.items.map(
                  (item: string | AboutComponentType, index: number) => {
                    const listItem = (
                      <Trans
                        i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}`}
                        components={getTransLinkComponents(component.links)}
                      />
                    );

                    return (
                      <li
                        key={
                          typeof item === 'object' ? item.header : item + index
                        }
                        className={classNames({
                          'list-item': component.items.length > 1
                        })}
                      >
                        {component.itemHeaders && (
                          <span className="text-bold">
                            {component.itemHeaders[index]} -{' '}
                          </span>
                        )}

                        {/* Renders list item or another nested list */}
                        {typeof item === 'object' ? (
                          <>
                            <span>
                              <Trans
                                i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}.header`}
                                components={getTransLinkComponents(
                                  component.links
                                )}
                              />
                            </span>

                            <ul className="padding-left-4 margin-top-0">
                              {(item as ListItemType).items.map(
                                (subItem: string, subItemIndex: number) => (
                                  <li key={subItem} className="list-item">
                                    <Trans
                                      i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}.items.${subItemIndex}`}
                                      components={getTransLinkComponents(
                                        component.links
                                      )}
                                    />
                                  </li>
                                )
                              )}
                            </ul>
                            {item.description && (
                              <p className="margin-y-0">{item.description}</p>
                            )}
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
