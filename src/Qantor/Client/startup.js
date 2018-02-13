import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Views/Main/main'
import { HashRouter } from 'react-router-dom';
import AuthService from './Services/auth-service';

const auth = new AuthService();

ReactDOM.render(<HashRouter><Main auth={auth}/></HashRouter>, document.getElementById('root'));
