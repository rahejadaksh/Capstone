// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

// ** Components
import FetchPrescriptions from './FetchPrescriptions' // Import the FetchPrescriptions component

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            View Prescriptions
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FetchPrescriptions />
      </Grid>
    </Grid>
  )
}

export default MUITable
