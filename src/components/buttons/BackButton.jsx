import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function BackButton({ onClick, children }) {
  return (
    <Button
      startIcon={<ArrowBackIosNewIcon fontSize="small" />}
      variant="outlined"
      onClick={onClick}
      sx={{
        textTransform: 'none',
        borderRadius: '10px',
        border: '1px solid rgba(16,24,40,0.12)',
        backgroundColor: '#f8fafc',
        color: 'text.primary',
        py: '6px',
        px: '12px',
        boxShadow: 'none',
        '&:hover': { backgroundColor: '#f1f5f9' }
      }}
    >
      {children}
    </Button>
  );
}
