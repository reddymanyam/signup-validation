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
    
   const handleChange = (field) => (e) =>{
    setValues((prevValues) => (
      {...prevValues, [field]: e.target.value}
    ));
   };

    const handleLogin = () =>{
        alert(`FirstName: ${values.firstname} \n LastName: ${values.lastname}`);
    }
  return (
    <>
     <TextField label="firstname" value={values.firstname} onChange={handleChange} />
     <TextField label="lastname" value={values.lastname} onChange={handleChange} />
     <TextField label="email" value={values.email} onChange={handleChange} />
     <TextField type='number' label="number" value={values.number} onChange={handleChange} />  
     <Button onClick={handleLogin}>Login</Button>
    </>
  )
}

export default Login
