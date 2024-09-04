import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Grid, Link } from '@trussworks/react-uswds';

import Divider from 'components/shared/Divider';
import usePlanTranslation from 'hooks/usePlanTranslation';
import {
  getKeys,
  TranslationFieldProperties,
  TranslationPlan
} from 'types/translation';
import ReadOnlyBeneficiaries from 'views/ModelPlan/ReadOnly/Beneficiaries';
import ReadOnlyCRTDLs from 'views/ModelPlan/ReadOnly/CRTDLs';
import ReadOnlyGeneralCharacteristics from 'views/ModelPlan/ReadOnly/GeneralCharacteristics';
import ReadOnlyModelBasics from 'views/ModelPlan/ReadOnly/ModelBasics';
import ReadOnlyOpsEvalAndLearning from 'views/ModelPlan/ReadOnly/OpsEvalAndLearning';
import ReadOnlyParticipantsAndProviders from 'views/ModelPlan/ReadOnly/ParticipantsAndProviders';
import ReadOnlyPayments from 'views/ModelPlan/ReadOnly/Payments';
import ReadOnlyTeamInfo from 'views/ModelPlan/ReadOnly/Team';
import OperationalNeedsTable from 'views/ModelPlan/TaskList/ITSolutions/Home/operationalNeedsTable';

import {
  filteredGroupSolutions,
  filterGroupKey,
  filterGroups
} from './_filterGroupMapping';

const components: Record<string, React.ElementType> = {
  basics: ReadOnlyModelBasics,
  generalCharacteristics: ReadOnlyGeneralCharacteristics,
  participantsAndProviders: ReadOnlyParticipantsAndProviders,
  beneficiaries: ReadOnlyBeneficiaries,
  opsEvalAndLearning: ReadOnlyOpsEvalAndLearning,
  payments: ReadOnlyPayments
};

const FitleredViewSection = ({
  children,
  lastSection,
  sectionName
}: {
  children: React.ReactNode;
  lastSection?: boolean;
  sectionName: string;
}) => {
  return (
    <div
      className={`filtered-view-section filtered-view-section--${sectionName} margin-bottom-6 ${
        !lastSection
          ? 'border-bottom border-base-light padding-bottom-4'
          : 'padding-bottom-0'
      }`}
    >
      {children}
    </div>
  );
};

const BodyContent = ({
  modelID,
  filteredView
}: {
  modelID: string;
  filteredView: typeof filterGroups[number];
}) => {
  const { t } = useTranslation('filterView');
  const { t: opSolutionsMiscT } = useTranslation('opSolutionsMisc');

  const filterMappings = usePlanTranslation();

  const mappedQuestions = getAllFilterViewQuestions(
    filterMappings,
    filteredView
  );

  return (
    <Grid>
      <FitleredViewSection sectionName="model-team">
        <h2 className="margin-top-0 margin-bottom-4">{t('modelTeam')}</h2>
        <ReadOnlyTeamInfo
          modelID={modelID}
          isViewingFilteredView
          filteredView={filteredView}
        />
      </FitleredViewSection>

      {Object.keys(mappedQuestions).map(task => {
        const FitleredViewSectionContent = components[task];

        if (!FitleredViewSectionContent) return null;

        return (
          <FitleredViewSection
            sectionName={task}
            key={task}
            lastSection={task === Object.keys(mappedQuestions).pop()}
          >
            <FitleredViewSectionContent
              modelID={modelID}
              filteredView={filteredView}
            />
          </FitleredViewSection>
        );
      })}

      {/* Operational Solutions table for filtered views */}
      {filteredGroupSolutions[filteredView] && (
        <div>
          <Divider className="margin-top-8" />
          <h2 className="margin-top-5">
            {opSolutionsMiscT('headingReadOnly')}
          </h2>
          <OperationalNeedsTable
            className="margin-bottom-5"
            modelID={modelID}
            type="needs"
            readOnly
            hideGlobalFilter
            hiddenColumns={[opSolutionsMiscT('itSolutionsTable.actions')]}
            filterSolutions={filteredGroupSolutions[filteredView]}
          />
        </div>
      )}

      {/* CR and TDLs table for filtered views */}
      {filteredGroupSolutions[filteredView] && (
        <div>
          <Divider className="margin-y-8" />
          <ReadOnlyCRTDLs modelID={modelID} />
        </div>
      )}

      <div className="margin-top-4 padding-top-5 border-top-1px border-base-light">
        <Alert type="info" noIcon headingLevel="h4">
          <span className="margin-y-0 font-body-sm text-bold display-block">
            {t('alert.bodyContentHeading')}
          </span>
          <Trans i18nKey="filterView:alert.content">
            indexOne
            <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
            indexTwo
          </Trans>
        </Alert>
      </div>
    </Grid>
  );
};

/*
  Traversed all translation mappings to return an refined mapping pertaining to the relative filter view
*/
export const getAllFilterViewQuestions = (
  filterMappings: TranslationPlan,
  filteredView: typeof filterGroups[number]
) => {
  let mappedQuestions: Record<string, string[]> = {};

  // Diving into each model plan section, as well as each question to identify if it contains the appropriate filter view mapping
  getKeys(filterMappings).forEach(section => {
    getKeys(filterMappings[section]).forEach(question => {
      const filterGroupConfig = (filterMappings[section][
        question
      ] as TranslationFieldProperties)?.filterGroups;

      if (
        Array.isArray(filterGroupConfig) &&
        filterGroupConfig.includes(filterGroupKey[filteredView])
      ) {
        if (mappedQuestions[section as string]) {
          mappedQuestions[section as string].push(
            (filterMappings[section][question] as TranslationFieldProperties)
              .gqlField
          );
        } else {
          mappedQuestions[section as string] = [
            (filterMappings[section][question] as TranslationFieldProperties)
              .gqlField
          ];
        }
      }
    });
  });

  // Transferring mapped questions from modelPlan to basics. Readonly treats modelPlan as if were in basics schema
  if (mappedQuestions.modelPlan) {
    mappedQuestions = {
      basics: (mappedQuestions.basics || []).concat(mappedQuestions.modelPlan),
      ...mappedQuestions
    };
  }
  return mappedQuestions;
};

export default BodyContent;
