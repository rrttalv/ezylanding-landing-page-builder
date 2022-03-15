import React from 'react';
import { Route } from 'mobx-router';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { Editor } from '../components/Editor/Editor';
import { AuthPage } from '../components/Auth/AuthPage';

const views = {
  home: new Route({
    path: '/dashboard',
    component: <Dashboard/>,
    title: 'Home'
  }),
  auth: new Route({
    path: '/auth',
    component: <AuthPage/>,
    title: 'Authenticate'
  }),
  roll: new Route({
    path: '/editor',
    component: <Editor />,
    title: 'Editor'
  })
};

export default views;