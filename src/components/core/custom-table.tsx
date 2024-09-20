import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { FloppyDisk as SaveIcon } from "@phosphor-icons/react";
import { UseQueryResult } from "react-query";
import dayjs from "dayjs";

export interface CustomColumn<T> {
  name: string;
  field: keyof T;
  type: "number" | "string" | "date";
}

export interface CustomRow {
  [key: string]: any;
}

export interface DataRow<T> {
    [key: string ]: T[keyof T];
  }

interface CustomTableProps<T extends CustomRow> {
  columns: CustomColumn<T>[];
  rows: DataRow<T>[];
  title: string;
  fetchData: () => UseQueryResult<T[], unknown>;
  refetch: () => Promise<void>;
  onSaveNewRows: (newRows: Partial<T>[]) => Promise<void>;
  editableFields: (keyof T)[];
  visibleFields: (keyof T)[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function CustomTable<T extends CustomRow>({
  error,
  columns,
  rows,
  title,
  refetch,
  isLoading,
  isError,
  onSaveNewRows,
  editableFields,
  visibleFields,
}: CustomTableProps<T>): React.ReactElement {
  const [newRows, setNewRows] = useState<Partial<T>[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el error

  const addEmptyRow = () => {
    const newRow = editableFields.reduce(
      (acc, field) => ({ ...acc, [field]: "" }),
      {}
    ) as Partial<T>;
    setNewRows((prevRows) => [...prevRows, newRow]);
  };

  const handleCellChange = (
    rowIndex: number,
    field: keyof T,
    value: string
  ) => {
    setNewRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
      return updatedRows;
    });
  };

  const handleSaveNewRows = async () => {
    setIsSaving(true);
    try {
      await onSaveNewRows(newRows);
      await refetch();
      setNewRows([]);
    } catch (err) {
      console.error("Error saving new rows:", err);
      setErrorMessage("An error occurred while saving new rows.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error: {(error as Error).message}</Alert>;
  }

  const visibleColumns = columns.filter((column) =>
    visibleFields.includes(column.field)
  );

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ alignItems: "center", marginBottom: 2 }}
      >
        <Typography variant="h4" sx={{ flex: "1 1 auto" }}>
          {title}
        </Typography>
        <Button
          startIcon={<PlusIcon />}
          variant="contained"
          onClick={addEmptyRow}
        >
          Add Row
        </Button>
        {newRows.length > 0 && (
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSaveNewRows}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save New Rows"}
          </Button>
        )}
      </Stack>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}{" "}
      {/* Mostrar error */}
      <Table>
        <TableHead>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableCell key={String(column.field)}>{column.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {visibleColumns.map((column) => (
                <TableCell key={`${rowIndex}-${String(column.field)}`}>
                  {column.type === 'date' ? dayjs(row[column.field as keyof T as keyof DataRow<T>]).format('DD-MM-YYYY') : row[column.field as keyof T as keyof DataRow<T>] }
                </TableCell>
              ))}
            </TableRow>
          ))}
          {newRows.map((row, rowIndex) => (
            <TableRow key={`new-row-${rowIndex}`}>
              {visibleColumns.map((column) => (
                <TableCell key={`new-${rowIndex}-${String(column.field)}`}>
                  {editableFields.includes(column.field as keyof T) && (
                    <TextField
                      value={row[column.field] || ""}
                      onChange={(e) =>
                        handleCellChange(rowIndex, column.field, e.target.value)
                      }
                      fullWidth
                      disabled={
                        !editableFields.includes(column.field as keyof T)
                      }
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
