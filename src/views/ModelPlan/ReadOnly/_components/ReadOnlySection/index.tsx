import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

export type ReadOnlySectionProps = {
  copy?: string | null | React.ReactNode;
  heading: string;
  list?: boolean;
  listItems?: (string | number | React.ReactElement)[];
  listOtherItem?: string | null;
  notes?: string | null;
  additionalDetails?: (string | null)[];
};

const ReadOnlySection = ({
  copy,
  heading,
  list,
  listItems = [],
  listOtherItem,
  notes,
  additionalDetails
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
            <li className="font-sans-md line-height-sans-4">{item}</li>
            {item === 'Other' && (
              <ul data-testid="other-entry">
                <li className="font-sans-md line-height-sans-4">
                  {listOtherItem || (
                    <em className="text-base">
                      {miscellaneousT('otherNotSpecified')}
                    </em>
                  )}
                </li>
              </ul>
            )}
            {item === 'Yes' && additionalDetails && (
              <ul data-testid="yes-entry">
                <li className="font-sans-md line-height-sans-4">
                  {additionalDetails[0] || (
                    <em className="text-base">
                      {miscellaneousT('noAdditionalInfo')}
                    </em>
                  )}
                </li>
              </ul>
            )}
            {item === 'No' && additionalDetails && (
              <ul data-testid="no-entry">
                <li className="font-sans-md line-height-sans-4">
                  {additionalDetails[1] || (
                    <em className="text-base">
                      {miscellaneousT('noAdditionalInfo')}
                    </em>
                  )}
                </li>
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

export default ReadOnlySection;
