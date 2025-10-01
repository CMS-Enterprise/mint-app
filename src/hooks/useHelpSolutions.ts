// Hook to fetch solution contacts and map to FE help solution map

import { useMemo } from 'react';
import {
  helpSolutions,
  HelpSolutionsType,
  HelpSolutionType
  // SolutionModelUsageType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetMtoSolutionContactsQuery,
  ModelStatus,
  MtoCommonSolutionKey,
  useGetMtoSolutionContactsQuery
} from 'gql/generated/graphql';

import { getKeys } from 'types/translation';

type UseHelpSolutionType = {
  helpSolutions: HelpSolutionType[];
  loading: boolean;
};

export const mapContactsToSolutions = (
  solutions: HelpSolutionsType,
  contactSolutions: GetMtoSolutionContactsQuery['mtoCommonSolutions']
): HelpSolutionType[] => {
  return getKeys(solutions).map(solution => {
    // Find fetch possible solution that corresponds to the FE `enum` mapped solution
    const foundSolution = contactSolutions?.find(
      contactSolution => solution === contactSolution.key
    );

    // Add fetch pointsOfContact field to existing FE solution map
    return {
      ...solutions[solution],
      contractors: foundSolution?.contractors,
      pointsOfContact: foundSolution?.contactInformation.pointsOfContact,
      systemOwners: foundSolution?.systemOwners
    };
  });
};

export const mapModelUsageToSolutions = (
  solutions: HelpSolutionsType,
  // todo(Elle) replace it with query[''] type
  modelUsageSolutions: {
    key: MtoCommonSolutionKey;
    modelUsage: {
      modelName: string;
      modelStatus: ModelStatus;
    }[];
  }[]
): HelpSolutionType[] => {
  return getKeys(solutions).map(solution => {
    // Find fetch possible solution that corresponds to the FE `enum` mapped solution
    const foundSolution = modelUsageSolutions?.find(
      model => solution === model.key
    );

    // Add fetch model usage field to existing FE solution map
    return {
      ...solutions[solution],
      modelUsage: foundSolution?.modelUsage
    };
  });
};

const useHelpSolution = (): UseHelpSolutionType => {
  const { data, loading } = useGetMtoSolutionContactsQuery();

  const helpSolutionsWithContacts = useMemo(() => {
    return mapContactsToSolutions(
      helpSolutions,
      data?.mtoCommonSolutions || []
    );
  }, [data?.mtoCommonSolutions]);

  // const helpSolutionsWithModelUsage = useMemo(() => {
  //   return mapModelUsageToSolutions(
  //     helpSolutions,
  //     []
  //     // data?.modelUsageSolutions || []
  //   );
  // }, []);

  return { helpSolutions: helpSolutionsWithContacts, loading };
};

export default useHelpSolution;
