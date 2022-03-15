// Module imports
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'





// Local imports
import './scss/reset.scss'
import './scss/app.scss'
import { App } from './components/App.jsx'





const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)
root.render((
  <React.StrictMode>
    <App />
  </React.StrictMode>
))
