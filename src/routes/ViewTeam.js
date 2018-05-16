import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) return null;
  const teamIdx = !!teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
  const team = allTeams[teamIdx];
  const channelIdx = !!channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar teams={allTeams.map(teamAndLetterName)} team={team} />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul className="message-list">
          <li></li>
          <li></li>
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
