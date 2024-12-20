import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  Box,
  TablePagination,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import { Asiento } from "@/api/asientos/asientos-types";
import Swal from "sweetalert2";
import { useDeleteAsiento } from "@/api/asientos/asientos-request";

type OrderStatus = "Pendiente" | "Activo" | "Cancelado" | "Rechazado";

const statusColors: Record<
  OrderStatus,
  "default" | "error" | "warning" | "success"
> = {
  Pendiente: "warning",
  Activo: "success",
  Cancelado: "error",
  Rechazado: "default",
};

type AsientoTableProps = {
  asientos: Asiento[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onOpenModal: (asiento: Asiento) => void;
};

export default function AsientoTable({
  asientos,
  isLoading,
  isError,
  onOpenModal,
}: AsientoTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { mutate: deleteAsiento } = useDeleteAsiento();

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAsientos =
    asientos?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  const onDelete = (asiento: Asiento) => {
    if (!asiento.id) {
      Swal.fire("Error", "El ID del asiento es inválido.", "error");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#635bff",
      cancelButtonColor: "rgb(223, 51, 51)",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAsiento(asiento.id!, {
          onSuccess: () => {
            Swal.fire(
              "¡Borrado!",
              "El registro ha sido eliminado correctamente.",
              "success"
            );
          },
          onError: (error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "No se pudo eliminar el asiento. Intenta nuevamente.",
              "error"
            );
          },
        });
      }
    });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error al cargar los asientos</Alert>;
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asiento</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total Debe</TableCell>
              <TableCell>Total Haber</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAsientos.map((asiento) => (
              <TableRow key={asiento.id}>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body2" color="textSecondary">
                      {asiento.fecha_emision}
                    </Typography>
                    <Typography variant="subtitle2">
                      #{asiento.nro_asiento}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID-{asiento.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{asiento.comentario}</TableCell>
                {/* <TableCell>{asiento.estado}</TableCell> */}
                <TableCell>
                  <Chip
                    label={asiento.estado}
                    color={statusColors[asiento.estado as OrderStatus]}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{asiento.total_debe}</TableCell>
                <TableCell>{asiento.total_haber}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar" arrow>
                    <VisibilityOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: "action.active",
                        cursor: "pointer",
                        marginRight: 1,
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                      onClick={() => onOpenModal(asiento)}
                    />
                  </Tooltip>
                  <Tooltip title="Eliminar" arrow>
                    <DeleteOutlineOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: "action.active",
                        cursor: "pointer",
                        "&:hover": {
                          color: "error.main",
                        },
                      }}
                      onClick={() => onDelete(asiento)}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={asientos?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}
