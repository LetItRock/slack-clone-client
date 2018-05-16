import React from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });

const ViewTeam = ({ data: { loading, allTeams, inviteTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) return null;
  if ((!allTeams && !inviteTeams) || (allTeams.length === 0 && inviteTeams.length === 0)) return (<Redirect to="/create-team" />);
  const teams = [...allTeams, ...inviteTeams];
  const isTeamIdInteger = parseInt(teamId, 10);
  const teamIdx = isTeamIdInteger ? findIndex(teams, ['id', isTeamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const isChannelIdInteger = parseInt(channelId, 10);
  const channelIdx = isChannelIdInteger ? findIndex(team.channels, ['id', isChannelIdInteger]) : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar teams={teams.map(teamAndLetterName)} team={team} />
      {channel && <Header channelName={channel.name} />}
      {channel &&
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li></li>
            <li></li>
          </ul>
        </Messages>
      }
      {channel && <SendMessage channelName={channel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
