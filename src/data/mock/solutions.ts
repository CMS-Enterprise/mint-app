import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';
import { OperationalSolutionKey } from 'gql/gen/graphql';

export const pointsOfContact = [
  {
    __typename: 'PossibleOperationalSolutionContact',
    id: '1267967874323',
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
        possibleOperationalSolutions: [
          {
            __typname: 'PossibleOperationalSolution',
            id: '1267679i6867663',
            key: OperationalSolutionKey.INNOVATION,
            pointsOfContact: [...pointsOfContact]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '2345256',
            key: OperationalSolutionKey.ACO_OS,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '235234',
                name: '4Inn/Aco',
                email: '4inn.mint@oddball.io',
                isTeam: true,
                role: ''
              }
            ]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '78968679',
            key: OperationalSolutionKey.APPS,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '454576365436',
                name: 'Brandon Bee',
                email: 'bee.mint@oddball.io',
                isTeam: false,
                role: 'CMMI Government Task Lead'
              }
            ]
          },
          {
            __typname: 'PossibleOperationalSolution',
            id: '116785636',
            key: OperationalSolutionKey.RMADA,
            pointsOfContact: [
              {
                __typename: 'PossibleOperationalSolutionContact',
                id: '4512341356',
                name: 'Alicia Thomas',
                email: 'at.mint@oddball.io',
                isTeam: false,
                role: 'Beneficiary Listening Session Point of Contact'
              }
            ]
          }
        ]
      }
    }
  }
];

const allMocks = [...possibleSolutionsMock];

export default allMocks;
