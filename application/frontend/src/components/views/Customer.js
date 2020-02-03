import React, { Fragment, useState, useContext, useEffect } from 'react';
import RentalAgreementContainer from './../RentalAgreement/RentalAgreementContainer';
import Devices from './../Devices/Devices';
import RequestContainer from './../Request/RequestContainer';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';


const Customer = () => {

  const rentalContext = useContext(RentalContext);
  const { getAgreements, getRentableDevices, numPendingAgreements, numActiveAgreements, numTerminatedAgreements, getRequests, requests, numRequests, rentableDevices } = rentalContext;
  const identityContext = useContext(IdentityContext);
  const { ownIdentity } = identityContext;

  const [openPending, setOpenPending] = useState(false);
  const [openActive, setOpenActive] = useState(true);
  const [openTerminated, setOpenTerminated] = useState(false);
  const [openDevices, setOpenDevices] = useState(false);
  const [openRequests, setOpenRequests] = useState(false);

  useEffect(() => {
    getAgreements();
    getRentableDevices();
    getRequests(ownIdentity['role']);
    // eslint-disable-next-line
  },[]);

  const onOpenPending = () => {
    setOpenPending(true);
    setOpenActive(false);
    setOpenTerminated(false);
    setOpenDevices(false);
    setOpenRequests(false);
  }

  const onOpenActive = () => {
    setOpenPending(false);
    setOpenActive(true);
    setOpenTerminated(false);
    setOpenDevices(false);
    setOpenRequests(false);
  }

  const onOpenTerminated = () => {
    setOpenPending(false);
    setOpenActive(false);
    setOpenTerminated(true);
    setOpenDevices(false);
    setOpenRequests(false);
  }

  const onOpenDevices = () => {
    setOpenPending(false);
    setOpenActive(false);
    setOpenTerminated(false);
    setOpenDevices(true);
    setOpenRequests(false);
  }

  const onOpenRequests = () => {
    setOpenPending(false);
    setOpenActive(false);
    setOpenTerminated(false);
    setOpenDevices(false);
    setOpenRequests(true);
  }

  return (
    <Fragment>
      <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
        <Grid item xs align="center">
          <Badge color="secondary" badgeContent={rentableDevices.length}>
            <Button onClick={onOpenDevices} size="large" variant={openDevices ? "contained" : "text"}>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Verfügbare Geräte
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numRequests}>
            <Button onClick={onOpenRequests} size="large" variant={openRequests ? "contained" : "text"}>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Laufende Anfragen
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numPendingAgreements}>
            <Button onClick={onOpenPending} size="large" variant={openPending ? "contained" : "text"}>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Ausstehende Mietverträge
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numActiveAgreements}>
            <Button onClick={onOpenActive} size="large" variant={openActive ? "contained" : "text"}>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Aktive Mietverträge
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numTerminatedAgreements}>
            <Button onClick={onOpenTerminated} size="large" variant={openTerminated ? "contained" : "text"}>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Beendete Mietverträge
              </Typography>
            </Button>
          </Badge>
         </Grid>
       </Grid>
      {
        openDevices && <Devices/>
      }
      {
       openRequests && <RequestContainer/>
      }
      {
       openPending && <RentalAgreementContainer state={'0'}/>
      }
      {
        openActive && <RentalAgreementContainer state={'1'}/>
      }
      {
        openTerminated && <RentalAgreementContainer state={'2'}/>
      }
    </Fragment>
  );
};

export default Customer;
