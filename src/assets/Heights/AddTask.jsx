import React, { useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import Navbar from '../../../shared/navbar/Navbar';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFrappeCreateDoc, useFrappeGetDocList } from 'frappe-react-sdk';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

export default function AddTask() {
    const [dependentTaskChecked, setDependentTaskChecked] = useState(false);
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    const [formData, setFormData] = useState({
        taskName: '',
        assignUser: '',
        startDate: '',
        endDate: '',
        parentTaskName: '',
        description: ''
    });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { data: users } = useFrappeGetDocList('User', { fields: ["name", "full_name"], limit: 0 });
    const projectReducer = useSelector((state) => state.projectReducer);
    const theme = useTheme();
    const navigate = useNavigate();

    const { data: allTasks } = useFrappeGetDocList('Task', {
        fields: ["name", "subject"],
        filters: [['team', '=', projectReducer.teamName], ['project', '=', projectReducer.projectName]],
        limit: 0
    });
    const [filteredTasks, setFilteredTasks] = useState([]);

    const notifySuccess = (msg) => toast.success(msg, { toastId: "success" });
    const notifyError = (msg) => toast.error(msg, { toastId: "error" });
    const notifyWarn = (msg) => toast.warn(msg, { toastId: "warn" });

    const handleTaskSearch = (event, value) => {
        if (value) {
            const filtered = allTasks?.filter(task =>
                task.subject.toLowerCase().includes(value.toLowerCase()) ||
                task.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTasks(filtered);
        } else {
            setFilteredTasks([]);
        }
    };

    const handleParentTaskChange = (event, value) => {
        setFormData(prevData => ({ ...prevData, parentTaskName: value ? value.name : '' }));
    };


    /** Hook to create new Task */
    const { createDoc } = useFrappeCreateDoc();

    /**
     * Handles form submission to create a new task.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setDisableSubmitBtn(true);

        const newTask = {
            subject: formData.taskName,
            assign_to: formData.assignUser,
            exp_start_date: formData.startDate,
            exp_end_date: formData.endDate,
            description: formData.description,
            parent_task: formData.parentTaskName,
            project: projectReducer.projectName,
            team: projectReducer.teamName,
            stages: projectReducer.stageName,
            is_owned: projectReducer.projectType === 'Owned' ? 1 : 0
        };

        createDoc('Task', newTask)
            .then((res) => {
                notifySuccess("New task created successfully!!!");
                setTimeout(() => {
                    setDisableSubmitBtn(false);
                    navigate(-1);
                }, 2000);
            }).catch((err) => {
                notifyError(err.message || "Error creating task");
                setDisableSubmitBtn(false);
            })
    };

    /**
     * Handles input field changes and updates state.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Toggles the checkbox for dependent task.
     */
    const handleCheckboxChange = () => {
        setDependentTaskChecked(!dependentTaskChecked);
    };

    /**
     * Handles the selection and search of users in the autocomplete component.
     * @param {React.SyntheticEvent<Element, Event>} event - The change event from the autocomplete component.
     * @param {Object | null} value - The selected user object or null.
     */
    const handleUserInputChange = (event, value) => {
        setFormData(prevData => ({ ...prevData, assignUser: value ? value.name : '' }));
    };

    /**
     * Filters users based on the input value for the autocomplete component.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event from the autocomplete component.
     * @param {string} value - The input value.
     */
    const handleUserSearch = (event, value) => {
        if (value) {
            const filtered = users.filter(user =>
                user.full_name.toLowerCase().includes(value.toLowerCase()) ||
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    };

    return (
        <>
            <Box mx={2} mt={2}>
                <Navbar title='Add Task' />
            </Box>
            <Container maxWidth="md" sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box p={4} sx={{ width: '100%' }}>
                    <Typography variant="h3" align="center" gutterBottom mb={3}>
                        Add Task
                    </Typography>

                    {/* Static Fields in One Line with Names Below */}
                    <Stack direction="row" spacing={5} justifyContent="space-between" alignItems="center">
                        <Box textAlign="center">
                            <Typography variant="h6">Project Name</Typography>
                            <Typography>{projectReducer.projectName}</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h6">Team</Typography>
                            <Typography>{projectReducer.teamName}</Typography>
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h6">Stage</Typography>
                            <Typography>{projectReducer.stageName}</Typography>
                        </Box>
                    </Stack>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit}>
                        <Stack direction="row" gap={2} marginTop={'20px'}>
                            <TextField
                                label="Start Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                name="startDate"
                                InputLabelProps={{ shrink: true }}
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                name="endDate"
                                InputLabelProps={{ shrink: true }}
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                        </Stack>
                        <Stack spacing={2} mt={3}>

                            <Stack flexDirection='row' gap={2}>
                                <TextField
                                    label="Task Name"
                                    variant="outlined"
                                    fullWidth
                                    name="taskName"
                                    value={formData.taskName}
                                    onChange={handleInputChange}
                                />

                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '2.7rem', // Set height for the input
                                        }
                                    }}
                                    options={filteredUsers}
                                    getOptionLabel={(option) => option.full_name || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Assign User"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    onInputChange={handleUserSearch}
                                    onChange={handleUserInputChange}
                                    value={users?.find(user => user.name === formData.assignUser) || null}
                                />

                            </Stack>

                            <Stack flexDirection='row' gap={2} width='100%' height='3rem'>
                                <FormControlLabel
                                    sx={{ width: '30%' }}
                                    control={
                                        <Checkbox
                                            checked={dependentTaskChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Add Parent Task"
                                />
                                {dependentTaskChecked && (
                                    <Autocomplete
                                        freeSolo
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '2.7rem', // Set height for the input
                                            },
                                            width: '70%'
                                        }}
                                        options={filteredTasks}
                                        getOptionLabel={(option) => option.subject || ''}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.name}>
                                                {`${option.subject} (${option.name})` || ''}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Parent Task Name"
                                                variant="outlined"
                                                name="parentTaskName"
                                            />
                                        )}
                                        onInputChange={handleTaskSearch}
                                        onChange={handleParentTaskChange}
                                        value={allTasks?.find(task => task.name === formData.parentTaskName) || null}
                                    />
                                )}

                                {/* {dependentTaskChecked && (
                                        <TextField
                                            sx={{ width: '70%' }}
                                            label="Parent Task Name"
                                            variant="outlined"
                                            name="parentTaskName"
                                            value={formData.parentTaskName}
                                            onChange={handleInputChange}
                                        />
                                    )} */}
                            </Stack>

                            {/* <Stack flexDirection='row' gap={2} width='100%' height='3rem'> */}
                            {/* Dependent Task Checkbox */}
                            {/* <FormControlLabel
                                    sx={{ width: '30%' }}
                                    control={
                                        <Checkbox
                                            checked={dependentTaskChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Dependent Task"
                                /> */}

                            {/* Conditional Parent Task Name Field */}
                            {/* {dependentTaskChecked && (
                                    <TextField
                                        sx={{ width: '70%' }}
                                        label="Parent Task Name"
                                        variant="outlined"
                                        name="parentTaskName"
                                        value={formData.parentTaskName}
                                        onChange={handleInputChange}
                                    />
                                )} */}
                            {/* </Stack> */}

                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />

                            <Button variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                disabled={disableSubmitBtn}
                            >
                                {disableSubmitBtn ? <CircularProgress size={24} /> : "Submit"}
                            </Button>
                        </Stack>
                    </form>
                </Box>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={theme.palette.mode}
                />
            </Container>
        </>
    );
}
