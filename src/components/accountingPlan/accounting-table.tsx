import React, { useState, useCallback, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Snackbar,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import AccountRow from './accounting-row';
import AccountForm from './accounting-form';
import useAccountingPlan from '@/hooks/use-accountingPlan';
import PDFReportGenerator from './pdf-report';

const AccountingPlanTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const {
        accounts,
        totalAccounts,
        allAccounts,
        isLoading,
        isError,
        addAccount,
        updateAccount,
        deleteAccount,
        error,
        success,
        clearMessages
    } = useAccountingPlan(page + 1, rowsPerPage);

    const memoizedAccounts = useMemo(() => allAccounts || [], [allAccounts]);

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
        return <Alert severity="error">Error al cargar las cuentas</Alert>;
    }

    return (
        <Paper elevation={3}>
            <PDFReportGenerator accounts={memoizedAccounts} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <AccountForm onSubmit={addAccount} />
                    {accounts.map((account) => (
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
                count={totalAccounts}
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
        </Paper>
    );
};

export default AccountingPlanTable;
