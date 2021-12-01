import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { findIndex, get, orderBy } from 'lodash';
import CustomizedFilters from './CustomizedFilters';
import EnhancedTableHead from './EnhancedTableHead';

function getValueForCell(data, column) {
  let value = get(data, column.mapping);
  if (column.accessor) {
    value = column.accessor(value);
  }
  if (column.Cell && typeof column.Cell === 'function') {
    value = column.Cell(data);
  }
  return value;
}

function Row(props) {
  const {
    row, SubComponent, columns, index, expanderOff, nonCollapsible, fontSize, fontWeight,
  } = props;

  const useStyles = makeStyles({
    tableRow: {
      'height': '0px',
      '&:hover': {
        background: '#ededed !important',
      },
    },
    tableCell: {
      fontFamily: 'BlinkMacSystemFont,-apple-system,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell",'
          + '"Fira Sans","Droid Sans","Helvetica Neue","Helvetica","Arial",sans-serif !important',
      fontSize: fontSize || '0.75rem',
      fontWeight: fontWeight || 400,
    },
  });

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let expand = !(typeof expanderOff === 'function' ? expanderOff(row) : expanderOff);
  if (nonCollapsible) expand = false;

  return (
    <>
      <TableRow className={classes.tableRow} style={index % 2 ? { background: '#f7f7f7' } : { background: 'white' }} rowheight={10}>
        {!nonCollapsible && (
          <TableCell style={{ width: '1px', padding: '0.5px' }}>
            {expand && (
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        {columns.map((column) => (
          <React.Fragment key={column.mapping}>
            <TableCell className={classes.tableCell}>{getValueForCell(row, column)}</TableCell>
          </React.Fragment>
        ))}
      </TableRow>

      {expand && (
        <TableRow>
          <TableCell className={classes.tableCell} style={{ padding: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1} style={{ margin: 0 }}>
                {SubComponent(row)}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  SubComponent: PropTypes.func,
  index: PropTypes.number.isRequired,
  expanderOff: PropTypes.func,
  nonCollapsible: PropTypes.bool,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
};

export default function CustomTable(props) {
  const {
    data,
    uniqueKey,
    noDataText,
    SubComponent,
    columns,
    expanderOff,
    nonCollapsible,
    showPagination,
    enableFilters,
    enableSorting,
    headersOff,
    maxTableHeight,
    paginationRowOptions,
    defaultPaginationRows,
    fontSize,
    fontWeight,
    extraHeaders,
    defaultSorted,
    resetPageParamter,
  } = props;

  const createDynamicStyles = makeStyles({
    container: {
      maxHeight: !maxTableHeight ? 'fit-content' : maxTableHeight,
    },
    header: {
      boxShadow: 'inset 20px -20px 60px #ebebeb, inset -20px 20px 60px #ffffff',
    },
    footer: {
      boxShadow: 'inset 20px -20px 60px #dddddd, inset -20px 20px 60px #ffffff',
      display: 'flex',
    },
    font: {
      fontFamily: 'BlinkMacSystemFont,-apple-system,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell",'
          + '"Fira Sans","Droid Sans","Helvetica Neue","Helvetica","Arial",sans-serif !important',
      fontSize: '0.85rem',
    },
  });
  const classes = createDynamicStyles();

  // Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultPaginationRows || data.length);
  const paginationRows = paginationRowOptions || [10, 25, 50, 100];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(0);
  }, [resetPageParamter]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Sorting.
  const [order, setOrder] = React.useState(defaultSorted ? defaultSorted.order : '');
  const [orderByColumn, setOrderBy] = React.useState(defaultSorted ? defaultSorted.id : '');

  const handleRequestSort = (event, property) => {
    const isAsc = orderByColumn === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filters.
  const initialFilterState = {};
  columns.map((column) => {
    if (column.filterType) initialFilterState[column.mapping] = '';
  });
  const [filterValue, setFilterValue] = React.useState(initialFilterState);

  // This runs out all existing filters and returns the filtered array.
  const runExistingFilters = (keyToIgnore) => {
    const filterObj = {
      id: '',
      value: '',
    };
    let filteredRows = data;
    Object.keys(filterValue).map((filterKey) => {
      if (filterKey !== keyToIgnore && filterValue[filterKey] !== '') {
        filterObj.value = filterValue[filterKey];
        filterObj.id = filterKey;
        const index = findIndex(columns, ['mapping', filterKey]);
        filteredRows = columns[index].filterMethod(filterObj, filteredRows);
      }
      return null;
    });
    return filteredRows;
  };

  const filteredRows = runExistingFilters('');

  return (
    <Paper>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          {!headersOff && (
            <>
              <TableHead>
                {extraHeaders && extraHeaders()}
                <TableRow>
                  {!nonCollapsible && <TableCell className={classes.header} />}
                  <EnhancedTableHead order={order} orderBy={orderByColumn} columns={columns} onRequestSort={handleRequestSort} enableSorting={enableSorting} />
                </TableRow>
                {enableFilters && ( // render filters
                  <TableRow>
                    {!nonCollapsible && <TableCell style={{ top: 36 }} />}
                    <CustomizedFilters
                      columns={columns}
                      filterValue={filterValue}
                      setFilterValue={setFilterValue}
                      setPage={setPage}
                    />
                  </TableRow>
                )}
              </TableHead>
            </>
          )}
          <TableBody>
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell className={classes.font} style={{ padding: '2rem', textAlign: 'center' }} colSpan={8}>
                  <span
                    style={{
                      padding: '1.5rem', fontWeight: '400', textAlign: 'center', color: '#8f8f8f',
                    }}
                  >
                    {noDataText}
                  </span>
                </TableCell>
              </TableRow>
            )}
            {filteredRows.length !== 0 && orderBy(filteredRows, [orderByColumn], [order])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => ( // render each row.
                <React.Fragment key={uniqueKey(row, index)}>
                  <Row
                    row={row}
                    SubComponent={SubComponent}
                    columns={columns}
                    index={index}
                    expanderOff={expanderOff}
                    nonCollapsible={nonCollapsible}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                  />
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && (
        <TablePagination
          className={classes.footer}
          rowsPerPageOptions={[...paginationRows]}
          colSpan={data.length}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  SubComponent: PropTypes.func,
  showPagination: PropTypes.bool.isRequired,
  enableFilters: PropTypes.bool.isRequired,
  enableSorting: PropTypes.bool.isRequired,
  defaultSorted: PropTypes.object,
  uniqueKey: PropTypes.func.isRequired,
  headersOff: PropTypes.bool,
  maxTableHeight: PropTypes.number,
  paginationRowOptions: PropTypes.array,
  defaultPaginationRows: PropTypes.number,
  noDataText: PropTypes.string.isRequired,
  expanderOff: PropTypes.func,
  nonCollapsible: PropTypes.bool,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  extraHeaders: PropTypes.func,
  resetPageParamter: PropTypes.any,
};
