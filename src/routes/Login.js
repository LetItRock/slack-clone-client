import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Input, Container, Header } from 'semantic-ui-react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this[name] = value;
  };

  onSubmit = () => {
    console.log(this.email, this.password);
  };

  render() {
    const { email, password } = this;
    return (
      <Container>
        <Header as="h2">Login</Header>
        <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
        <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Password" fluid />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    );
  }
}

export default observer(Login);