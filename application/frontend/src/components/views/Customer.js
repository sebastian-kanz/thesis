import React, { Fragment, useState, useContext, useEffect } from 'react';
import RentalAgreementContainer from './../RentalAgreement/RentalAgreementContainer';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import RentalContext from './../../context/rental/rentalContext';


const Customer = () => {

  const rentalContext = useContext(RentalContext);
  const { getAgreements, getPayments, numPendingAgreements, numActiveAgreements, numTerminatedAgreements } = rentalContext;

  const [openPending, setOpenPending] = useState(false);
  const [openActive, setOpenActive] = useState(true);
  const [openTerminated, setOpenTerminated] = useState(false);

  useEffect(() => {
    getAgreements();
    // eslint-disable-next-line
  },[]);

  const onOpenPending = () => {
    setOpenPending(true);
    setOpenActive(false);
    setOpenTerminated(false);
  }

  const onOpenActive = () => {
    setOpenPending(false);
    setOpenActive(true);
    setOpenTerminated(false);
  }

  const onOpenTerminated = () => {
    setOpenPending(false);
    setOpenActive(false);
    setOpenTerminated(true);
  }

  return (
    <Fragment>
      <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
        <Grid item xs align="center">
          <Badge color="secondary" badgeContent={numPendingAgreements}>
            <Button onClick={onOpenPending} size="large">
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Ausstehende Mietverträge
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numActiveAgreements}>
            <Button onClick={onOpenActive} size="large">
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Aktive Mietverträge
              </Typography>
            </Button>
          </Badge>
          <Badge color="secondary" badgeContent={numTerminatedAgreements}>
            <Button onClick={onOpenTerminated} size="large">
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                Beendete Mietverträge
              </Typography>
            </Button>
          </Badge>
         </Grid>
       </Grid>
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
