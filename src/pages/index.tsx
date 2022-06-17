import Button from '@mui/material/Button';
import type { NextPage } from 'next';
import Input from '@components/input';
import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Head from 'next/head';
import { useBarcode } from 'next-barcode';
import React from 'react';
import { toSvg } from 'html-to-image';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/system';
// import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
interface DataBarcode {
  id: string;
  name: string;
  price: string;
}

const Home: NextPage = () => {
  const componentRef = React.useRef<React.ReactInstance | null>(null);
  const [tab, setTab] = React.useState(0);
  const [dataUrl, setDataUrl] = React.useState('');
  const [barcode, setBarcode] = React.useState({
    id: '000000000000',
    name: 'Lorem Ipsum',
    price: '729300000',
  });

  const { inputRef } = useBarcode({
    value: barcode.id,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DataBarcode>({
    defaultValues: {
      id: '383837474757575',
      name: 'Lorem Ipsum',
      price: '729300000',
    },
  });

  const onGenerate = (data: DataBarcode) => {
    setBarcode(data);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  return (
    <>
      <Head>
        <title>Générateur Code barre</title>
      </Head>
      <Stack
        sx={{
          py: 4,
          background: 'linear-gradient(to right, #b92b27, #1A237E)',
          minHeight: '100vh',
        }}
        justifyContent='center'
        alignItems='center'
      >
        <Container>
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 1,
              my: 2,
              boxShadow: '0 0 20px 5px rgba(200,0,0,0.2)',
            }}
          >
            <Tabs value={tab} onChange={handleChange}>
              <Tab label='Générateur' />
              <Tab label='Liste de produits' />
            </Tabs>
          </Box>

          <Grid
            container
            sx={{
              bgcolor: '#EBEDF5',
              borderRadius: 1,
              boxShadow: '0 0 20px 5px rgba(200,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            <Grid item xs={12} md={8} sx={{ minWidth: 900 }}>
              <Stack spacing={2} sx={{ px: 4, py: 6 }}>
                <Controller
                  name='id'
                  control={control}
                  rules={{ required: true }}
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
                  name='price'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      label='Prix du produit'
                      type='number'
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
                  // endIcon={<RocketLaunchIcon />}
                >
                  Générer le code barre
                </Button>
                <div style={{ display: 'none' }}>
                  <svg ref={inputRef} id='barcode' />
                </div>
                {dataUrl && barcode?.name && (
                  <Stack>
                    <Stack ref={componentRef} sx={{ px: 3, py: 2 }} spacing={2}>
                      <Typography
                        textAlign='center'
                        fontWeight={600}
                        sx={{ textTransform: 'uppercase' }}
                      >
                        {barcode.name} | {barcode.price} Fc
                      </Typography>
                      <Divider />
                      <Grid container>
                        {[...Array(16)].map((_, i) => (
                          <Grid key={i} item xs={3} md={6}>
                            <Stack
                              sx={{
                                width: 1,
                                height: 160,
                                position: 'relative',
                                bgcolor: 'red',
                                p: 1,
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
                      <Divider />
                      <Stack justifyContent='space-between' direction='row'>
                        <Typography textAlign='center'>
                          {new Date().toLocaleDateString()}
                        </Typography>
                        <Typography textAlign='center'>
                          {new Date().toLocaleTimeString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack
                spacing={4}
                sx={{ height: 1, px: 4, py: 6, bgcolor: 'background.paper' }}
                alignItems='center'
              >
                <div>
                  <svg ref={inputRef} id='barcode' />
                </div>
                <Button
                  variant='contained'
                  sx={{ p: 2, width: 1 }}
                  onClick={handlePrint}
                  // endIcon={<RocketLaunchIcon />}
                >
                  Imprimer
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Stack>
    </>
  );
};

export default Home;
