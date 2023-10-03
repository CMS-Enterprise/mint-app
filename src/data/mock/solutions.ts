import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';

export const possibleSolutionsMock = [
  {
    request: {
      query: GetPossibleSolutions
    },
    result: {
      data: {
        possibleOperationalSolutions: {
          __typname: '',
          id: '123',
          key: '4INN',
          pointsOfContact: [
            {
              __typename: 'PossibleOperationalSolutionContact',
              id: '456',
              name: 'John Mint',
              email: 'john.mint@oddball.io',
              isTeam: false,
              role: 'Project lead'
            }
          ]
        }
      }
    }
  }
];

const allMocks = [...possibleSolutionsMock];

export default allMocks;
