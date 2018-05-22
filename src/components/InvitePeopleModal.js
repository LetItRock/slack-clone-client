import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import normalizeErrors from '../utils/normalizeErrors';

const InvitePeopleModal = ({
  teamId,
  open,
  onClose,
  values,
  handleSubmit,
  handleChange,
  handleBlur,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal open={open} onClose={onClose} className="scrolling">
    <Modal.Header>Add People to your team</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form>
          <Form.Field>
            <Input
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              fluid
              placeholder='Users email...'
            />
          </Form.Field>
          {touched.email && errors.email ? errors.email[0] : null}
          <Form.Group width="equal">
            <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Add user</Button>
          </Form.Group>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

const addTeamMember = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMember),
  withFormik({
    mapPropsToValues: props => ({ email: '' }),
    handleSubmit: async ({ email }, { props: { teamId, mutate, onClose }, setSubmitting, setErrors }) => {
      const response = await mutate({
        variables: { teamId, email },
      });
      const { ok, errors } = response.data.addTeamMember;
      if (ok) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        const errorsLength = errors.length;
        const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
        if (errorsLength !== filteredErrors.length) {
          filteredErrors.push({
            path: 'email',
            message: 'this user is already part of the team',
          });
        }
        setErrors(normalizeErrors(filteredErrors));
      }
    },
  }),
)(InvitePeopleModal);
