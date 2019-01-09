import ReactDOM from 'react-dom';
import React from 'react';
import './styles/styles.scss';
import 'normalize.css/normalize.css';
import AppRouter from './routers/AppRouter';


ReactDOM.render(<AppRouter/>, document.getElementById('app'));