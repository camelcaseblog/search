import React, { Component } from 'react';
import AsyncSelect  from 'react-select/lib/Async';
import stringSimilarity from "string-similarity"
import levenshtein from 'fast-levenshtein';
import _ from "lodash"

const values = ["George Washington", "John Adams", "Thomas Jefferson", "James Madison", "James Monroe", "John Quincy Adams", "Andrew Jackson", "Martin van Buren", "William Henry Harrison", "John Tyler", "James Polk", "Zachary Taylor", "Millard Fillmore", "Franklin Pierce", "James Buchanan", "Abraham Lincoln", "Andrew Johnson", "Ulysses S. Grant", "Rutherford B. Hayes", "James Abram Garfield", "Chester Alan Arthur", "Grover Cleveland", "Benjamin Harrison", "Grover Cleveland", "William McKinley", "Theodore Roosevelt", "William Howard Taft", "Woodrow (Thomas) Wilson", "Warren Gamaliel Harding", "Calvin (John) Coolidge", "Herbert Clark Hoover", "Franklin Delano Roosevelt", "Harry S. Truman", "Dwight (David) Eisenhower", "John Fitzgerald Kennedy", "Lyndon Baines Johnson", "Richard Milhouse Nixon", "Gerald Rudolph Ford", "Jimmy Carter", "Ronald Wilson Reagan", "George Herbert Walker Bush", "William (Bill) Jefferson Clinton", "George Walker Bush", "Barack Hussein Obama", "Donald Trump"]

const urlParams =  (() => {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
})()
const { searchType } = urlParams

class App extends Component {

  startsWithFilter = inputValue => values.filter(c => c.toLocaleLowerCase().startsWith(inputValue))
  includesFilter = inputValue => values.filter(c => c.toLocaleLowerCase().includes(inputValue))
  levenshteinFilter = inputValue => {
    let options = values.map(c => ({ color: c, dist: levenshtein.get(c.toLocaleLowerCase(), inputValue, { useCollator: true})/Math.max(inputValue.length, c.length) }))
    options = _.sortBy(options, ['dist']).slice(50)
    options = options.map(({ color }) => color)
    return options
  }
  levenshteinFilter = inputValue => {
    let options = values.map(c => ({ color: c, dist: levenshtein.get(c.toLocaleLowerCase(), inputValue, { useCollator: true})/Math.max(inputValue.length, c.length) }))
    options = options = _.sortBy(options, ['dist'])
    options = options.filter(o => o.dist <= 0.5)
    console.log(options)
    options = options.slice(0, 50)
    options = options.map(({ color }) => color)
    return options
  }
  similarityFilter = inputValue => {
    let options = values.map(c => ({ color: c, dist: 1 - stringSimilarity.compareTwoStrings(c.toLocaleLowerCase(), inputValue) }))
    options = options = _.sortBy(options, ['dist'])
    console.log(options)
    options = options.filter(o => o.dist <= 0.5)
    options = options.slice(0, 50)
    options = options.map(({ color }) => color)
    return options
  }
  loadOptions = (inputValue, callback) => {
    inputValue = (inputValue || '').toLocaleLowerCase()
    let valuesToShow
    switch(searchType){
    case 'includes':
      console.log('includes')
      valuesToShow = this.includesFilter(inputValue)
      break;
    case 'levenshtein':
      console.log('levenshtein')
      valuesToShow = this.levenshteinFilter(inputValue)
      break;
    case 'similarity':
      console.log('similarity')
      valuesToShow = this.similarityFilter(inputValue)
      break;
    case 'startsWith':
    default:
        console.log('startsWith')
        valuesToShow = this.startsWithFilter(inputValue)
    }
    const options = valuesToShow.map(c => ({ value: c, label: c }))
    callback(options)
  }
  render() {
    return (
      <div>
          <AsyncSelect
            style={{ width: '500px' }}
            loadOptions={this.loadOptions}
          />
      </div>
    );
  }
}

export default App;
