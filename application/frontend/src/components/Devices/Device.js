import React, { useContext,useEffect } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import Divider from '@material-ui/core/Divider';



const Device = ({device}) => {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { addRequest, getRentableDevices, getRequests } = rentalContext;
  const { ownIdentity } = identityContext;

  const { address, name, role, owner, ownerName } = device;


  //
  // const timeout = (ms) => {
  //     return new Promise(resolve => setTimeout(resolve, ms));
  // }
  //
  // const myAsyncFunction = async(controller) => {
  //   await timeout(2000);
  //   if(controller.cancelled) {
  //     console.log("cancelled");
  //   } else {
  //     console.log("finished");
  //   }
  // }

  const onRequest = async() => {
    let term = Math.floor(Date.now() / 1000) + 60*60*24*100;
    await addRequest(address, owner, term);
    await getRentableDevices(controller);
    await getRequests(ownIdentity['role'], controller);
  }

  return(
    <Container fixed style={{marginTop: 40}}>
      <Paper>
        <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs={2} align="center">
             <Container>
               <LocalCafeIcon style={{fontSize: 50}}/>
             </Container>
           </Grid>
           <Grid item xs={6} align="left">
             <Container>
               <Typography variant="h4">
                 <span>{name}</span>
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: {address}
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                {ownerName}
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: {owner}
               </Typography>
             </Container>
           </Grid>
           <Grid item xs={4} align="center">
             <Container>
               <Button onClick={onRequest} size="large" variant="outlined" color="primary">
                 <Typography variant="body2" style={{ cursor: 'pointer'}}>
                  Anfragen
                 </Typography>
               </Button>
             </Container>
           </Grid>
         </Grid>
      </Paper>
    </Container>
  );
}

export default Device;
