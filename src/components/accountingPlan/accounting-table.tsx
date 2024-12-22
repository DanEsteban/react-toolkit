import React, { useState, useCallback, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Alert,
    CircularProgress,
    Paper,
    InputAdornment,
    TextField,
    TableContainer
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AccountRow from './accounting-row';
import AccountForm from './accounting-form';
import useAccountingPlan from '@/hooks/use-accountingPlan';
import PDFReportGenerator from './pdf-report';
import { useDispatch, useSelector } from 'react-redux';
import { setFeedback } from '@/state/slices/feedBackSlice';
import { RootState } from '@/state/store';
interface AccountingPlanTableProps {
    refreshTrigger: number;
}

const AccountingPlanTable: React.FC<AccountingPlanTableProps> = ({ refreshTrigger }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresa);

    const {
        allAccounts,
        isLoading,
        isError,
        addAccount,
        updateAccount,
        deleteAccount,
        error,
        success,
        clearMessages } = useAccountingPlan(page + 1, rowsPerPage, selectedEmpresa.id, refreshTrigger);

    const memoizedAccounts = useMemo(() => allAccounts || [], [allAccounts]);

    const filteredAccounts = useMemo(() => {
        if (!searchTerm) return allAccounts || [];
        
        // Usar índices o búsqueda binaria para conjuntos de datos grandes
        return (allAccounts || []).filter(item => 
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allAccounts, searchTerm]);

    const paginatedAccounts = useMemo(() =>
        filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredAccounts, page, rowsPerPage]
    );


    const dispatch = useDispatch();
    React.useEffect(() => {
        if (error) {
            dispatch(
                setFeedback({
                    message: error,
                    severity: "error",
                    isError: true,
                })
            );
            clearMessages();
        }

        if (success) {
            dispatch(
                setFeedback({
                    message: success,
                    severity: "success",
                    isError: false,
                })
            );
            clearMessages();
        }
    }, [error, success, dispatch, clearMessages]);

    const handleChangePage = useCallback((_: unknown, newPage: number) => {
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
        return <Alert severity="error">Error al cargar las cuentas</Alert>;
    }

    return (
        <Paper sx={{ p: 2 }}>
            <PDFReportGenerator accounts={memoizedAccounts} />
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
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <AccountForm onSubmit={addAccount} />
                        {paginatedAccounts.map((account) => (
                            <AccountRow
                                key={account.id}
                                account={account}
                                onUpdate={updateAccount}
                                onDelete={deleteAccount}
                                isSelected={selectedRowId === account.id}
                                onRowClick={handleRowClick}
                            />
                        ))}
                    </TableBody>

                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredAccounts.length} // Total de resultados filtrados
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Paper>
    );
};

export default AccountingPlanTable;
