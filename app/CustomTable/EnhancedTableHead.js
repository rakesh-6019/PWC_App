import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  header: {
    boxShadow: 'inset -20px -20px 60px #ebebeb, inset -20px -20px 60px #ffffff',
    fontFamily: 'BlinkMacSystemFont,-apple-system,"Segoe UI","Roboto","Oxygen","Ubuntu",' +
        '"Cantarell","Fira Sans","Droid Sans","Helvetica Neue","Helvetica","Arial",sans-serif !important',
    fontSize: '12px',
    fontWeight: 700,
  },
}));

export default function EnhancedTableHead(props) {
  const {
    order, orderBy, onRequestSort, columns, enableSorting,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const classes = useStyles();

  const getColumnHeader = (header) => typeof header === 'function' ? header() : header;

  return (
    <>
      {columns.map((column) => (
        <TableCell
          className={classes.header}
          key={column.mapping}
          sortDirection={orderBy === column.mapping ? order : false}
          width={column.minWidth}
        >
          {enableSorting ? (
            <TableSortLabel
              active={orderBy === column.mapping}
              direction={orderBy === column.mapping ? order : 'asc'}
              onClick={createSortHandler(column.mapping)}
            >
              {getColumnHeader(column.Header)}
              {orderBy === column.mapping ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          ) : getColumnHeader(column.Header)}
        </TableCell>
      ))}
    </>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc', '']).isRequired,
  orderBy: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  enableSorting: PropTypes.bool.isRequired,
};
