import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { aboutTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import ExternalLink from 'components/ExternalLink';

import GatheringInfoAlert from '../../../_components/GatheringInfoAlert';

import '../../index.scss';

type ListItemType = {
  header: string;
  items: string[];
  description?: string;
};

export type LinkType = {
  link?: string;
  external?: boolean;
  toPoC?: boolean; // If true, will set the section to points-of-contact
};

interface AboutComponentType {
  header: string;
  description?: string;
  level?: 'h3' | 'h4';
  items: (string | ListItemType)[];
  noList?: boolean;
  ordered?: boolean;
  links?: LinkType[]; // Must be the same number of items as items[]
  hideBullet?: number[]; // index of bullet to hide
}

export interface AboutConfigType {
  description: string;
  links?: LinkType[];
  subDescription?: string;
  descriptionFooter?: string;
  items?: string[];
  noList?: boolean;
  ordered?: boolean;
  components?: AboutComponentType[];
  gatheringInfo?: boolean;
  ipcPortal?: {
    header: string;
    externalLink: string;
  };
}

const returnListType = (
  ordered: boolean | undefined,
  none?: boolean
): keyof React.JSX.IntrinsicElements => {
  if (none) {
    return 'span' as keyof React.JSX.IntrinsicElements;
  }
  return `${ordered ? 'o' : 'u'}l` as keyof React.JSX.IntrinsicElements;
};

const returnHeadingLevel = (
  level: 'h4' | undefined
): keyof React.JSX.IntrinsicElements =>
  (level || 'h3') as keyof React.JSX.IntrinsicElements;

/*
Formats Trans component from array of links to be embedded
Returns links as MINT/internal or external links
Used with <link1>, <link2>, etc embedded tags in translation file
*/
export const getTransLinkComponents = (links?: LinkType[]) => {
  const linkObj: Record<string, React.ReactNode> = {};

  const { search } = window.location;

  const params = new URLSearchParams(search);

  if (links) {
    links.forEach((link, index) => {
      // If the link is a POC, set the section to points-of-contact
      if (link.toPoC) {
        params.set('section', 'points-of-contact');

        linkObj[`link${index + 1}`] = (
          <InternalSolutionButton params={params.toString()}>
            link
          </InternalSolutionButton>
        );
        return;
      }

      if (!link.link) {
        return;
      }

      if (link.external) {
        linkObj[`link${index + 1}`] = (
          <ExternalLink href={link.link} inlineText>
            link
          </ExternalLink>
        );
      } else {
        params.set('solution-key', link.link);
        linkObj[`link${index + 1}`] = (
          <InternalSolutionButton params={params.toString()}>
            link
          </InternalSolutionButton>
        );
      }
    });
  }
  return linkObj;
};

// Button to link to another solution panel and scroll to the top
const InternalSolutionButton = ({
  params,
  children
}: {
  params: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      unstyled
      onClick={() => {
        navigate({ search: params });
        const modalCon = document?.getElementsByClassName(
          'ReactModal__Overlay'
        )?.[0];
        modalCon.scrollTo(0, 0);
      }}
    >
      {children}
    </Button>
  );
};

export const GenericAbout = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const aboutConfig = aboutTranslationUtil(solution.key);

  const descriptionItems = aboutConfig?.items;
  const hasDescriptionItems = Array.isArray(descriptionItems);
  const isDescriptionItemsOrdered = aboutConfig?.ordered;

  const { components } = aboutTranslationUtil(solution.key);

  const hasComponents = Array.isArray(components);

  // Render ordered list or unordered dynaically
  const ListType = returnListType(isDescriptionItemsOrdered);

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      {aboutConfig.gatheringInfo && (
        <GatheringInfoAlert solution={solution} className="margin-bottom-4" />
      )}

      <p className="margin-top-0 text-pre-wrap margin-bottom-0">
        <Trans
          i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.description`}
          components={{
            ...getTransLinkComponents(aboutConfig.links),
            bold: <strong />
          }}
        />
      </p>

      {hasDescriptionItems && (
        <ListType className="padding-left-4 margin-top-0">
          {descriptionItems?.map((item: string, index) => (
            <li key={item} className="list-item">
              <Trans
                i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.items.${index}`}
                components={{
                  ...getTransLinkComponents(aboutConfig.links),
                  bold: <strong />,
                  italic: <span className="text-italic text-base" />
                }}
              />
            </li>
          ))}
        </ListType>
      )}

      {aboutConfig.descriptionFooter && (
        <span className="line-height-normal">
          <Trans
            i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.descriptionFooter`}
            components={{
              ...getTransLinkComponents(aboutConfig.links),
              bold: <strong className="line-height-normal" />
            }}
          />
        </span>
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
                  components={{
                    ...getTransLinkComponents(component.links),
                    bold: <strong />
                  }}
                />
              </HeadingLevel>

              {component.description && (
                <span className="text-pre-wrap ">
                  <Trans
                    i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.description`}
                    components={{
                      ...getTransLinkComponents(component.links),
                      bold: <strong />
                    }}
                  />
                </span>
              )}

              <ComponentListType
                className={classNames('padding-left-4', {
                  'list-style-none padding-left-0 ':
                    component.items.length === 1 &&
                    (component.level === 'h4' || !component.header),
                  'list-style-none padding-left-0 margin-top-neg-2':
                    component.items.length === 1 &&
                    component.level !== 'h4' &&
                    component.header,
                  'margin-top-0': component.items.length > 1
                })}
              >
                {component.items.map(
                  (item: string | AboutComponentType, index: number) => {
                    return (
                      <li
                        key={
                          typeof item === 'object' ? item.header : item + index
                        }
                        className={classNames({
                          'list-item':
                            component.items.length > 1 &&
                            component.level !== 'h4' &&
                            component.header,
                          'list-style-none':
                            !!component?.hideBullet?.includes(index)
                        })}
                      >
                        {/* Renders list item or another nested list */}
                        {typeof item === 'object' ? (
                          <>
                            <span>
                              <Trans
                                i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}.header`}
                                components={{
                                  ...getTransLinkComponents(component.links),
                                  bold: <strong />,
                                  italic: (
                                    <span className="text-italic text-base" />
                                  )
                                }}
                              />
                            </span>

                            <ul className="padding-left-4 margin-top-0">
                              {(item as ListItemType).items.map(
                                (subItem: string, subItemIndex: number) => (
                                  <li key={subItem} className="list-item">
                                    <Trans
                                      i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}.items.${subItemIndex}`}
                                      components={{
                                        ...getTransLinkComponents(
                                          component.links
                                        ),
                                        bold: <strong />,
                                        italic: (
                                          <span className="text-italic text-base" />
                                        )
                                      }}
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
                          <Trans
                            i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.components.${componentIndex}.items.${index}`}
                            components={{
                              ...getTransLinkComponents(component.links),
                              bold: <strong />,
                              italic: <span className="text-italic text-base" />
                            }}
                          />
                        )}
                      </li>
                    );
                  }
                )}
              </ComponentListType>
            </div>
          );
        })}

      {aboutConfig.subDescription && (
        <span className="line-height-normal">
          <Trans
            i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.subDescription`}
            components={{
              ...getTransLinkComponents(aboutConfig.links),
              bold: <strong className="line-height-normal" />
            }}
          />
        </span>
      )}

      {aboutConfig.ipcPortal && (
        <div className="margin-top-4 padding-y-2 padding-x-2 bg-base-lightest mint-body-normal">
          <h4 className="margin-top-0 margin-bottom-1">
            <Trans
              t={t}
              i18nKey={`solutions.${solution.key}.about.ipcPortal.header`}
              components={{
                ...getTransLinkComponents(aboutConfig.links),
                bold: <strong />
              }}
            />
          </h4>

          <span>
            <Trans
              i18nKey={`helpAndKnowledge:solutions.${solution.key}.about.ipcPortal.externalLink`}
              components={{
                ...getTransLinkComponents(aboutConfig.links),
                bold: <strong />
              }}
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default GenericAbout;
