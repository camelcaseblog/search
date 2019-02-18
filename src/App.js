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
import {
  startsWithFilter,
  diceFilter,
  trigramFilter,
  levenshteinFilter,
  includesFilter
} from './filter_functions';
import { MenuItem } from '@material-ui/core';

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
  },
  menu: {
    width: 150
  },
  select: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 150
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
    values: [],
    searchType: ''
  };
  loadOptions = inputValue => {
    inputValue = (inputValue || '').toLocaleLowerCase();
    let values;
    switch (this.state.searchType) {
      case 'includes':
        values = includesFilter(inputValue);
        break;
      case 'levenshtein':
        values = levenshteinFilter(inputValue);
        break;
      case 'trigram':
        values = trigramFilter(inputValue);
        break;
      case 'dice':
        values = diceFilter(inputValue);
        break;
      case 'startsWith':
      default:
        values = startsWithFilter(inputValue);
        break;
    }
    this.setState({ values });
  };
  handleChange = ({ target: { value: inputValue } }) => {
    this.setState({ inputValue });
    this.loadOptions(inputValue);
  };
  searchTypeChanged = ({ target: { value } }) => {
    this.setState({ searchType: value }, () =>
      this.loadOptions(this.state.inputValue)
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div dir="rtl">
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={rtlMaterialUiTheme}>
            <Paper className={classes.root}>
              <TextField
                id="standard-select-currency"
                select
                label="סוג חיפוש"
                className={classes.select}
                value={this.state.searchType}
                onChange={this.searchTypeChanged}
                SelectProps={{ MenuProps: { className: classes.menu } }}
                margin="normal"
              >
                {searchTypesOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                onChange={this.handleChange}
                id="outlined-search"
                label="הקלד לחיפוש נשיא"
                inputProps={{ dir: 'rtl' }}
                type="search"
                margin="normal"
                variant="outlined"
              />
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
