import React, { useCallback, useMemo, useState } from 'react';
import { 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    TablePagination,
    Snackbar
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CostCenterRow from './costcenter-row';
import CostCenterForm from './costcenter-form';
import useCentroCosto from '@/hooks/use-costCenter';

const CostCenterTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const {
        costCenters,
        totalcostCenters,
        allcostCenters,
        isLoading,
        isError,
        addcostCenter,
        updatecostCenter,
        deletecostCenter,
        error,
        success,
        clearMessages
    } = useCentroCosto(page + 1, rowsPerPage);

    const filteredTransactions = costCenters.filter(item =>
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const memoizedAccounts = useMemo(() => allcostCenters || [], [allcostCenters]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { 
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleRowClick = useCallback((id: number) => {
        setSelectedRowId(prevId => (prevId === id ? null : id));
    }, []);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError) {
        return <Alert severity="error">Error al cargar las transacciones</Alert>;
    }


    return (
        <Paper sx={{ p: 2 }}>
            <div style={{ marginBottom: 16 }}>
                <TextField
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="center">Activo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <CostCenterForm onSubmit={addcostCenter} existingCostCenters={costCenters}/>
                        {filteredTransactions.map((costCenter) => (
                            <CostCenterRow
                                key={costCenter.id}
                                costCenter={costCenter}
                                onUpdate={updatecostCenter}
                                onDelete={deletecostCenter}
                                isSelected={selectedRowId === costCenter.id}
                                onRowClick={handleRowClick}
                            />
                        ))}
                        
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalcostCenters}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Snackbar open={!!error} autoHideDuration={6000} onClose={clearMessages}>
                    <Alert onClose={clearMessages} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={!!success} autoHideDuration={6000} onClose={clearMessages}>
                    <Alert onClose={clearMessages} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            </TableContainer>
        </Paper>
    );
};

export default CostCenterTable;