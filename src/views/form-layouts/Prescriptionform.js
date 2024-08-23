import React, { useState } from 'react'
import { Button, TextField, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { enUS } from 'date-fns/locale'

const useStyles = makeStyles({
  formControl: {
    margin: '10px 0'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '10px'
  },
  button: {
    width: '80%',
    margin: '0 auto',
    marginTop: 10,
    marginBottom: 10
  },
  addButton: {
    width: '30px',
    height: '30px',
    marginLeft: '10px'
  },
  deleteButton: {
    width: '30px',
    height: '30px',
    marginLeft: '10px'
  }
})

const Prescriptionform = () => {
  const classes = useStyles()

  const [userId, setUserId] = useState('')
  const [patientData, setPatientData] = useState(null)
  const [prescription, setPrescription] = useState([{ name: '', description: '' }])
  const [fetchClicked, setFetchClicked] = useState(false)
  const currentDate = new Date().toLocaleDateString()

  const handleUserIdChange = event => {
    setUserId(event.target.value)
  }

  const handleFormSubmit = async event => {
    event.preventDefault()
    // Simulate fetching patient data using userId
    const mockPatientData = {
      name: 'John Doe',
      rollNo: '12345',
      age: 25,
      gender: 'Male'
    }
    setPatientData(mockPatientData)
    setFetchClicked(true)
  }

  const handlePrescriptionSubmit = async event => {
    event.preventDefault()
    console.log('Prescription submitted:', { prescription })
  }

  const handleAddRow = () => {
    setPrescription([...prescription, { name: '', description: '' }])
  }

  const handleDeleteRow = index => {
    const newPrescription = [...prescription]
    newPrescription.splice(index, 1)
    setPrescription(newPrescription)
  }

  return (
    <div>
      <Typography variant='h4' component='h1' gutterBottom>
        Patient Information
      </Typography>
      <form onSubmit={handleFormSubmit} className={classes.gridContainer}>
        <Grid item xs={6} display='flex' alignItems='center'>
          <TextField
            className={classes.formControl}
            label='User ID'
            value={userId}
            onChange={handleUserIdChange}
            required
            style={{ flex: 1 }}
            variant='outlined'
            inputProps={{ maxLength: 20 }}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.button}
            style={{ marginLeft: 10 }}
          >
            Fetch Patient Data
          </Button>
        </Grid>
      </form>
      {fetchClicked && patientData && (
        <>
          <Typography variant='h5' component='h2' gutterBottom>
            Patient Details
          </Typography>
          <form>
            <Grid container className={classes.gridContainer}>
              <Grid item xs={6}>
                <TextField className={classes.formControl} label='Name' value={patientData.name} disabled fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Roll No'
                  value={patientData.rollNo}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Age'
                  value={patientData.age}
                  type='number'
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Gender'
                  value={patientData.gender}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className={classes.formControl}>
                <TextField
                  className={classes.formControl}
                  label='Date'
                  value={currentDate}
                  disabled
                  fullWidth
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </form>
          <Typography variant='h5' component='h2' gutterBottom>
            Prescription
          </Typography>
          <form>
            {prescription.map((row, index) => (
              <Grid container key={index} className={classes.gridContainer}>
                <Grid item xs={6}>
                  <TextField
                    className={classes.formControl}
                    label='Medicine Name'
                    value={row.name}
                    onChange={event => {
                      const newPrescription = [...prescription]
                      newPrescription[index].name = event.target.value
                      setPrescription(newPrescription)
                    }}
                    // style={{ width: 200 }}
                    fullWidth
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.formControl}
                    label='Description'
                    value={row.description}
                    onChange={event => {
                      const newPrescription = [...prescription]
                      newPrescription[index].description = event.target.value
                      setPrescription(newPrescription)
                    }}
                    fullWidth
                    multiline
                    rows={1}
                    // style={{ width: 850 }}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {index > 0 && (
                    <Button
                      variant='contained'
                      color='secondary'
                      className={classes.deleteButton}
                      onClick={() => handleDeleteRow(index)}
                    >
                      -
                    </Button>
                  )}
                  {index === prescription.length - 1 && (
                    <Button variant='contained' color='primary' className={classes.addButton} onClick={handleAddRow}>
                      +
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </form>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            onClick={handlePrescriptionSubmit}
            disabled={prescription.some(row => row.name === '' || row.description === '')}
          >
            Submit Prescription
          </Button>
        </>
      )}
    </div>
  )
}

export default Prescriptionform
