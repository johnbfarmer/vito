import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Edit from './Edit'
import Summary from './Summary'
import ExerciseVideos from './ExerciseVideos';

const dataModel = JSON.parse(document.getElementById("content").dataset.model)

class App extends React.Component {
    render() {
        return (
          <div className="App">
            <header className="App-header">
              <Router>
                <Route path="/vito/:id/edit" exact render={(props) => {return <Edit { ...props } { ...dataModel } />}} />
                <Route path="/:agg/:numUnits/:endDate" exact render={(props) => {return <Summary { ...props } { ...dataModel } />}} />
                <Route path="/:agg/:numUnits" exact render={(props) => {return <Summary { ...props } { ...dataModel } />}} />
                <Route path="/vids" exact render={(props) => {return <ExerciseVideos { ...props } { ...dataModel } />}} />
                <Route path="/" exact render={(props) => {return <Summary { ...props } { ...dataModel } />}} />
              </Router>
            </header>
          </div>
        )
    }
}

export default App;