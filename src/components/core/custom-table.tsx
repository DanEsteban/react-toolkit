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
} from "@mui/material";
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useState } from "react";

export const CustomColumn = ({ title }: { title: string }) => {
  return <TableCell>{title}</TableCell>;
};

interface CustomColumn {
    name: string;
    field: string;
}

export interface CustomRow extends Request {
  [x: string]: any;
  id: number;
}

export const CustomTable = ({
  columns,
  rows,
  title,
  isAddButtonInHeader,
}: {
  columns: CustomColumn[];
  rows: any[];
  title: string;
  isAddButtonInHeader?: boolean;
}) => {
    const [localRows, setLocalRows] = useState<Record<string, any>[]>([]);

  const addEmptyRow = () => {
    setLocalRows((prevRows) => [
      ...prevRows,
      {}
    ]);
  };

  return (
    <div>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">{title}</Typography>
            </Box>
            {isAddButtonInHeader && <div>
              <Button startIcon={<PlusIcon />} variant="contained" onClick={addEmptyRow}>
                Add Row
              </Button>
            </div>}
          </Stack>
      <Table>
        <TableHead>
          <TableRow>
            {columns?.map((column) => (
              <CustomColumn key={column.field} title={column.name} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const cols = Object.keys(row);
            return (
              <TableRow key={row.id}>
                {cols.map((col) => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {localRows.map((localRow, index) => {
        return (
          <TableRow key={`empty-${index}`}>
            {columns.map((col) => {
              return (
                <TableCell key={`tc-${col.field}`}>
                  <TextField
                    value={localRow[col.name] ?? ''}
                    onChange={(e) => {
                      setLocalRows((prevRows) => {
                        const newRows = [...prevRows];
                        newRows[index] = {
                          ...newRows[index],
                          [col.name]: e.target.value,
                        };
                        return newRows;
                      });
                    }}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
      {!isAddButtonInHeader && <div>
              <Button startIcon={<PlusIcon />} variant="contained" onClick={addEmptyRow}>
                Add Row
              </Button>
            </div>}
        </Stack>
    </div>
  );
};
