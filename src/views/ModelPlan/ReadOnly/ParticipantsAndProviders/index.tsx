import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  GetAllParticipantsAndProvidersQuery,
  useGetAllParticipantsAndProvidersQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySectionNew, {
  isHiddenByParentCondition
} from '../_components/ReadOnlySection/new';
import SideBySideReadOnlySectionNew from '../_components/SideBySideReadOnlySection/new';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyParticipantsAndProviders = ({
  modelID,
  clearance,
  filteredView,
  isViewingFilteredView
}: ReadOnlyProps) => {
  const { t: participantsAndProvidersMiscT } = useTranslation(
    'participantsAndProvidersMisc'
  );
  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const participantsAndProvidersConfig = usePlanTranslation(
    'participantsAndProviders'
  );

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllParticipantsAndProvidersQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allparticipantsAndProvidersData = (data?.modelPlan
    .participantsAndProviders ||
    {}) as GetAllParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];

  return (
    <div
      className="read-only-model-plan--participants-and-providers"
      data-testid="read-only-model-plan--participants-and-providers"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={participantsAndProvidersMiscT('clearanceHeading')}
        heading={participantsAndProvidersMiscT('heading')}
        isViewingFilteredView={isViewingFilteredView}
        status={allparticipantsAndProvidersData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {getKeys(participantsAndProvidersConfig)
        .filter(field => field !== 'status')
        .map((field, index) => (
          <div
            key={field}
            className={classNames({
              'margin-top-4 padding-top-4 border-top-1px border-base-light':
                !isViewingFilteredView &&
                participantsAndProvidersConfig[field]?.pageStart
            })}
          >
            {participantsAndProvidersConfig[field]?.adjacentPosition ===
              'left' ||
            participantsAndProvidersConfig[field]?.adjacentPosition ===
              'right' ? (
              <>
                {participantsAndProvidersConfig[field]?.adjacentPosition ===
                  'left' && (
                  <SideBySideReadOnlySectionNew>
                    <ReadOnlySectionNew
                      config={participantsAndProvidersConfig[field]}
                      values={allparticipantsAndProvidersData}
                      namespace="participantsAndProviders"
                      filteredView={filteredView}
                    />

                    {!isHiddenByParentCondition(
                      participantsAndProvidersConfig[
                        getKeys(participantsAndProvidersConfig)[index + 1]
                      ],
                      allparticipantsAndProvidersData
                    ) && (
                      <ReadOnlySectionNew
                        config={
                          participantsAndProvidersConfig[
                            getKeys(participantsAndProvidersConfig)[index + 1]
                          ]
                        }
                        values={allparticipantsAndProvidersData}
                        namespace="participantsAndProviders"
                        filteredView={filteredView}
                      />
                    )}

                    {!isHiddenByParentCondition(
                      participantsAndProvidersConfig[
                        getKeys(participantsAndProvidersConfig)[index + 1]
                      ],
                      allparticipantsAndProvidersData
                    ) && (
                      <ReadOnlySectionNew
                        config={
                          participantsAndProvidersConfig[
                            getKeys(participantsAndProvidersConfig)[index + 1]
                          ]
                        }
                        values={allparticipantsAndProvidersData}
                        namespace="participantsAndProviders"
                        filteredView={filteredView}
                      />
                    )}
                  </SideBySideReadOnlySectionNew>
                )}
              </>
            ) : (
              <>
                {!participantsAndProvidersConfig[field]?.otherType && (
                  <ReadOnlySectionNew
                    config={participantsAndProvidersConfig[field]}
                    values={allparticipantsAndProvidersData}
                    namespace="participantsAndProviders"
                    filteredView={filteredView}
                  />
                )}
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default ReadOnlyParticipantsAndProviders;
