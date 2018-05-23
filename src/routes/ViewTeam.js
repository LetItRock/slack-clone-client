import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';
import { meQuery } from '../graphql/user';
import { createMessageMutation } from '../graphql/message';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });
const onSubmit = (mutate, channelId) => async (text) => await mutate({ variables: { text, channelId } });

const ViewTeam = ({ mutate, data: { loading, me }, match: { params: { teamId, channelId } } }) => {
  if (loading) return null;
  const { teams, username } = me;
  if (!teams || teams.length === 0) return (<Redirect to="/create-team" />);
  const isTeamIdInteger = parseInt(teamId, 10);
  const teamIdx = isTeamIdInteger ? findIndex(teams, ['id', isTeamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const isChannelIdInteger = parseInt(channelId, 10);
  const channelIdx = isChannelIdInteger ? findIndex(team.channels, ['id', isChannelIdInteger]) : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar teams={teams.map(teamAndLetterName)} team={team} username={username} />
      {channel && <Header channelName={channel.name} />}
      {channel &&
        <MessageContainer channelId={channel.id} />
      }
      {channel && <SendMessage onSubmit={onSubmit(mutate, channel.id)} placeholder={channel.name} channelId={channel.id}/>}
    </AppLayout>
  );
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
