import React from 'react';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends React.Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password },
    });
    const { ok, errors } = response.data.register;
    if (ok) {
      this.props.history.push('/');
    } else {
      const err = errors.reduce((acc, { path, message }) => {
        acc[`${path}Error`] = message;
        return acc;
      }, {});
      this.setState(err);
    }
  };

  render() {
    const { username, usernameError, email, emailError, password, passwordError } = this.state;
    const errorsList = [];
    if (usernameError) {
      errorsList.push(usernameError);
    }
    if (emailError) {
      errorsList.push(emailError);
    }
    if (passwordError) {
      errorsList.push(passwordError);
    }
    return (
      <Container>
        <Form>
          <Header as="h2">Register</Header>
          <Form.Field
            error={!!usernameError}
          >
            <Input
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
              fluid
            />
          </Form.Field>
          <Form.Field
            error={!!emailError}
          >
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field
            error={!!passwordError}
          >
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password" 
              placeholder="Password"
              fluid
            />
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

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
