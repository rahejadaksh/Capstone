import React, { useState } from 'react'
import { Button, TextField, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'

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
  },
  disabledTextField: {
    color: 'black' // Setting text color to black
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
    try {
      const response = await fetch('http://localhost:8000/api/student/rollno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNo: userId })
      })
      if (!response.ok) throw new Error('Failed to fetch student data')
      const data = await response.json()
      setPatientData(data)
      setFetchClicked(true)
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

  const handlePrescriptionSubmit = async event => {
    event.preventDefault()
    try {
      const medicines = prescription.reduce((acc, { name, description }) => {
        if (name) acc[name] = description
        return acc
      }, {})
      const token = localStorage.getItem('token')
      console.log(JSON.stringify({ medicines, rollNo: userId }))
      console.log(token)

      const response = await fetch('http://localhost:8000/api/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ medicines, rollNo: userId })
      })
      if (!response.ok) throw new Error('Failed to submit prescription')
      const result = await response.json()
      console.log('Prescription submitted successfully:', result)
      setPrescription([{ name: '', description: '' }]) // Clear prescription fields
    } catch (error) {
      console.error('Error submitting prescription:', error)
    }
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
      <Typography variant='h5' sx={{marginBottom:"15px"}}>
            Add Prescription
        </Typography>
      <form onSubmit={handleFormSubmit} className={classes.gridContainer}>
        <Grid item xs={6} display='flex' alignItems='center'>
          <TextField
            className={classes.formControl}
            label='Roll No'
            value={userId}
            onChange={handleUserIdChange}
            required
            sx={{ width: '100%' }}
            variant='outlined'
            inputProps={{ maxLength: 20 }}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            style={{ marginLeft: 10 }}
            sx={{ width: '40%', height: '50%' }}
          >
            Get Data
          </Button>
        </Grid>
      </form>
      {fetchClicked && patientData && (
        <>
          <Typography variant='h5' component='h2' gutterBottom sx={{ marginTop: 10 }}>
            Patient Details
          </Typography>
          <form>
            <Grid container className={classes.gridContainer}>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Name'
                  value={patientData.name}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                  style={{ color: 'white' }}
                />
              </Grid>
              <Grid item xs={6} style={{color:"white"}}>
                <TextField
                  className={classes.formControl}
                  label='Roll No'
                  value={patientData.rollNo}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Age'
                  value={patientData.age}
                  type='number'
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Email'
                  value={patientData.email}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Hostel'
                  value={patientData.hostel}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Room No'
                  value={patientData.roomNo}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Phone No'
                  value={patientData.phoneNo}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.formControl}
                  label='Blood Group'
                  value={patientData.bloodGroup}
                  InputProps={{ readOnly: true, classes: { input: classes.disabledTextField } }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
          <Typography variant='h5' component='h2' gutterBottom>
            Prescription
          </Typography>
          <form onSubmit={handlePrescriptionSubmit}>
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
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              disabled={prescription.some(row => row.name === '' || row.description === '')}
              sx={{ marginTop: 5 }}
            >
              Submit Prescription
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

export default Prescriptionform
