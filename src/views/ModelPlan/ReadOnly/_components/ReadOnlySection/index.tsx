import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Icon } from '@trussworks/react-uswds';

import Tooltip from 'components/shared/Tooltip';
import {
  getKeys,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';

export type ReadOnlySectionProps = {
  copy?: string | null | React.ReactNode;
  heading: string;
  list?: boolean;
  listItems?: (string | number | React.ReactElement)[];
  listOtherItem?: string | null;
  listOtherItems?: (string | null | undefined)[] | undefined;
  tooltips?: (string | null | undefined)[];
  notes?: string | null;
};

const ReadOnlySection = ({
  copy,
  heading,
  list,
  listItems = [],
  listOtherItem,
  listOtherItems,
  tooltips,
  notes
}: ReadOnlySectionProps) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
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
  const renderListItemOther = (otherItem: string | null | undefined) => {
    if (otherItem) {
      return <li className="font-sans-md line-height-sans-4">{otherItem}</li>;
    }
    return (
      <li className="font-sans-md line-height-sans-4">
        <em className="text-base">{miscellaneousT('otherNotSpecified')}</em>
      </li>
    );
  };

  // Can render a single "Other" option or multiple additional information options
  // as well as default text for both if not specified
  const renderListItemOthers = (index: number, isOther: boolean) => {
    if (listOtherItems) {
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
            {isOther
              ? miscellaneousT('otherNotSpecified')
              : miscellaneousT('noAdditionalInformation')}
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
          {copy || <em className="text-base">{miscellaneousT('na')}</em>}
        </div>
      );
    }
    if (!list || listItems.length === 0) {
      return (
        <p className="margin-y-0 font-body-md line-height-sans-4 text-pre-line">
          {copy || <em className="text-base">{miscellaneousT('na')}</em>}
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
              <div className="display-flex flex-align-center">
                {item}
                {tooltips && tooltips[index] && (
                  <Tooltip
                    label={tooltips[index]!}
                    position="right"
                    className="margin-left-05"
                  >
                    <Icon.Info className="text-base-light" />
                  </Tooltip>
                )}
              </div>
            </li>
            {(item === 'Other' || listOtherItems) && (
              <ul data-testid="other-entry">
                {!listOtherItems && renderListItemOther(listOtherItem)}
                {listOtherItems &&
                  renderListItemOthers(index, item === 'Other')}
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
    </Grid>
  );
};

/* 
  Util function for prepping data to listItems prop of ReadOnlySection
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

export default ReadOnlySection;
