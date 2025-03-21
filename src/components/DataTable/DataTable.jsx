/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import './DataTable.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const TableWrapper = styled('div')({
  width: '100%',
  margin: '0 auto',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column',
});

const StyledTable = styled(Table)({
  width: '100%',
  borderCollapse: 'collapse',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '12.5%',
}));

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: 'var(--clr-white)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
});

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: 'var(--clr-blueheader)',
  color: 'var(--clr-white)',
  padding: theme.spacing(1.2),
  textAlign: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

const PaginationContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '8px',
  padding: '8px',
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'var(--clr-white)',
  zIndex: 1,
});

const ArrowButton = styled('button')({
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  margin: '0 6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  padding: '6px',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '18px', // Se redujo el tamaño de los íconos
  },
  '&:hover': {
    backgroundColor: '#007BFF',
    color: 'white',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const PageNumber = styled('span')({
  fontSize: '14px', // Se redujo el tamaño del número
  fontWeight: 'bold',
  margin: '0 6px',
});

const DataTable = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(9);

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === 'asc';
    const newOrder = isAscending ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    sortData(property, newOrder);
  };

  const sortData = (property, order) => {
    const sorted = [...data].sort((a, b) => {
      const valueA = a[headerMap[property]];
      const valueB = b[headerMap[property]];

      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  };

  const headerMap = {
    fecha: 0,
    noFactura: 1,
    empresa: 2,
    nit: 3,
    subtotal: 4,
    iva: 5,
    total: 6,
    medioPago: 7,
  };

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(sortedData.length / rowsPerPage)) {
      setPage(newPage);
    }
  };

  const displayedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <TableWrapper className="table-wrapper">
        <StyledTable>
          <TableHead>
            <TableRow>
              {Object.keys(headerMap).map((key) => (
                <HeaderCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                    onClick={() => handleRequestSort(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableSortLabel>
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <StyledTableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <StyledTableCell key={cellIndex}>
                    {cellIndex >= 4 && cellIndex <= 6
                      ? new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                        }).format(cell)
                      : cell}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
        <PaginationContainer>
          <ArrowButton onClick={() => handleChangePage(page - 1)} disabled={page === 0}>
            <ArrowBackIosIcon />
          </ArrowButton>
          <PageNumber>{page + 1} / {totalPages}</PageNumber>
          <ArrowButton onClick={() => handleChangePage(page + 1)} disabled={page === totalPages - 1}>
            <ArrowForwardIosIcon />
          </ArrowButton>
        </PaginationContainer>
      </TableWrapper>
    </TableContainer>
  );
};

export default DataTable;
