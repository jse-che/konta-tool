/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import './DataTable.css'

const TableWrapper = styled('div')({
  width: '100%', 
  maxWidth: '1200px', 
  margin: '0 auto', 
  overflowX: 'hidden',
  overflowY: 'auto',
});

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 1000,
  borderCollapse: 'collapse',
  width: '100%',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(1.5),
  textAlign: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1, 
}));

const DataTable = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fecha');
  const [sortedData, setSortedData] = useState(data);

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
    ivao: 5,
    total: 6,
    nombreFactura: 7,
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
                  active={orderBy === 'ivao'}
                  direction={orderBy === 'ivao' ? order : 'asc'}
                  onClick={() => handleRequestSort('ivao')}
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
                  active={orderBy === 'nombreFactura'}
                  direction={orderBy === 'nombreFactura' ? order : 'asc'}
                  onClick={() => handleRequestSort('nombreFactura')}
                >
                  Nombre Factura
                </TableSortLabel>
              </HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <StyledTableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <StyledTableCell key={cellIndex}>{cell}</StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </TableContainer>
  );
};

export default DataTable;