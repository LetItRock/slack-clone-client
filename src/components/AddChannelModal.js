import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { meQuery } from '../graphql/user';

const handleOnClose = (onClose, resetForm) => e => {
  resetForm();
  onClose(e);
};

const AddChannelModal = ({
  teamId,
  open,
  onClose,
  values,
  handleSubmit,
  handleChange,
  handleBlur,
  isSubmitting,
  resetForm,
}) => (
  <Modal open={open} onClose={handleOnClose(onClose, resetForm)} className="scrolling">
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
            <Button disabled={isSubmitting} onClick={handleOnClose(onClose, resetForm)} fluid>Cancel</Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create channel</Button>
          </Form.Group>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: props => ({ name: '' }),
    handleSubmit: async ({ name }, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: name,
            }
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) return;
          // read data from the cache
          const data = store.readQuery({ query: meQuery });
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          store.writeQuery({ query: meQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
