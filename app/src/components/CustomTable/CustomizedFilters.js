import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import TableCell from '@material-ui/core/TableCell';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'width': '100%',
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    'borderRadius': 4,
    'position': 'relative',
    'backgroundColor': theme.palette.background.paper,
    'border': '1px solid #00d1b2',
    'fontSize': 10,
    'padding': '0px 26px 0px 12px',
    'height': '28px',
    'transition': theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    'fontFamily': [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#00d1b2',
      boxShadow: '0 0 0 0.2rem rgba(0, 209, 178,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles({
  root: {
    width: '80%',
    display: 'inline-flex',
  },
});

export default function CustomizedFilters(props) {
  const {
    columns, filterValue, setFilterValue, setPage,
  } = props;
  const classes = useStyles();

  const handleChange = (event, filterParam) => {
    setFilterValue({ ...filterValue, [filterParam]: event.target.value });
    setPage(0);
  };

  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.mapping} style={{ top: 36 }}>
          <Box className={classes.root}>
            {column.filterType === 'dropdown' && (
              <>
                <NativeSelect
                  id="demo-customized-select-native"
                  value={filterValue[column.mapping]}
                  onChange={(e) => handleChange(e, column.mapping)}
                  input={<BootstrapInput />}
                  size="small"
                >
                  {column.filterOptions.map((filterOption) => (
                    <option
                      key={filterOption}
                      value={typeof filterOption === 'object' ? Object.keys(filterOption)[0] : filterOption}
                    >
                      {typeof filterOption === 'object' ? filterOption.any : filterOption}
                    </option>
                  ))}
                </NativeSelect>
              </>
            )}
            {column.filterType === 'autocomplete' && (
              <>
                <BootstrapInput
                  id="bootstrap-input"
                  value={filterValue[column.mapping]}
                  size="small"
                  onChange={(e) => handleChange(e, column.mapping)}
                />
              </>
            )}
          </Box>
        </TableCell>
      ))}
    </>
  );
}

CustomizedFilters.propTypes = {
  columns: PropTypes.array.isRequired,
  filterValue: PropTypes.object.isRequired,
  setFilterValue: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};
