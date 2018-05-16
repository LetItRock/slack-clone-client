import React from 'react';
import getUsername from '../utils/user';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
  };

  handleCloseAddChannelModal = () => this.setState({ openAddChannelModal: false });
  
  handleAddChannelClick = () => this.setState({ openAddChannelModal: true });

  handleOnInvitePeopleClick = () => this.setState({ openInvitePeopleModal: true });

  handleCloseOnInvitePeopleModal = () => this.setState({ openInvitePeopleModal: false });

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;
    const username = getUsername();

    return [
      <Teams
        key="team-sidebar"
        teams={teams}
      />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'User1' }]}
        onAddChannelClick={this.handleAddChannelClick}
        onInvitePeopleClick={this.handleOnInvitePeopleClick}
      />,
      <AddChannelModal
        teamId={team.id}
        open={openAddChannelModal}
        onClose={this.handleCloseAddChannelModal}
        key="add-channel-modal-sidebar"
      />,
      <InvitePeopleModal
        teamId={team.id}
        open={openInvitePeopleModal}
        onClose={this.handleCloseOnInvitePeopleModal}
        key="invite-people-modal"
      />
    ];
  }
}

export default Sidebar;