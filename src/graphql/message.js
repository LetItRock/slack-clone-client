import gql from 'graphql-tag';

export const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      created_at
      url
      filetype
      user {
        username
      }
    }
  }
`;

export const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      created_at
      url
      filetype
      user {
        username
      }
    }
  }
`;

export const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export const createFileMessageMutation = gql`
  mutation($channelId: Int!, $file: File) {
    createMessage(channelId: $channelId, file: $file)
  }
`;
