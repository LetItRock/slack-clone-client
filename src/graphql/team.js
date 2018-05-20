import gql from 'graphql-tag';

export const teamMembersQuery = gql`
  query($teamId: Int!) {
    teamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;