import React from 'react';
import classNames from 'classnames';

import { getKeys, TranslationPlanSection } from 'types/translation';

import { filterGroupKey } from '../FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySectionNew, {
  isHiddenByParentCondition
} from '../ReadOnlySection/new';
import SideBySideReadOnlySectionNew from '../SideBySideReadOnlySection/new';

const ReadOnlyBody = ({
  data,
  config,
  filteredView
}: {
  data: any;
  config: TranslationPlanSection;
  filteredView?: keyof typeof filterGroupKey;
}) => {
  return (
    <>
      {/* Map through all the translation config questions */}
      {getKeys(config)
        .filter(field => field !== 'status') // Don't render status(in progress/ready for review, etc) field
        .map((field, index) => (
          <div
            key={field}
            className={classNames({
              'margin-top-4 padding-top-4 border-top-1px border-base-light':
                !filteredView && config[field]?.isPageStart // Add border if translation config contains property 'isPageStart'
            })}
          >
            {!filteredView && config[field]?.readonlyHeader && (
              <h3 className="margin-top-0">{config[field].readonlyHeader}</h3>
            )}

            {/* Checks if questions have config to be displayed side by side */}
            {config[field]?.adjacentPositioning ? (
              <>
                {/* Presence of adjacentPositioning will render in a SideBySideReadOnlySectionNew component 
                    Config position of 'left' will render and condtionally render the following component where adjacentPositioning.adjacentField is the reference */}
                {config[field]?.adjacentPositioning?.position === 'left' && (
                  <SideBySideReadOnlySectionNew>
                    <ReadOnlySectionNew
                      config={config[field]}
                      allConfig={config}
                      values={data}
                      filteredView={filteredView}
                    />

                    {/* Checks if second question is condtional on the previous question before rendering
                        References the string/key (ex: 'estimateConfidence') of adjacentPositioning.adjacentField 
                    */}
                    {!isHiddenByParentCondition(
                      config[
                        config[field].adjacentPositioning
                          ?.adjacentField as keyof TranslationPlanSection
                      ],
                      data
                    ) && (
                      <ReadOnlySectionNew
                        config={
                          config[
                            config[field].adjacentPositioning
                              ?.adjacentField as keyof TranslationPlanSection
                          ]
                        }
                        allConfig={config}
                        values={data}
                        filteredView={filteredView}
                      />
                    )}
                  </SideBySideReadOnlySectionNew>
                )}
              </>
            ) : (
              <>
                {/* Don't render questions of type 'isOtherType' as they are rendered within ReadOnlySectionNew */}
                {!config[field]?.isOtherType && (
                  <ReadOnlySectionNew
                    config={config[field]}
                    allConfig={config}
                    values={data}
                    filteredView={filteredView}
                  />
                )}
              </>
            )}
          </div>
        ))}
    </>
  );
};

export default ReadOnlyBody;
