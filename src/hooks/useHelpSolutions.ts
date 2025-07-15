// Hook to fetch solution contacts and map to FE help solution map

import { useMemo } from 'react';
import {
  HelpSolutionBaseType,
  helpSolutions,
  HelpSolutionType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  GetMtoSolutionContactsQuery,
  useGetMtoSolutionContactsQuery
} from 'gql/generated/graphql';

type UseHelpSolutionType = {
  helpSolutions: HelpSolutionType[];
  loading: boolean;
};

export const mapContactsToSolutions = (
  solutions: HelpSolutionBaseType[],
  contactSolutions: GetMtoSolutionContactsQuery['mtoCommonSolutions']
): HelpSolutionType[] => {
  return solutions.map(solution => {
    // Find fetch possible solution that corresponds to the FE `enum` mapped solution
    const foundSolution = contactSolutions?.find(
      contactSolution => solution.enum === contactSolution.key
    );

    // Add fetch pointsOfContact field to existing FE solution map
    return {
      ...solution,
      contractors: foundSolution?.contractors,
      pointsOfContact: foundSolution?.contactInformation.pointsOfContact,
      systemOwners: foundSolution?.systemOwners
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

  return { helpSolutions: helpSolutionsWithContacts, loading };
};

export default useHelpSolution;
