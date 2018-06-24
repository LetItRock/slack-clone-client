import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Form, Button, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import findIndex from 'lodash/findIndex';
import { meQuery } from '../graphql/user';
import { getOrCreateDmChannelMutation } from '../graphql/channel';
import MultiSelectUsers from './MultiSelectUsers';

const DirectMessageModal = ({
  teamId,
  open,
  onClose,
  currentUserId,
  values,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
}) => (
  <Modal open={open} onClose={onClose} className="scrolling">
    <Modal.Header>Direct Messaging</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form>
          <Form.Field>
            <MultiSelectUsers
              teamId={teamId}
              value={values.members}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              placeholder="Select members to message"
              currentUserId={currentUserId}
            />
          </Form.Field>
          <Form.Group>
            <Button
              disabled={isSubmitting}
              onClick={e => {
                resetForm();
                onClose(e);
              }}
              fluid
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Start Messaging</Button>
          </Form.Group>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default compose(
  withRouter,
  graphql(getOrCreateDmChannelMutation),
  withFormik({
    mapPropsToValues: props => ({ members: [] }),
    handleSubmit: async ({ members} , { props: { history, onClose, teamId, mutate }, resetForm }) => {
      await mutate({
        variables: { teamId, members },
        update: (store, { data: { getOrCreateDmChannel } }) => {
          const { id, name, dm } = getOrCreateDmChannel;
          const data = store.readQuery({ query: meQuery });
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          const notInChannelList = data.me.teams[teamIdx].channels.every(c => c.id !== id);
          if (notInChannelList) {
            data.me.teams[teamIdx].channels.push({ id, name, dm });
            store.writeQuery({ query: meQuery, data });
          }
          history.push(`/view-team/${teamId}/${id}`);
        },
      });
    },
  }),
)(DirectMessageModal);
