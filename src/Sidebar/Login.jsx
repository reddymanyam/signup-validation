import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'

const Login = () => {
    
    const [values, setValues] = useState({
        firstname:"",
        lastname:"",
        email:"",
        number:""
    })

    // const[firstname, setFirstname] = useState("");
    // const[lastname, setLastname] = useState("");
    // const[email, setEmail] = useState("");
    // const[number, setNumber] = useState();
    
    const handleLogin = () =>{
        alert(`FirstName: ${values.firstname} \n LastName: ${values.lastname}`);
    }
  return (
    <>
     <TextField label="firstname" value={values.firstname} onChange={(e) => setValues({...values, firstname : e.target.value})} />
     <TextField label="lastname" value={values.lastname} onChange={(e) => setValues({...values, lastname:e.target.value})} />
     <TextField label="email" value={values.email} onChange={(e)=> setValues({...values, email:e.target.value})} />
     <TextField type='number' label="number" value={values.number} onChange={(e)=>setValues({...values, number:e.target.value})} />  
     <Button onClick={handleLogin}>Login</Button>
    </>
  )
}

export default Login
