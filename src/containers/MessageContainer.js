import React from 'react';
import { graphql } from 'react-apollo';
import { Comment, Button } from 'semantic-ui-react';
import FileUpload from '../components/FileUpload';
import RenderText from '../components/RenderText';
import { messagesQuery, newChannelMessageSubscription } from '../graphql/message';

const containerStyles = {
  gridColumn: 3,
  gridRow: 2,
  paddingLeft: '20px',
  paddingRight: '20px',
  display: 'flex',
  flexDirection: 'column-reverse',
  overflowY: 'auto',
};

const imageStyle = {
  width: '300px',
  height: '200px',
  display: 'block',
  margin: '10px 0',
};

const audioStyle = {
  display: 'block',
  margin: '10px 0',
};

const Message = ({ message: { url, filetype, text } }) => {
  if (url) {
    if (filetype.startsWith('image/')) return <img src={url} style={imageStyle} alt="" />;
    if (filetype.startsWith('text/')) return <RenderText url={url} />;
    if (filetype.startsWith('audio/')) return <audio style={audioStyle} controls><source src={url} type={filetype} /></audio>;
  }
  return <Comment.Text>{text}</Comment.Text>;
}
class MessageContainer extends React.Component {
  state = {
    hasMoreItems: true,
  };

  componentWillMount() {
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
    });

  handleFetchMore = () => {
    this.props.data.fetchMore({
      variables: {
        channelId: this.props.channelId,
        offset: this.props.data.messages.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        if (fetchMoreResult.messages.length < 35) this.setState({ hasMoreItems: false });

        return {
          ...previousResult,
          messages: [...previousResult.messages, ...fetchMoreResult.messages],
        };
      },
    });
  };
  
  render() {
    const { data: { loading, messages }, channelId } = this.props;
    if (loading) return null;

    return (
      <FileUpload style={containerStyles} disableClick channelId={channelId}>
        <Comment.Group>
          {this.state.hasMoreItems && <Button onClick={this.handleFetchMore}>Load more...</Button>}
          {messages.map(message => (
            <Comment key={`${message.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">
                  {message.user.username}
                </Comment.Author>
                <Comment.Metadata>
                  {message.created_at}
                </Comment.Metadata>
                <Message message={message} />
                <Comment.Actions>
                  <Comment.Action>
                    Reply
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </FileUpload>
    );
  }
}

export default graphql(messagesQuery, {
  options: (props) => ({ // is called with props change
    variables: {
      channelId: props.channelId,
      offset: 0,
    },
    fetchPolicy: 'network-only', // fetch messages always
  }),
})(MessageContainer);
