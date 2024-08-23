import React, { useState } from 'react'
import { Grid, Card, Typography, Button, TextField, CardContent, Box } from '@mui/material'

const FetchPrescriptions = () => {
  const [rollNo, setRollNo] = useState('')
  const [prescriptions, setPrescriptions] = useState([])

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('token')

    const response = await fetch('http://localhost:8000/api/prescription/doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      },
      body: JSON.stringify({ rollNo })
    })
    const data = await response.json()
    setPrescriptions(data)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
        <TextField label='Roll No' variant='outlined' value={rollNo} onChange={e => setRollNo(e.target.value)} />
        <Button variant='contained' color='primary' onClick={fetchPrescriptions} style={{ marginLeft: '25px' }}>
          Fetch Prescriptions
        </Button>
      </div>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {prescriptions.map((prescription, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      Medicines:
                    </Typography>
                    <Typography variant='body2'>
                      <ul>
                        {Object.entries(prescription.medicines).map(([medicine, dosage]) => (
                          <li key={medicine}>
                            {medicine}: {dosage}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      Issue Date:
                    </Typography>
                    <Typography variant='body2' sx={{ marginBottom: 1 }}>
                      {new Date(prescription.issueDate).toLocaleDateString()}
                    </Typography>

                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                      Expiry Date:
                    </Typography>
                    <Typography variant='body2' sx={{ marginBottom: 1 }}>
                      {new Date(prescription.expiryDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default FetchPrescriptions
