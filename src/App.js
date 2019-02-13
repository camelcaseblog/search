import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import JssProvider from 'react-jss/lib/JssProvider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { create as jssCreate } from 'jss';
import jssRtl from 'jss-rtl';
import stringSimilarity from 'string-similarity';
import levenshtein from 'fast-levenshtein';
import _ from 'lodash';

const values = [
  'George Washington',
  'John Adams',
  'Thomas Jefferson',
  'James Madison',
  'James Monroe',
  'John Quincy Adams',
  'Andrew Jackson',
  'Martin Van Buren',
  'William Henry Harrison',
  'John Tyler',
  'James K. Polk',
  'Zachary Taylor',
  'Millard Fillmore',
  'Franklin Pierce',
  'James Buchanan',
  'Abraham Lincoln',
  'Andrew Johnson',
  'Ulysses S. Grant',
  'Rutherford B. Hayes',
  'James A. Garfield',
  'Chester A. Arthur',
  'Grover Cleveland',
  'Benjamin Harrison',
  'Grover Cleveland',
  'William McKinley',
  'Theodore Roosevelt',
  'William Howard Taft',
  'Woodrow Wilson',
  'Warren G. Harding',
  'Calvin Coolidge',
  'Herbert Hoover',
  'Franklin D. Roosevelt',
  'Harry S. Truman',
  'Dwight D. Eisenhower',
  'John F. Kennedy',
  'Lyndon B. Johnson',
  'Richard Nixon',
  'Gerald Ford',
  'Jimmy Carter',
  'Ronald Reagan',
  'George H. W. Bush',
  'Bill Clinton',
  'George W. Bush',
  'Barack Obama',
  'Donald Trump'
];

const styles = theme => ({
  root: {
    maxWidth: 300,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    maxWidth: 300
  }
});

const urlParams = (() => {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
})();
const { searchType, type } = urlParams;

const rtlMaterialUiTheme = createMuiTheme({
  direction: 'rtl',
  typography: { useNextVariants: true }
});
const jss = jssCreate({ plugins: [...jssPreset().plugins, jssRtl()] });
const generateClassName = createGenerateClassName();

class App extends Component {
  state = { inputValue: '', values };
  startsWithFilter = inputValue =>
    values.filter(v => v.toLocaleLowerCase().startsWith(inputValue));
  includesFilter = inputValue =>
    values.filter(v => v.toLocaleLowerCase().includes(inputValue));
  levenshteinFilter = inputValue => {
    let options = values.map(v => ({
      value: v,
      dist:
        levenshtein.get(v.toLocaleLowerCase(), inputValue, {
          useCollator: true
        }) / Math.max(inputValue.length, v.length)
    }));
    return options;
  };
  levenshteinFilter = inputValue => {
    let options = values.map(v => ({
      value: v,
      dist:
        levenshtein.get(v.toLocaleLowerCase(), inputValue, {
          useCollator: true
        }) / Math.max(inputValue.length, v.length)
    }));
    options = options = _.sortBy(options, ['dist']);
    return options;
  };
  similarityFilter = inputValue => {
    let options = values.map(v => ({
      value: v,
      dist:
        1 -
        stringSimilarity.compareTwoStrings(v.toLocaleLowerCase(), inputValue)
    }));
    options = options = _.sortBy(options, ['dist']);
    return options;
  };
  loadOptions = inputValue => {
    inputValue = (inputValue || '').toLocaleLowerCase();
    let values;
    switch (searchType || type) {
      case 'includes':
      case 'i':
        values = this.includesFilter(inputValue);
        break;
      case 'levenshtein':
      case 'l':
        values = this.levenshteinFilter(inputValue);
        break;
      case 'startsWith':
        values = this.startsWithFilter(inputValue);
        break;
      case 'similarity':
      case 's':
      default:
        values = this.similarityFilter(inputValue);
        break;
    }
    this.setState({ values });
  };
  handleChange = ({ target: { value: inputValue } }) => {
    this.setState({ inputValue });
    this.loadOptions(inputValue);
  };
  render() {
    const { classes } = this.props;
    return (
      <div dir="rtl">
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={rtlMaterialUiTheme}>
            <TextField
              onChange={this.handleChange}
              id="outlined-search"
              label="הקלד לחיפוש נשיא"
              inputProps={{ dir: 'rtl' }}
              type="search"
              margin="normal"
              variant="outlined"
            />
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">שם</TableCell>
                    <TableCell align="center">ציון</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.values.map(row => (
                    <TableRow key={Math.random()}>
                      <TableCell component="th" scope="row">
                        {typeof row === 'string' ? row : row.value}
                      </TableCell>
                      <TableCell>
                        {typeof row === 'string' ? '' : row.dist.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </MuiThemeProvider>
        </JssProvider>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
