import React from 'react';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

export default () => (
  <AppLayout>
    <Teams teams={[{ id: 1, letter: 'T' }, { id: 2, letter: 'Q' }]}/>
    <Channels
      teamName="My team"
      username="LetItRock"
      channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'User1' }]}
    />
    <Header channelName="general" />
    <Messages>
      <ul className="message-list">
        <li></li>
        <li></li>
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </AppLayout>
);
