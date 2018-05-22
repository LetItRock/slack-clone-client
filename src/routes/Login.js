import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this[name] = value;
  };

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: {
        email,
        password,
      },
    });
    const { ok, token, refreshToken, errors } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push("/view-team");
    } else {
      const err = errors.reduce((acc, { path, message }) => {
        acc[`${path}Error`] = message;
        return acc;
      }, {});
      this.errors = err;
    }
  };

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;
    const errorsList = [];
    if (emailError) {
      errorsList.push(emailError);
    }
    if (passwordError) {
      errorsList.push(passwordError);
    }
    return (
      <Container>
        <Form>
          <Header as="h2">Login</Header>
          <Form.Field
            error={!!emailError}
          >
            <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          </Form.Field>
          <Form.Field
            error={!!passwordError}
          >
            <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Password" fluid />
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
const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(loginMutation)(observer(Login));