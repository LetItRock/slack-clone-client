import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const ENTER_KEY = 13;

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({
  channelName,
  values,
  handleSubmit,
  handleChange,
  handleBlur,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      name="message"
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={e => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) handleSubmit(e);
      }}
      value={values.message}
      fluid
      placeholder={`Message #${channelName}`}
    />
  </SendMessageWrapper>
);

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: props => ({ message: '' }),
    handleSubmit: async ({ message }, { props: { channelId, mutate }, resetForm, setSubmitting }) => {
      if (!message || !message.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: { channelId, text: message },
      });
      resetForm(false);
    },
  }),
)(SendMessage);
