import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import Tooltip from 'components/shared/Tooltip';
import {
  getKeys,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  TranslationFieldPropertiesWithOptions,
  TranslationFieldPropertiesWithOptionsAndChildren,
  TranslationFieldPropertiesWithOptionsAndParent
} from 'types/translation';

export type ReadOnlySectionProps = {
  copy?: string | null | React.ReactNode;
  heading: string;
  otherItem?: string | null; // used to designate the translated name of 'Other' option - render a followup question on a specific radio selection inline
  list?: boolean;
  listItems?: (string | number | React.ReactElement)[];
  listOtherItem?: string | null;
  listOtherItems?:
    | (string | null | undefined | React.ReactElement[])[]
    | undefined;
  tooltips?: (string | null | undefined)[];
  notes?: string | null;
  relatedConditions?: (string | null | undefined)[] | null;
};

const ReadOnlySection = ({
  copy,
  heading,
  otherItem,
  list,
  listItems = [],
  listOtherItem,
  listOtherItems,
  tooltips,
  notes,
  relatedConditions
}: ReadOnlySectionProps) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: readOnlyT } = useTranslation('generalReadOnly');

  const sectionName = heading
    .toLowerCase()
    .replace(/\W*$/g, '')
    .replace(/\W/g, '-');

  const isElement = (
    element: string | number | React.ReactElement | React.ReactNode
  ) => {
    return React.isValidElement(element);
  };

  // Legacy function to render "Other" option or translation for other not specifed
  const renderListItemOther = (otherSelection: string | null | undefined) => {
    if (otherSelection) {
      return (
        <li className="font-sans-md line-height-sans-4">{otherSelection}</li>
      );
    }
    return (
      <li className="font-sans-md line-height-sans-4">
        <em className="text-base">
          {miscellaneousT('noAdditionalInformation')}
        </em>
      </li>
    );
  };

  // Can render a single "Other" option or multiple additional information options
  // as well as default text for both if not specified
  const renderListItemOthers = (index: number) => {
    if (listOtherItems) {
      if (listOtherItems[index] === undefined) {
        return null;
      }
      if (listOtherItems[index]) {
        return (
          <li className="font-sans-md line-height-sans-4">
            {listOtherItems[index]}
          </li>
        );
      }
      return (
        <li className="font-sans-md line-height-sans-4 ">
          <em className="text-base">
            {miscellaneousT('noAdditionalInformation')}
          </em>
        </li>
      );
    }
    return null;
  };

  const renderCopyOrList = () => {
    if (isElement(copy)) {
      return (
        <div className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          {copy || (
            <em className="text-base">
              {miscellaneousT('noAdditionalInformation')}
            </em>
          )}
        </div>
      );
    }

    if (!list || listItems.length === 0) {
      if (copy && copy === otherItem) {
        return (
          <p className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
            {copy} {listOtherItem && <span>- {listOtherItem}</span>}{' '}
            {!listOtherItem && (
              <i className="text-base">
                - {miscellaneousT('noAdditionalInformation')}
              </i>
            )}
          </p>
        );
      }

      return (
        <p className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          {copy || (
            <em className="text-base">
              {miscellaneousT('noAdditionalInformation')}
            </em>
          )}
        </p>
      );
    }

    return (
      <ul
        className={`margin-y-0 padding-left-${
          isElement(listItems[0]) ? '2' : '3'
        }`}
      >
        {listItems.map((item, index) => (
          <React.Fragment
            key={
              isElement(listItems[index]) ? index : `${sectionName}--${item}`
            }
          >
            <li className="font-sans-md line-height-sans-4">
              {item}
              {tooltips && tooltips[index] && (
                <span className="top-2px position-relative">
                  <Tooltip
                    label={tooltips[index]!}
                    position="right"
                    className="margin-left-05"
                  >
                    <Icon.Info className="text-base-light" />
                  </Tooltip>
                </span>
              )}
            </li>
            {(item === 'Other' || listOtherItems) && (
              <ul data-testid="other-entry">
                {!listOtherItems && renderListItemOther(listOtherItem)}
                {listOtherItems && renderListItemOthers(index)}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  // If no notes are written, do not render
  if (heading === miscellaneousT('notes') && !copy) {
    return null;
  }

  return (
    <Grid desktop={{ col: 12 }}>
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
      >
        <p className="text-bold margin-y-0 font-body-sm line-height-sans-4 text-pre-line">
          {heading}
        </p>
        {renderCopyOrList()}
      </div>

      {notes && (
        <ReadOnlySection heading={miscellaneousT('notes')} copy={notes} />
      )}

      {!!relatedConditions?.length && (
        <>
          <Alert type="info" slim className="margin-bottom-3">
            {readOnlyT('questionNotApplicable', {
              count: relatedConditions.length
            })}
          </Alert>

          <CollapsableLink
            id={heading}
            label={readOnlyT('showOtherQuestions', {
              count: relatedConditions.length
            })}
            closeLabel={readOnlyT('hideOtherQuestions', {
              count: relatedConditions.length
            })}
            styleLeftBar={false}
            className="margin-bottom-3"
          >
            <ul className="margin-y-0">
              {relatedConditions.map(question => (
                <li key={question} className="text-bold margin-bottom-1">
                  {question}
                </li>
              ))}
            </ul>
          </CollapsableLink>
        </>
      )}
    </Grid>
  );
};

/*
  Util function for prepping option data to listItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListItems = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): string[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string => config.options[option]);
};

/*
  Util function for prepping data to listOtherItems prop of ReadOnlySection
  Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListOtherItems = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined, // field value/enum array
  values: any // All data for the task list section returned from query
): (string | null | undefined)[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string | null | undefined => {
      return values[config.optionsRelatedInfo?.[option]];
    });
};

/*
  Util function for getting related child questions that do not need to be rendered
  Using to render a toggle alert to show list of questions
*/
export const getRelatedUneededQuestions = <
  T extends string | keyof T,
  C extends string | keyof C
>(
  config:
    | TranslationFieldPropertiesWithOptions<T>
    | TranslationFieldPropertiesWithOptionsAndChildren<T, C>
    | TranslationFieldPropertiesWithOptionsAndParent<T, C>, // Translation config
  value: T[] | undefined // field value/enum array,
): (string | null | undefined)[] | null => {
  if (!isTranslationFieldPropertiesWithOptionsAndChildren(config)) return null;

  // Creating to arrays to hold values of needed and unneeded hidden questions
  // For instances like `providerOverlap` where the multiple parent evaluations triggers the same rendered question
  // Allows to remove dupe neededRelations
  let unneededRelations: string[] = [];
  const neededRelations: string[] = [];

  getKeys(config.childRelation).forEach(option => {
    // If the evaluation of the parent value triggers a child question, sort into appropriate arrays
    if (
      (Array.isArray(value) && !value?.includes(option as T)) ||
      (!Array.isArray(value) && value !== undefined && String(value) !== option)
    ) {
      config.childRelation?.[option]?.forEach(childField => {
        neededRelations.push(childField().label);
      });
    } else {
      unneededRelations = [
        ...unneededRelations,
        ...(config.childRelation?.[option]?.map(
          childField => childField().label
        ) as [])
      ];
    }
  });

  // Removes dupe relations and converts to translated string
  const uniqueQuestions = neededRelations
    .filter(relation => !unneededRelations.includes(relation))
    .map(relation => relation);

  return [...new Set(uniqueQuestions)];
};

/* Util function for prepping optionsLabels translation data to formatListTooltips prop of ReadOnlySection
Using translation config instead of raw data allows us to ensure a predetermined order of render
*/
export const formatListTooltips = <T extends string | keyof T>(
  config: TranslationFieldPropertiesWithOptions<T>, // Translation config
  value: T[] | undefined // field value/enum array
): (string | null | undefined)[] => {
  return getKeys(config.options)
    .filter(option => value?.includes(option))
    .map((option): string | null | undefined => {
      return config.optionsLabels?.[option];
    });
};

export default ReadOnlySection;
