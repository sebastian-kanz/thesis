import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory } from "react-router-dom";


const MenuSupplier = () => {
  let history = useHistory();
  return(
    <Fragment>
      <List>
        <ListItem button onClick={() => history.push('/about')}>
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText>
            Über diese App
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => console.log("click")}>
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText>
            Menü-Eintrag
          </ListItemText>
        </ListItem>
      </List>
    </Fragment>
  );
};

export default MenuSupplier;
