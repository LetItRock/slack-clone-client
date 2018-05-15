import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import getUsername from '../utils/user';
import Channels from '../components/Channels';
import Teams from '../components/Teams';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });

const Sidebar = ({ data: { allTeams, loading }, currentTeamId }) => {
  if (loading) return null;
  const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
  const team = allTeams[teamIdx];
  const username = getUsername();

  return [
    <Teams
      key="team-sidebar"
      teams={allTeams.map(teamAndLetterName)}
    />,
    <Channels
      key="channels-sidebar"
      teamName={team.name}
      username={username}
      channels={team.channels}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'User1' }]}
    />
  ];
}

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);