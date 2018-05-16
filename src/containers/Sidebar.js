import React from 'react';
import getUsername from '../utils/user';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
  };

  handleCloseAddChannelModal = () => this.setState({ openAddChannelModal: false });
  
  handleAddChannelClick = () => this.setState({ openAddChannelModal: true });

  render() {
    const { teams, team } = this.props;
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
      />,
      <AddChannelModal
        teamId={team.id}
        open={this.state.openAddChannelModal}
        onClose={this.handleCloseAddChannelModal}
        key="add-channel-modal-sidebar"
      />
    ];
  }
}

export default Sidebar;