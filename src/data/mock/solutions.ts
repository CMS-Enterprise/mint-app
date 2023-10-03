import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';
import { OperationalSolutionKey } from 'gql/gen/graphql';

export const pointsOfContact = [
  {
    __typename: 'PossibleOperationalSolutionContact',
    id: '123',
    name: 'John Mint',
    email: 'john.mint@oddball.io',
    isTeam: false,
    role: 'Project lead'
  }
];

export const possibleSolutionsMock = [
  {
    request: {
      query: GetPossibleSolutions
    },
    result: {
      data: {
        possibleOperationalSolutions: {
          __typname: 'PossibleOperationalSolutions',
          id: '123',
          key: OperationalSolutionKey.INNOVATION,
          pointsOfContact
        }
      }
    }
  }
];

const allMocks = [...possibleSolutionsMock];

export default allMocks;
