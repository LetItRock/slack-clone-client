import React from 'react';
import { graphql } from 'react-apollo';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';
import { directMessagesQuery } from '../graphql/directMessage';

class DirectMessageContainer extends React.Component {
  /* componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId: channelId, // gonna be argument to newChannelMessage
      },
      updateQuery: (prev, { subscriptionData: { data } }) => { // data coming from server subscription
        if (!data) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data.newChannelMessage],
        };
      }
    }); */
  
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
