import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { meQuery } from '../graphql/user';
import { createDirectMessageMutation } from '../graphql/directMessage';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });
const onSubmit = (mutate, receiverId, teamId) => async text => {
  const response = await mutate({ variables: { text, receiverId, teamId } });
  console.log(response);
};

const ViewTeam = ({ mutate, data: { loading, me }, match: { params: { teamId, userId } } }) => {
  if (loading) return null;
  const { teams, username } = me;
  if (!teams || teams.length === 0) return (<Redirect to="/create-team" />);
  const isTeamIdInteger = parseInt(teamId, 10);
  const teamIdx = isTeamIdInteger ? findIndex(teams, ['id', isTeamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar teams={teams.map(teamAndLetterName)} team={team} username={username} />
      <Header channelName={"channel.name"} />
      <DirectMessageContainer teamId={team.id} userId={userId} />
      <SendMessage onSubmit={onSubmit(mutate, userId, team.id)} placeholder={userId} />
    </AppLayout>
  );
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(ViewTeam);
