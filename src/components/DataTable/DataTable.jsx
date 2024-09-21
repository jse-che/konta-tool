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

const StyledTable = styled(Table)(({ theme }) => ({
  Width: '100%',
  borderCollapse: 'collapse',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '12.5%',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: 'var(--clr-white)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: 'var(--clr-blueheader)',
  color: 'var(--clr-white)',
  padding: theme.spacing(1.5),
  textAlign: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));

const PaginationContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '10px',
  padding: '10px',
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'var(--clr-white)',
  zIndex: 1,
});

const PageButton = styled('button')(({ theme, active }) => ({
  width: '30px', 
  height: '30px', 
  borderRadius: '50%',
  margin: '0 3px',
  border: '1px solid #ccc',
  backgroundColor: active ? theme.palette.primary.main : 'var(--clr-white)',
  color: active ? 'var(--clr-white)' : '#000',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: active ? 'bold' : 'normal',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'var(--clr-white)',
  },
}));

const ArrowButton = styled('button')({
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  margin: '0 5px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',  
});

const DataTable = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fecha');
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

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <PageButton
          key={i}
          onClick={() => handleChangePage(i)}
          active={i === page}
        >
          {i + 1}
        </PageButton>
      );
    }
    return buttons;
  };

  return (
    <TableContainer component={Paper}>
      <TableWrapper className="table-wrapper">
        <StyledTable>
          <TableHead>
            <TableRow>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'fecha'}
                  direction={orderBy === 'fecha' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha')}
                >
                  Fecha
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'noFactura'}
                  direction={orderBy === 'noFactura' ? order : 'asc'}
                  onClick={() => handleRequestSort('noFactura')}
                >
                  No. Factura
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'empresa'}
                  direction={orderBy === 'empresa' ? order : 'asc'}
                  onClick={() => handleRequestSort('empresa')}
                >
                  Empresa
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'nit'}
                  direction={orderBy === 'nit' ? order : 'asc'}
                  onClick={() => handleRequestSort('nit')}
                >
                  Nit
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'subtotal'}
                  direction={orderBy === 'subtotal' ? order : 'asc'}
                  onClick={() => handleRequestSort('subtotal')}
                >
                  SubTotal
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'iva'}
                  direction={orderBy === 'iva' ? order : 'asc'}
                  onClick={() => handleRequestSort('iva')}
                >
                  IVA
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                >
                  Total
                </TableSortLabel>
              </HeaderCell>
              <HeaderCell>
                <TableSortLabel
                  active={orderBy === 'medioPago'}
                  direction={orderBy === 'medioPago' ? order : 'asc'}
                  onClick={() => handleRequestSort('medioPago')}
                >
                  Medio Pago
                </TableSortLabel>
              </HeaderCell>
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
          <ArrowButton onClick={() => handleChangePage(page - 1)}>
            <ArrowBackIosIcon />
          </ArrowButton>
          {renderPageButtons()}
          <ArrowButton onClick={() => handleChangePage(page + 1)}>
            <ArrowForwardIosIcon />
          </ArrowButton>
        </PaginationContainer>
      </TableWrapper>
    </TableContainer>
  );
};

export default DataTable;