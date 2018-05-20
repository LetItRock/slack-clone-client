import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { meQuery, directMessageMeQuery } from '../graphql/user';
import { createDirectMessageMutation } from '../graphql/directMessage';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });
const onSubmit = (mutate, receiverId, receiverName, teamId) => async text => await mutate({ 
  variables: { text, receiverId, teamId },
  optimisticResponse: {
    createDirectMessage: true,
  },
  update: (store, { data: { createChannel } }) => {
    const data = store.readQuery({ query: meQuery });
    const teamIdx = findIndex(data.me.teams, ['id', teamId]);
    // check if we have direct message member already in list
    const notAlreadyThere = data.me.teams[teamIdx].directMessageMembers.every(member => member.id !== receiverId);
    if (notAlreadyThere) {
      data.me.teams[teamIdx].directMessageMembers.push({
        __typename: 'User',
        id: receiverId,
        username: receiverName,
      });
      store.writeQuery({ query: meQuery, data });
    }
  },
});

const ViewTeam = ({ mutate, data: { loading, me, getUser }, match: { params: { teamId, userId } } }) => {
  if (loading) return null;
  const { teams, username } = me;
  if (!teams || teams.length === 0) return (<Redirect to="/create-team" />);
  const isTeamIdInteger = parseInt(teamId, 10);
  const teamIdx = isTeamIdInteger ? findIndex(teams, ['id', isTeamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  const receiverName = getUser.username;
  return (
    <AppLayout>
      <Sidebar teams={teams.map(teamAndLetterName)} team={team} username={username} />
      <Header channelName={receiverName} />
      <DirectMessageContainer teamId={team.id} userId={userId} />
      <SendMessage onSubmit={onSubmit(mutate, parseInt(userId, 10), receiverName, team.id)} placeholder={userId} />
    </AppLayout>
  );
};

export default compose(
  graphql(directMessageMeQuery,
    {
      options: props => ({ variables: { userId: props.match.params.userId }, fetchPolicy: 'network-only' }),
    },
  ),
  graphql(createDirectMessageMutation),
)(ViewTeam);
