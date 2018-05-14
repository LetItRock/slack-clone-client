import React from 'react';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';

export default () => (
  <AppLayout>
    <Sidebar currentTeamId={5} />
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
