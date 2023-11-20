// Hook to fetch solution contacts and map to FE help solution map

import { useMemo } from 'react';
import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';
import { GetPossibleSolutionsQuery } from 'gql/gen/graphql';

import {
  HelpSolutionBaseType,
  helpSolutions,
  HelpSolutionType
} from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import useCacheQuery from './useCacheQuery';

type UseHelpSolutionType = {
  helpSolutions: HelpSolutionType[];
  loading: boolean;
};

export const mapContactsToSolutions = (
  solutions: HelpSolutionBaseType[],
  contactSolutions: GetPossibleSolutionsQuery['possibleOperationalSolutions']
): HelpSolutionType[] => {
  return solutions.map(solution => {
    // Find fetch possible solution that corresponds to the FE `enum` mapped solution
    const foundSolution = contactSolutions?.find(
      contactSolution => solution.enum === contactSolution.key
    );

    // Add fetch pointsOfContact field to existing FE solution map
    return {
      ...solution,
      pointsOfContact: foundSolution?.pointsOfContact
    };
  });
};

const useHelpSolution = (): UseHelpSolutionType => {
  const { data, loading } = useCacheQuery(GetPossibleSolutions);

  const helpSolutionsWithContacts = useMemo(() => {
    return mapContactsToSolutions(
      helpSolutions,
      data?.possibleOperationalSolutions || []
    );
  }, [data?.possibleOperationalSolutions]);

  return { helpSolutions: helpSolutionsWithContacts, loading };
};

export default useHelpSolution;
