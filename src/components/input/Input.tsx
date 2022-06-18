import TextField from '@mui/material/TextField';
import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  label: string;
  type?: string;
  rows?: number;
  multiline?: boolean;
  value: string;
  helperText?: string;
  error?: boolean;
  handleChange?(
    event: { target: { value: string; name: string } } | string | null
  ): void;
}

const Input: React.FC<Props> = ({
  label,
  type = 'text',
  rows,
  multiline,
  value,
  handleChange,
  helperText,
  error,
}) => {
  return (
    <TextField
      label={`${label} ${error ? ` - ${helperText}` : ''}`}
      type={type}
      value={value}
      sx={{ bgcolor: '#fff' }}
      onChange={handleChange}
      {...(multiline && { rows, multiline })}
      error={error}
    />
  );
};

export default Input;
