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

const ViewTeam = ({ data: { loading, me }, match: { params: { teamId, userId } } }) => {
  if (loading) return null;
  const { teams, username } = me;
  if (!teams || teams.length === 0) return (<Redirect to="/create-team" />);
  const isTeamIdInteger = parseInt(teamId, 10);
  const teamIdx = isTeamIdInteger ? findIndex(teams, ['id', isTeamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar teams={teams.map(teamAndLetterName)} team={team} username={username} />
      {/* <Header channelName={channel.name} />
      <MessageContainer channelId={channel.id} /> */}
      <SendMessage onSubmit={() => {}} placeholder={userId} />
    </AppLayout>
  );
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
