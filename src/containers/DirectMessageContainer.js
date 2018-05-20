import React from 'react';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';
import { directMessagesQuery, newDirectMessageSubscription } from '../graphql/directMessage';

class DirectMessageContainer extends React.Component {
  componentWillMount() {
    const { teamId, userId } = this.props;
    this.unsubscribe = this.subscribe(teamId, userId);
  }

  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  subscribe = (teamId, userId) =>
    this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId, // gonna be argument to newChannelMessage
        userId,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => { // data coming from server subscription
        if (!data) return prev;
        return {
          ...prev,
          directMessages: [...prev.directMessages, data.newDirectMessage],
        };
      }
    });
  
  render() {
    const { data: { loading, directMessages } } = this.props;
    if (loading) return null;
    return (
      <Messages>
        <Comment.Group>
          {directMessages.map(message => (
            <Comment key={`${message.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author as="a">
                  {message.sender.username}
                </Comment.Author>
                <Comment.Metadata>
                  {message.created_at}
                </Comment.Metadata>
                <Comment.Text>
                  {message.text}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action>
                    Reply
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

export default graphql(directMessagesQuery, {
  options: (props) => ({ // is called with props change
    variables: {
      teamId: props.teamId,
      userId: props.userId,
    },
    fetchPolicy: 'network-only', // fetch direct messages always
  }),
})(DirectMessageContainer);
