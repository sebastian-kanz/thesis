import React, { useContext, useEffect, useState, Fragment } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';
import {ETH_EUR} from '../../constants.js'
Moment.globalFormat = 'DD.MM.YYYY HH:MM:SS';



const Request = ({request}) => {

  const controller = { cancelled: false };
  useEffect(() => {

    getBalance(controller);
    return () => controller.cancelled = true;
  }, []);


  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { identities, ownIdentity, getBalance } = identityContext;
  const { requests, getRequests, addAgreement, getAgreements } = rentalContext;
  const { tenant, lessor, device, term } = request;

  let tenantName = "";
  let lessorName = "";

  switch (ownIdentity['role']) {
    case "1":
      // tenantName = (identities.filter(identity => identity.address.toUpperCase() === tenant.toUpperCase()))[0].name;
      let tenantIdentity = identities.filter(identity => identity.address.toUpperCase() === tenant.toUpperCase());
      tenantName = tenantIdentity[0] ? tenantIdentity[0].name : "Name unknown";
      break;
    case "2":
      let lessorIdentity = identities.filter(identity => identity.address.toUpperCase() === lessor.toUpperCase());
      lessorName = lessorIdentity[0] ? lessorIdentity[0].name : "Name unknown";
      break;
    default:

  }

  let deviceIdentity = identities.filter(identity => identity.address.toUpperCase() === device.toUpperCase());
  let deviceName = deviceIdentity[0] ? deviceIdentity[0].name : "";

  const [value, setValue] = useState(0.001);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = event => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const onAccept = async() => {
    await addAgreement(tenant, device, value, term);
    await getRequests(ownIdentity['role'], controller);
    await getBalance(controller);
    await getAgreements(controller);
  }

  const onDecline = async() => {

  }

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
                 {ownIdentity['role'] === "1" ? (<span>Kunde: {tenantName}</span>) : (<span>Hersteller: {lessorName}</span>)}
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                Vertragsbeginn: - ab sofort -
               </Typography>
               <Typography variant="h5">
                Vertragsende: <Moment unix format="DD.MM.YYYY HH:mm:ss">{term}</Moment>
               </Typography>
             </Container>
           </Grid>
           {ownIdentity['role'] === "1" ? (
           <Fragment>
             <Grid item xs={4} align="center">
               <Slider
                  value={typeof value === 'number' ? value : 0}
                  onChange={handleSliderChange}
                  step={0.001}
                  min={0.001}
                  max={0.01}
                />
              </Grid>
              <Grid item xs={6} align="center">
                <Input
                  value={value}
                  margin="dense"
                  onChange={handleInputChange}
                  inputProps={{
                    step: 0.001,
                    min: 0.001,
                    max: 0.01,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
                <Typography>
                 {(value*ETH_EUR).toFixed(1)}0€
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Button onClick={onAccept} size="large" variant="outlined" color="primary">
                  <Typography variant="body2" style={{ cursor: 'pointer'}}>
                   Akzeptieren
                  </Typography>
                </Button>
                <Button onClick={onDecline} size="large" variant="outlined" color="primary">
                  <Typography variant="body2" style={{ cursor: 'pointer'}}>
                   Ablehnen
                  </Typography>
                </Button>
              </Grid>
            </Fragment>
          ) : null }
         </Grid>
      </Paper>
    </Container>
  );
}

export default Request;
