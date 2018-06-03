import React from 'react';
import { Form, Button, Modal, Input, Checkbox } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { meQuery } from '../graphql/user';
import MultiSelectUsers from './MultiSelectUsers';

const handleOnClose = (onClose, resetForm) => e => {
  resetForm();
  onClose(e);
};

const handleCheckboxChange = setFieldValue => (e, { checked }) => setFieldValue('public', !checked);

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
  setFieldValue,
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
          <Form.Field>
            <Checkbox value={!values.public} onChange={handleCheckboxChange(setFieldValue)} label="Private" toggle />
          </Form.Field>
          {values.public ? null : (
            <Form.Field>
              <MultiSelectUsers
                teamId={teamId}
                value={values.members}
                handleChange={(e, { value }) => setFieldValue('members', value)}
                placeholder="Select members to invite"
              />
            </Form.Field>
          )}
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
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
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
    mapPropsToValues: props => ({ public: true, name: '', members: [] }),
    handleSubmit: async (values, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name: values.name, public: values.public, members: values.members },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
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
