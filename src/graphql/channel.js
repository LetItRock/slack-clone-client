import gql from 'graphql-tag';

export const getOrCreateDmChannelMutation = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateDmChannel(teamId: $teamId, members: $members) {
      id
      name
      dm
    }
  }
`;