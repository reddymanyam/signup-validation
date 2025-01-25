import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'

const GenerateCircle = () => {
    const[count, setCount] = useState();
    
    const radius = Math.floor(Math.random()*200);

    const handleGenerateCircle = () => {
         return(
            <Box style={{width:radius, height:"radius", borderRadius:"50%", border:"1px solid black"}}>

            </Box>
        )     
    }

    useEffect(() => {
        handleGenerateCircle();
    },[onClick])

  return (
    <Box minWidth="100vw" minHeight="100vh" onClick={handleGenerateCircle}> 
      <h1>circle</h1>
    </Box>
  )
}

export default GenerateCircle;