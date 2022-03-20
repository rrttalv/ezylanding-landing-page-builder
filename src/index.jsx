import React from 'react';
import ReactDOM from 'react-dom';
import { MobxRouter, startRouter } from 'mobx-router';
import { Provider } from 'mobx-react';
import store from './mobx/store';
import { App } from './App'
import './index.scss'
import views from './routes/views';


startRouter(views, store);

ReactDOM.render(
  <Provider store={{...store}}>
      <App />
    <MobxRouter store={store} />
  </Provider>, document.getElementById('root')
);