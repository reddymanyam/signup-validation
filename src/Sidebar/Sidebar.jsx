import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react'
import { styled } from '@mui/material/styles';


const CustomListItemIcon = styled(ListItemIcon)({
      minWidth :"36px"
})

const CustomListItem = styled(ListItem)({
    padding:"1px 1px"
})

const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(true);

    const toggleButton = () =>{
            setIsOpen(!isOpen)
            console.log("button clicked..!")
    }
  return (
    <Box sx={{height:"100vh", display:"flex", width:"100%" }}>

    <Box sx={{width: isOpen ? "12%" : "5%", transition: 'width 0.4s', backgroundColor:"lightblue" , position:"fixed", top:0, left:0, height:"100%"}}>
        <IconButton onClick={toggleButton} sx={{float:"right", cursor:"pointer", zIndex:100}}>
            <MenuIcon />
        </IconButton>

        <List sx={{}}>
            <CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                     {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem>
            <CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                     {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem>
            <CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                    {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                     {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem><CustomListItem>
                <ListItemButton>
                    <CustomListItemIcon>
                        <InboxIcon />
                    </CustomListItemIcon>
                     {isOpen && <ListItemText primary="Home" />}
                </ListItemButton>
            </CustomListItem>
        </List>
    </Box>
    <Box sx={{backgroundColor:"lightcoral",  transition: "padding-left 0.4s ",flexGrow: 1, paddingLeft:isOpen ? "12%" : "5%" }}>
         <h1>Hello world..!</h1>
    </Box>
    </Box>
  )
}

export default Sidebar
