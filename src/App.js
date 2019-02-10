import React, { Component } from 'react';
import AsyncSelect  from 'react-select/lib/Async';
import stringSimilarity from "string-similarity"
import levenshtein from 'fast-levenshtein';
import _ from "lodash"

const colors = [
  'Blue',
  'Black',
  "Light Blue",
  "Gray",
]

const urlParams =  (() => {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
})()
const { searchType } = urlParams

class App extends Component {

  startsWithFilter = inputValue => colors.filter(c => c.toLocaleLowerCase().startsWith(inputValue))
  includesFilter = inputValue => colors.filter(c => c.toLocaleLowerCase().includes(inputValue))
  levenshteinFilter = inputValue => {
    let options = colors.map(c => ({ color: c, dist: levenshtein.get(c.toLocaleLowerCase(), inputValue, { useCollator: true})/Math.max(inputValue.length, c.length) }))
    options = _.sortBy(options, ['dist']).slice(50)
    options = options.map(({ color }) => color)
    return options
  }
  levenshteinFilter = inputValue => {
    let options = colors.map(c => ({ color: c, dist: levenshtein.get(c.toLocaleLowerCase(), inputValue, { useCollator: true})/Math.max(inputValue.length, c.length) }))
    options = options = _.sortBy(options, ['dist'])
    options = options.filter(o => o.dist <= 0.5)
    console.log(options)
    options = options.slice(0, 50)
    options = options.map(({ color }) => color)
    return options
  }
  similarityFilter = inputValue => {
    let options = colors.map(c => ({ color: c, dist: 1 - stringSimilarity.compareTwoStrings(c.toLocaleLowerCase(), inputValue) }))
    options = options = _.sortBy(options, ['dist'])
    console.log(options)
    options = options.filter(o => o.dist <= 0.5)
    options = options.slice(0, 50)
    options = options.map(({ color }) => color)
    return options
  }
  loadOptions = (inputValue, callback) => {
    inputValue = (inputValue || '').toLocaleLowerCase()
    let colorsToShow
    switch(searchType){
    case 'includes':
      console.log('includes')
      colorsToShow = this.includesFilter(inputValue)
      break;
    case 'levenshtein':
      console.log('levenshtein')
      colorsToShow = this.levenshteinFilter(inputValue)
      break;
    case 'similarity':
      console.log('similarity')
      colorsToShow = this.similarityFilter(inputValue)
      break;
    case 'startsWith':
    default:
        console.log('startsWith')
        colorsToShow = this.startsWithFilter(inputValue)
    }
    const options = colorsToShow.map(c => ({ value: c, label: c }))
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
