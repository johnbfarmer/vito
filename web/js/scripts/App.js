import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Summary from './Summary'

class App extends React.Component {
    render() {
        return (
          <div className="App">
            <header className="App-header">
              <Router>
                <Route path="/:agg/:numUnits/:endDate" render={(props) => {return <Summary { ...props } />}} />
                <Route path="/:unitType/:unit/:agg/:fake" render={(props) => {return <Summary { ...props } />}} />
                <Route path="/:agg/:units" exact render={(props) => {return <Summary { ...props } />}} />
                <Route path="/" exact render={(props) => {return <Summary { ...props } />}} />
              </Router>
            </header>
          </div>
        )
    }
}

export default App;