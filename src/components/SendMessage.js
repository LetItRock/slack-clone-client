import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';

const ENTER_KEY = 13;

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({
  placeholder,
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
      placeholder={`Message #${placeholder}`}
    />
  </SendMessageWrapper>
);



export default withFormik({
  mapPropsToValues: props => ({ message: '' }),
  handleSubmit: async ({ message }, { props: { onSubmit, mutate }, resetForm, setSubmitting }) => {
    if (!message || !message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(message);
    resetForm(false);
  },
  })(SendMessage);
