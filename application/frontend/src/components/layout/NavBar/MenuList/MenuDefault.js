import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory } from "react-router-dom";


const MenuDefault = () => {
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
    </Fragment>
  );
};

export default MenuDefault;
