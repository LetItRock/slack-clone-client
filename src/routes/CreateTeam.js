import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this[name] = value;
  };

  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: {
        name,
      },
    });
    const { ok, errors } = response.data.createTeam;
    if (ok) {
      this.props.history.push("/");
    } else {
      const err = errors.reduce((acc, { path, message }) => {
        acc[`${path}Error`] = message;
        return acc;
      }, {});
      this.errors = err;
    }
  };

  render() {
    const { name , errors: { nameError } } = this;
    const errorsList = [];
    if (nameError) {
      errorsList.push(nameError);
    }
    return (
      <Container>
        <Form>
          <Header as="h2">Create a team</Header>
          <Form.Field
            error={!!nameError}
          >
            <Input name="name" onChange={this.onChange} value={name} placeholder="Name" fluid />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorsList.length
          ? (<Message 
              error
              header="There was some errors with your submission"
              list={errorsList}
            />)
          : null
        }
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation ($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(createTeamMutation)(observer(CreateTeam));