import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      created_at
      user {
        username
      }
    }
  }
`;
class MessageContainer extends React.Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId: this.props.channelId, // gonna be argument to newChannelMessage
      },
      updateQuery: (prev, { subscriptionData: { data } }) => { // data coming from server subscription
        if (!data) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data.newChannelMessage],
        };
      }
    });
  }
  
  render() {
    const { data: { loading, messages } } = this.props;
    if (loading) return null;

    return (
      <Messages>
        <Comment.Group>
          {messages.map(message => (
            <Comment key={`${message.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">
                  {message.user.username}
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

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      created_at
      user {
        username
      }
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => ({ channelId: props.channelId }),
})(MessageContainer);
