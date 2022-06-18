import DataGrid from '@components/customMUIDataGrid';
import Input from '@components/input';
import PrintIcon from '@mui/icons-material/Print';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Box } from '@mui/system';
import {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import axios from 'axios';
import { toSvg } from 'html-to-image';
import type { NextPage } from 'next';
import { useBarcode } from 'next-barcode';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QRCodeSVG } from 'qrcode.react';

const Home: NextPage = () => {
  const componentRef = React.useRef<React.ReactInstance | null>(null);
  const [tab, setTab] = React.useState(0);
  const [dataUrl, setDataUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [historicalData, setHistoricalData] = React.useState<Product[]>([]);
  const [loadingHistorical, setLoadingHistorical] = React.useState(false);
  const [barcode, setBarcode] = React.useState({
    id: '',
    name: '',
    description: '',
  });

  const { inputRef } = useBarcode({
    value: barcode.id || '01234567890',
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Omit<Product, 'createdAt'>>();

  const onGenerate = async (data: Omit<Product, 'createdAt'>) => {
    try {
      setBarcode(data);
      setLoading(true);
      const res = await axios.post('/api/historical', data);
      if (res.status === 200) {
        setLoading(false);
        toast.success('Code barre généré avec succès');
      }
    } catch (error) {
      setLoading(false);
      toast.error("Un problème est survenu lors de l'enregistrement");
    }
  };

  const getHistoricalData = async () => {
    try {
      setLoadingHistorical(true);
      const res = await axios.get('/api/historical');
      if (res.status === 200) {
        setHistoricalData(res.data);
        setLoadingHistorical(false);
      }
    } catch (error) {
      setLoadingHistorical(false);
      toast.error(
        'Un problème est survenu lors de la récupération des données'
      );
    }
  };

  const showHistorical = (data: Omit<Product, 'createdAt'>) => {
    setBarcode(data);
    reset({ id: data.id, name: data.name, description: data.description });
    setTab(0);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    onPrint();
    reset();
    setBarcode({ id: '', name: '', description: '' });
  };

  const rows: GridRowsProp = historicalData?.map((el, i) => ({
    date: new Date(el.createdAt).toLocaleDateString(),
    id: el.id,
    name: el.name,
    description: el.description,
  }));

  const options = {
    flex: 1,
    filterable: false,
    minWidth: 150,
  };

  const columns: GridColDef[] = [
    { ...options, field: 'date', headerName: 'Date', flex: 0 },
    { ...options, field: 'id', headerName: 'ID', flex: 0 },
    { ...options, field: 'name', headerName: 'Nom du produit', flex: 0 },
    { ...options, field: 'description', headerName: 'Description' },
    {
      ...options,
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      flex: 0,
      renderCell: (params: GridRenderCellParams<Product>) => {
        const { id, name, description } = params.row;
        return (
          <IconButton
            onClick={() => {
              showHistorical({ id, name, description });
            }}
          >
            <VisibilityIcon fontSize='medium' color='primary' />
          </IconButton>
        );
      },
    },
  ];

  React.useEffect(() => {
    const node = document.getElementById('barcode') as HTMLElement;
    toSvg(node)
      .then(function (dataUrl) {
        setDataUrl(dataUrl);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }, [barcode]);

  React.useEffect(() => {
    if (tab === 1) {
      getHistoricalData();
    }
  }, [tab]);

  return (
    <>
      <Head>
        <title>Générateur de Code Barre</title>
        <style type='text/css' media='print'>
          {'\
  @page { size: A4 landscape; }\
'}
        </style>
      </Head>
      <Stack
        sx={{
          py: 4,
          background: (theme) =>
            `linear-gradient(to right,${theme.palette.primary.main},${theme.palette.secondary.main})`,
          minHeight: '100vh',
        }}
        alignItems='center'
        justifyContent='center'
      >
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Container>
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 1,
              my: 2,
              boxShadow: '0 0 20px 5px rgba(0,0,0,0.2)',
            }}
          >
            <Tabs value={tab} onChange={handleChange}>
              <Tab label='Générateur' />
              <Tab label='Historique' />
            </Tabs>
          </Box>

          <Grid
            container
            sx={{
              bgcolor: '#EBEDF5',
              borderRadius: 1,
              boxShadow: '0 0 20px 5px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              display: tab === 0 ? 'flex' : 'none',
              minHeight: 430,
            }}
          >
            <Grid item xs={12} md={8}>
              <Stack spacing={2} sx={{ px: 4, py: 6 }}>
                <Controller
                  name='id'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={barcode.id}
                  render={({ field }) => (
                    <Input
                      label='ID du produit'
                      type='number'
                      error={errors[field.name]?.type === 'required'}
                      helperText={errors[field.name] && 'Ce champ est requis'}
                      handleChange={(e) => field.onChange(e)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={barcode.name}
                  render={({ field }) => (
                    <Input
                      label='Nom du produit'
                      error={errors[field.name]?.type === 'required'}
                      helperText={errors[field.name] && 'Ce champ est requis'}
                      handleChange={(e) => field.onChange(e)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={barcode.description}
                  render={({ field }) => (
                    <Input
                      label='Description du produit'
                      multiline
                      rows={4}
                      error={errors[field.name]?.type === 'required'}
                      helperText={errors[field.name] && 'Ce champ est requis'}
                      handleChange={(e) => field.onChange(e)}
                      {...field}
                    />
                  )}
                />
                <Button
                  variant='contained'
                  sx={{ p: 2 }}
                  onClick={handleSubmit(onGenerate)}
                  startIcon={<RocketLaunchIcon />}
                >
                  {loading ? 'Chargement...' : 'Générer le code barre'}
                </Button>
                {dataUrl && barcode?.name && (
                  <Box className='print'>
                    <Stack ref={componentRef} sx={{ px: 3, py: 2 }} spacing={2}>
                      <Typography
                        textAlign='center'
                        fontWeight={600}
                        fontSize={24}
                        sx={{ textTransform: 'uppercase' }}
                      >
                        {barcode.name} | {new Date().toLocaleDateString()}
                      </Typography>
                      <Divider />
                      <Grid container>
                        {[...Array(16)].map((_, i) => (
                          <Grid key={i} item xs={3}>
                            <Stack
                              sx={{
                                width: 1,
                                height: 160,
                                position: 'relative',
                              }}
                            >
                              <Image
                                alt='barcode'
                                src={`${dataUrl}`}
                                layout='fill'
                                objectFit='contain'
                              />
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                spacing={4}
                sx={{ height: 1, px: 4, py: 6, bgcolor: 'primary.main' }}
                alignItems='center'
              >
                <Stack
                  sx={{
                    position: 'relative',
                    width: 1,
                    height: 74,
                  }}
                >
                  <Image
                    src='/logo.png'
                    alt='logo'
                    layout='fill'
                    objectFit='contain'
                  />
                </Stack>
                <div>
                  <svg ref={inputRef} id='barcode' />
                </div>
                {/* <QRCodeSVG
                  id='barcode'
                  value={`ID:${barcode.id}\nNom:${barcode.name}\nDescription:${barcode.description}`}
                  size={250}
                  // imageSettings={{
                  //   src: '/logo.png',
                  //   width: 50,
                  //   height: 50,
                  //   excavate: false,
                  // }}
                /> */}
                <Button
                  variant='contained'
                  sx={{
                    p: 2,
                    width: 1,
                  }}
                  color='secondary'
                  onClick={handlePrint}
                  startIcon={<PrintIcon />}
                >
                  Imprimer
                </Button>
              </Stack>
            </Grid>
          </Grid>
          {tab === 1 && (
            <Box
              sx={{
                height: 430,
                bgcolor: '#EBEDF5',
                borderRadius: 1,
                p: 2,
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loadingHistorical}
              />
            </Box>
          )}
        </Container>
      </Stack>
    </>
  );
};

export default Home;
