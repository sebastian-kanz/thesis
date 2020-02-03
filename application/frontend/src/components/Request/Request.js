import React, { useContext } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
Moment.globalFormat = 'DD.MM.YYYY HH:MM:SS';



const Request = ({request}) => {

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { identities, ownIdentity } = identityContext;
  const { requests, getRequests } = rentalContext;
  const { tenant, lessor, device, term } = request;


  let tenantName = "";
  let lessorName = "";

  switch (ownIdentity['role']) {
    case "1":
      //tenantName = identities.filter(identity => identity.address.toUpperCase() === tenant.toUpperCase())[0].name;
      break;
    case "2":
      lessorName = identities.filter(identity => identity.address.toUpperCase() === lessor.toUpperCase())[0].name;
      break;
    default:

  }

  let deviceName = identities.filter(identity => identity.address.toUpperCase() === device.toUpperCase())[0].name;


  return(
    <Container fixed style={{marginTop: 40}}>
      <Paper>
        <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs={12} align="left">
             <Container>
               <Typography variant="h4">
                 <span>{deviceName}</span>
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Hersteller: {lessorName}
               </Typography>
               <br/>
               <br/>
               <Typography variant="overline" color="textSecondary">
                 Status: Warte auf Bestätigung.
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                Vertragsbeginn: <Moment unix format="DD.MM.YYYY HH:mm:ss">{term}</Moment>
               </Typography>
             </Container>
           </Grid>
         </Grid>
      </Paper>
    </Container>
  );
}

export default Request;
