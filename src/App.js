import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import Select from 'react-select';
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
import { compareTwoStrings as diceCompare } from 'string-similarity';
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

const searchTypesOptions = [
  { value: 'levenshtein', label: 'Levenshtein' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'includes', label: 'Includes' },
  { value: 'trigram', label: 'Trigram' },
  { value: 'dice', label: 'Dice coefficient' }
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

const rtlMaterialUiTheme = createMuiTheme({
  direction: 'rtl',
  typography: { useNextVariants: true }
});
const jss = jssCreate({ plugins: [...jssPreset().plugins, jssRtl()] });
const generateClassName = createGenerateClassName();

class App extends Component {
  state = {
    inputValue: '',
    values,
    selectedSearchTypeOption: '',
    searchType: ''
  };
  startsWithFilter = inputValue => values.filter(v => v.startsWith(inputValue));
  includesFilter = inputValue =>
    values.filter(v => v.toLocaleLowerCase().includes(inputValue));
  similarityFilter = compareTwoStrings => inputValue => {
    let options = values.map(v => ({
      value: v,
      dist: compareTwoStrings(v.toLocaleLowerCase(), inputValue)
    }));
    options = options = _.sortBy(options, ['dist']);
    return options;
  };
  levenshteinFilter = this.similarityFilter(
    (a, b) => levenshtein.get(a, b, { useCollator: true }) / Math.max(a, b)
  );
  trigramFilter = this.similarityFilter(
    (a, b) => levenshtein.get(a, b, { useCollator: true }) / Math.max(a, b)
  );
  diceFilter = this.similarityFilter((a, b) => 1 - diceCompare(a, b));
  loadOptions = inputValue => {
    inputValue = (inputValue || '').toLocaleLowerCase();
    let values;
    switch (this.state.searchType) {
      case 'includes':
        values = this.includesFilter(inputValue);
        break;
      case 'levenshtein':
        values = this.levenshteinFilter(inputValue);
        break;
      case 'trigram':
        values = this.trigramFilter(inputValue);
        break;
      case 'dice':
        values = this.diceFilter(inputValue);
        break;
      case 'startsWith':
      default:
        values = this.startsWithFilter(inputValue);
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
            <div style={{ width: '300px' }}>
              <Select
                handleChange={o =>
                  this.setState({
                    selectedSearchTypeOption: o,
                    searchType: o.value
                  })
                }
                value={this.state.selectedSearchTypeOption}
                options={searchTypesOptions}
              />
            </div>
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
