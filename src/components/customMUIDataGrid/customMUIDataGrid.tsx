import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
interface IProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading: boolean;
}

const CustomMUIDataGrid: React.FC<IProps> = ({ rows, columns, loading }) => {
  const PAGE_SIZE = 25;

  return (
    <Box
      sx={{
        height: 1,
        bgcolor: 'background.paper',
        position: 'relative',
        p: 0.5,
        borderRadius: 2,
        width: 1,
      }}
    >
      <DataGrid
        pageSize={PAGE_SIZE}
        rowsPerPageOptions={[]}
        pagination
        disableSelectionOnClick
        loading={loading}
        components={{
          LoadingOverlay: LinearProgress,
        }}
        hideFooterSelectedRowCount
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};

export default CustomMUIDataGrid;
