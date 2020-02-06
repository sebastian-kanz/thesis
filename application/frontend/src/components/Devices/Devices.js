import React, { useContext, useEffect, Fragment } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';
import Device from './Device';
import { isNullOrUndefined } from "util";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';




const Devices = () => {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { getRentableDevices, rentableDevices, getRequests, requests } = rentalContext;
  const { identities, ownIdentity } = identityContext;

  useEffect(() => {
    getRentableDevices(controller);
    getRequests(ownIdentity['role'], controller);
    // eslint-disable-next-line
  },[]);

  let devices = [];

  for (var rentable of rentableDevices) {
    let selected = identities.filter(identity => identity.address.toUpperCase() === rentable.toUpperCase())[0];

    if(!isNullOrUndefined(selected)) {
      let ownerName = identities.filter(identity => identity.address.toUpperCase() === selected.owner.toUpperCase())[0].name;
      selected['ownerName'] = ownerName;
      devices.push(selected);
    }
  }

  return(
    <Fragment>
    {
      rentableDevices && devices.map((value, key) => {
        return <Device key={key} device={value}/>
      })
    }
    {
    devices.length === 0 &&
      <Container fixed style={{marginTop: 40}}>
        <Paper>
          <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
             <Grid item xs={12} align="center">
               <Container>
                 <Typography>Alle Geräte befinden sich derzeit in Vermietung.</Typography>
               </Container>
             </Grid>
           </Grid>
         </Paper>
       </Container>
    }
    </Fragment>
  );
}


export default Devices;
