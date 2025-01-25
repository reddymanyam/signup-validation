import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@emotion/react';

import Navbar from '../../../shared/navbar/Navbar';

import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

//Toastify 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFrappeGetDoc, useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';
import { useSelector } from 'react-redux';

export default function TaskDetails() {
    const [dependentTaskChecked, setDependentTaskChecked] = useState(false);
    const [formData, setFormData] = useState({
        taskName: '',
        assignUser: '',
        startDate: '',
        endDate: '',
        parentTaskName: '',
        description: '',
        team: '',
        status: '',
        priority: '',
        stage: '',
        subStatus: '',
        subTasks: []
    });
    const [newSubTask, setNewSubTask] = useState({ subTaskName: '', status: 'Pending' });
    const [showSubTaskFields, setShowSubTaskFields] = useState(false);
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    const projectReducer = useSelector((state) => state.projectReducer);
    const [isChildTableEmpty, setIsChildTableEmpty] = useState(true);

    const location = useLocation();
    const { name } = location.state || {};
    const { data: tasks, mutate: refetchTaskdeatils } = useFrappeGetDoc('Task', name);

    const { data: users } = useFrappeGetDocList('User', { fields: ["name", "full_name"], limit: 0 });
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { data: allTasks } = useFrappeGetDocList('Task', {
        fields: ["name", "subject"],
        filters: [['team', '=', projectReducer.teamName], ['project', '=', projectReducer.projectName]],
        limit: 0
    });
    const [filteredTasks, setFilteredTasks] = useState([]);

    const { call } = useFrappePostCall('novelite_us.novelite_us.api.tasks.update_task.update');

    const theme = useTheme();
    const notifySuccess = (msg) => toast.success(msg, { toastId: "success" });
    const notifyError = (msg) => toast.error(msg, { toastId: "error" });
    const notifyWarn = (msg) => toast.warn(msg, { toastId: "warn" });

    useEffect(() => {
        if (tasks) {
            let task = tasks;
            task.parent_task ? setDependentTaskChecked(true) : setDependentTaskChecked(false);
            setFormData({
                taskName: task.subject,
                assignUser: task.assign_to,
                status: task.status,
                startDate: task.exp_start_date,
                endDate: task.exp_end_date,
                parentTaskName: task.parent_task,
                description: task.task_description_1,
                team: task.team,
                priority: task.priority,
                stage: task.stages,
                subStatus: task.sub_status,
                subTasks: task.list_of_task?.map((subTask) => ({
                    subTaskName: subTask.task_nme,
                    status: subTask.child_status,
                    name: subTask.name
                })) || [],
            });
            if (task.list_of_task.length > 0) setIsChildTableEmpty(false);
        }
    }, [tasks]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisableSubmitBtn(true);
        // console.log("Form Data sending", formData);
        formData['name'] = tasks.name
        try {
            call({ formData: formData })
                .then(res => {
                    res = res.message;
                    // console.log("Response from update call", res);
                    if (res.code === "success") {
                        notifySuccess(res.message);
                        refetchTaskdeatils();
                    } else {
                        notifyError(res.message);
                    }
                    setDisableSubmitBtn(false);
                })
                .catch(err => {
                    console.warn("Response from update call", err);
                    notifyWarn(err);
                    setDisableSubmitBtn(false);
                })

        } catch (error) {
            console.error('Error updating task:', error);
            setDisableSubmitBtn(false);
            alert('Failed to update task');
        }
    };

    const handleUserInputChange = (event, value) => {
        setFormData(prevData => ({ ...prevData, assignUser: value ? value.name : '' }));
    };

    const handleUserSearch = (event, value) => {
        if (value) {
            const filtered = users?.filter(user =>
                user.full_name.toLowerCase().includes(value.toLowerCase()) ||
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckboxChange = () => {
        setDependentTaskChecked(!dependentTaskChecked);
    };

    const handleSubTaskChange = (index, newStatus, name) => {
        const updatedSubTasks = [...formData.subTasks];
        updatedSubTasks[index].status = newStatus;
        setFormData({ ...formData, subTasks: updatedSubTasks });
    };

    const handleAddSubTask = () => {
        if (newSubTask.subTaskName.trim()) {
            setFormData(prevData => ({
                ...prevData,
                subTasks: [...prevData.subTasks, newSubTask]
            }));
            setNewSubTask({ subTaskName: '', status: 'Pending' });
            setShowSubTaskFields(false);
            setIsChildTableEmpty(false);
        }
    };

    if (tasks) {
        return (
            <>
                <Box m={2}>
                    <Navbar title={tasks.name} />
                </Box>
                <Container maxWidth="md" sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Box p={4} sx={{ width: '100%' }}>
                        {/* Static Fields in One Line with Names Below */}
                        <Stack direction="row" spacing={5} justifyContent="space-between" alignItems="center">
                            <Box textAlign="center" sx={{ width: '30%' }}>
                                <Typography variant="h5">Task Name</Typography>
                                <Typography>{formData.taskName}</Typography>
                            </Box>
                            <Box textAlign="center" sx={{ width: '30%' }}>
                                <Typography variant="h5">Status</Typography>
                                {isChildTableEmpty ?
                                    (
                                        <FormControl fullWidth size='small' variant="outlined">
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                label="Status"
                                            >
                                                <MenuItem value="Pending Review">Pending</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )
                                    :
                                    (
                                        <Typography>{formData.status}</Typography>
                                    )}
                            </Box>
                            <Box textAlign="center" sx={{ width: '30%' }}>
                                <Typography variant="h5">Team</Typography>
                                <Typography>{formData.team}</Typography>
                            </Box>
                        </Stack>

                        {/* Form Fields */}
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2} mt={3}>
                                <Stack direction="row" gap={2}>
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
                                <Stack flexDirection='row' gap={2}>
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

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Sub Status</InputLabel>
                                        <Select
                                            name="subStatus"
                                            value={formData.subStatus}
                                            onChange={handleInputChange}
                                            label="Sub Status"
                                        >
                                            <MenuItem value="Not yet started">Not yet started</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Awaiting response">Awaiting Response</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <Stack flexDirection='row' gap={2}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            label="Priority"
                                        >
                                            <MenuItem value="Low">Low</MenuItem>
                                            <MenuItem value="Medium">Medium</MenuItem>
                                            <MenuItem value="High">High</MenuItem>
                                            <MenuItem value="Urgent">Urgent</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Stage</InputLabel>
                                        <Select
                                            name="stage"
                                            value={formData.stage}
                                            onChange={handleInputChange}
                                            label="Stage"
                                        >
                                            <MenuItem value="Closing">Closing</MenuItem>
                                            <MenuItem value="Construction">Construction</MenuItem>
                                            <MenuItem value="Contract">Contract</MenuItem>
                                            <MenuItem value="Marketing">Marketing</MenuItem>
                                            <MenuItem value="Option">Option</MenuItem>
                                            <MenuItem value="Pre Construction">Pre Construction</MenuItem>
                                            <MenuItem value="Pre Proposal">Pre Proposal</MenuItem>
                                        </Select>
                                    </FormControl>
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

                                {formData.subTasks.length > 0 && (
                                    <Stack spacing={2} mt={2}>
                                        {formData.subTasks.map((subTask, index) => (
                                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                                                <ToggleButtonGroup
                                                    value={subTask.status}
                                                    exclusive
                                                    onChange={(event, newStatus) => handleSubTaskChange(index, newStatus, subTask.name)}
                                                >
                                                    <ToggleButton value="Cancelled" label="Cancelled">
                                                        <CancelOutlinedIcon color={subTask.status === "Cancelled" ? "error" : "action"} />
                                                    </ToggleButton>
                                                    <ToggleButton value="Pending" label="Pending">
                                                        <AccessTimeOutlinedIcon color={subTask.status === "Pending" ? "warning" : "action"} />
                                                    </ToggleButton>
                                                    <ToggleButton value="Completed" label="Completed">
                                                        <CheckCircleOutlineIcon color={subTask.status === "Completed" ? "success" : "action"} />
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <Typography variant="body1">{subTask.subTaskName}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}

                                {showSubTaskFields && (
                                    <Stack spacing={2}>
                                        <TextField
                                            label="New Sub Task Name"
                                            value={newSubTask.subTaskName}
                                            onChange={(e) =>
                                                setNewSubTask(prev => ({
                                                    ...prev,
                                                    subTaskName: e.target.value,
                                                }))
                                            }
                                        />
                                        <Button variant="contained" onClick={handleAddSubTask}>
                                            Add Sub Task
                                        </Button>
                                    </Stack>
                                )}

                                <Stack flexDirection={'row'} gap={2}>
                                    <Button variant="outlined" onClick={() => setShowSubTaskFields(!showSubTaskFields)} sx={{ width: '50%' }}>
                                        {showSubTaskFields ? "Cancel" : "Add More Sub Tasks"}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        sx={{ width: '50%' }}
                                        disabled={disableSubmitBtn}
                                    >
                                        {disableSubmitBtn ? <CircularProgress size={24} /> : "Update"}
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Container>
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
            </>
        );
    }

    return null;
}
