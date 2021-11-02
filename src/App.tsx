import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Notify } from './Notify'

function App() {
  return (
    <Router basename={window.__POWERED_BY_QIANKUN__ ? '/' : '/'}>
      <Switch>
        <Route path="/">
          {/* <Notify /> */}
          <div></div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
