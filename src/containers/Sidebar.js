import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import getUsername from '../utils/user';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/team';

const teamAndLetterName = team => ({ id: team.id, letter: team.name.charAt(0).toUpperCase() });

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
  };

  handleCloseAddChannelModal = () => this.setState({ openAddChannelModal: false });
  
  handleAddChannelClick = () => this.setState({ openAddChannelModal: true });

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;
    if (loading) return null;
    const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
    const team = allTeams[teamIdx];
    const username = getUsername();

    return [
      <Teams
        key="team-sidebar"
        teams={allTeams.map(teamAndLetterName)}
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

export default graphql(allTeamsQuery)(Sidebar);