// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project imports
import ReportCard from 'components/cards/ReportCard';
import SmallFlatCard from 'components/cards/SmallFlatCard';
import TrafficSourceCard from 'components/cards/TrafficSourceCard';
import RevenuChartCard from 'components/third-party/RevenuChartCard';
import SalesLineChartCard from 'components/third-party/SalesLineChartCard';
import { GRID_SPACING } from 'config';

// data
import { reportCardData } from './data/report-card-data';
import { revenueCardData } from 'sections/dashboard/chart/card-data/revenue-card-data';
import { salesLineCardData } from './data/sales-line-chart-card-data';
import { smallFlatCardData } from './data/small-flat-card-data';
import { trafficSourceData } from './data/traffic-source-card-data';

// ==============================|| DASHBOARD DEFAULT ||============================== //

export default function Home() {
  return (
    <Grid container spacing={GRID_SPACING}>
     
    </Grid>
  );
}
