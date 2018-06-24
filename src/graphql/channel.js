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

export const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`;
