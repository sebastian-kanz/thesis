import React, { useEffect, useContext, useState, Fragment } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IdentityContext from './../../context/identity/identityContext';
Moment.globalFormat = 'DD.MM.YYYY HH:MM:SS';




const RentalAgreement = ({ agreement }) => {
  let tenant = agreement[0];
  let tenantSignature = agreement[1];
  let lessor = agreement[2];
  let lessorSignature = agreement[3];
  let device = agreement[4];
  let usageFee = agreement[5];
  let contractTerm = agreement[6];
  let creation = agreement[7];
  let state = agreement[8];
  let id = agreement[9];
  let hash = agreement[10];

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { payments, acceptRentalAgreement, pay, getPayments, getAgreements } = rentalContext;
  const { identities } = identityContext;

  useEffect(() => {
    // invoices = payments.filter((item) => {
    //   return item[5] == hash
    // });
    // total = invoices.reduce(sumTotal,0.0)
    const timer = setTimeout(() => {
      getPayments();
      getAgreements();
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  },[payments]);

  const deviceIdentity = identities.filter((identity) => {
    return identity['address'] == device.toLowerCase()
  });
  const deviceName = deviceIdentity[0]['name'];

  const lessorIdentity = identities.filter((identity) => {
    return identity['address'] == lessor.toLowerCase()
  });
  const lessorName = lessorIdentity[0]['name'];



  const [expanded, setExpanded] = useState(false);

  let invoices = payments.filter((item) => {
    return item[5] === hash
  });

  const sumTotal = (total, elem) => {
    return total + parseFloat(elem[4]/1000000000000000000);
  };

  let total = invoices.reduce(sumTotal,0.0)


  const onToggleInvoice = async() => {
    setExpanded(!expanded);
  }

  const onPay = async() => {
    let timestamp = Math.floor(Date.now() / 1000);
    await pay(timestamp, device, tenant, lessor, usageFee, id);
  }

  const onAccept = async() => {
    await acceptRentalAgreement(tenant,lessor,device,usageFee,contractTerm,id);
  }

  return (
    <Container fixed style={{marginTop: 40}}>
      <Paper>
        <Grid container spacing={2}>
          <p></p>
        </Grid>
        <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs={2} align="center">
             <Container style={{height: 100}}>
               {parseInt(state) === 0?
                 <HourglassEmptyIcon style={{fontSize: 50}}/> : null
               }
               {parseInt(state) === 1?
                 <CheckIcon style={{fontSize: 50}}/> : null
               }
               {parseInt(state) === 2?
                 <IndeterminateCheckBoxIcon style={{fontSize: 50}}/> : null
               }
             </Container>
             <Container>
               <Typography variant="caption" color="textSecondary">
                 <p>Vertragsbeginn:<br/><Moment unix format="DD.MM.YYYY HH:mm:ss">{creation}</Moment></p>
               </Typography>
               <Typography variant="caption" color="textSecondary">
                 <p>Gültig bis:<br/><Moment unix format="DD.MM.YYYY HH:mm:ss">{contractTerm}</Moment></p>
               </Typography>
             </Container>
           </Grid>
           <Grid item xs={8} align="left">
             <Container>
               <Typography variant="h4">
                 <span>{deviceName}</span>
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: {device}
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                 {lessorName}
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: {lessor}
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                 -
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: -
               </Typography>
               <br/>
               <br/>
               <Typography variant="h5">
                 -
               </Typography>
               <Typography variant="overline" color="textSecondary">
                 Adresse: -
               </Typography>
             </Container>
           </Grid>
           <Grid item xs={2} align="center">
             <Container>
               <Typography variant="caption" color="textSecondary">
                 <p>Kosten pro Einheit:<br/>~{(usageFee/ 1000000000000000000 * 148.15).toFixed(2)}€<br/>({usageFee / 1000000000000000000} ETH)</p>
               </Typography>
               {parseInt(state) === 1 &&
                 <Fragment>
                   <Typography variant="caption" color="textSecondary">
                     <p>Kosten Gesamt:<br/>~{(total * 148.15).toFixed(2)}€<br/>({total} ETH)</p>
                   </Typography>
                   <Typography variant="caption" color="textSecondary">
                     <p>Einheiten Gesamt:<br/>{invoices.length}</p>
                   </Typography>
                 </Fragment>
               }
             </Container>
           </Grid>
         </Grid>
         <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs align="center">
                 {parseInt(state) === 0?
                 <Button onClick={onAccept} size="large" variant="outlined" color="primary">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Akzeptieren
                   </Typography>
                 </Button>
                   : null
                 }
                 {parseInt(state) === 1?
                   <Fragment>
                     <Button size="large" variant="outlined" color="secondary">
                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Beenden
                       </Typography>
                     </Button>
                     <Button onClick={onPay} size="large" variant="outlined" color="primary">
                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Bezahlen
                       </Typography>
                     </Button>
                     <Button onClick={onToggleInvoice} size="large" variant="outlined" color="primary">
                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Rechnungen
                       </Typography>
                     </Button>
                    </Fragment>
                   : null
                 }
                 {parseInt(state) === 2?
                 <Button size="large" variant="outlined" color="default">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Reaktivieren
                   </Typography>
                 </Button>
                   : null
                 }
           </Grid>
         </Grid>
         <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs={8} align="center">
             <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography paragraph>Rechnungen:</Typography>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Zeitpunkt</TableCell>
                        <TableCell align="right">Summe</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        invoices.map((elem, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell size="small" align="left"><Moment unix format="DD.MM.YYYY HH:mm:ss">{elem[0]}</Moment></TableCell>
                              <TableCell size="small" align="right">{elem[4] / 1000000000000000000 * 148.15}€ ({elem[4] / 1000000000000000000}ETH)</TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
            </Collapse>
          </Grid>
        </Grid>
      </Paper>
    </Container>
   );
}

RentalAgreement.propTypes = {
  agreement: PropTypes.object.isRequired
}

export default RentalAgreement;
