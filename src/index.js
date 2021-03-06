import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo';
import 'semantic-ui-css/semantic.min.css';

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();