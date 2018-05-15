import React from 'react';
import { Form, Button, Header, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const AddChannelModal = ({
  teamId,
  open,
  onClose,
  values,
  handleSubmit,
  handleChange,
  handleBlur,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose} className="scrolling">
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form>
          <Form.Field>
            <Input
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              fluid
              placeholder='Channel name...'
            />
          </Form.Field>
          <Form.Group width="equal">
            <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create channel</Button>
          </Form.Group>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name)
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: props => ({ name: '' }),
    handleSubmit: async ({ name }, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      const { data: { createChannel }} = await mutate({ variables: { teamId, name } });
      if (createChannel) {
        onClose();
      }
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
