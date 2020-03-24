import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import Navigation from './Navigation'
import Main from './Main.jsx'

class App extends React.Component {
    render() {
console.log('jbf?')
        return (
          <div className="App">
            <header className="App-header">
              <Router>
                  <Grid>
                    <Grid.Column width={3}>
                      <Route path="/" render={(props) => {return <Navigation {...props} />}} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Route path="/" render={(props) => {return <Main {...props} />}} />
                    </Grid.Column>
                  </Grid>
              </Router>
            </header>
          </div>
        )
    }
}

export default App;