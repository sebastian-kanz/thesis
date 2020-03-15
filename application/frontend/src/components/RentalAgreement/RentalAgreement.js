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
import TextField from '@material-ui/core/TextField';
import IdentityContext from './../../context/identity/identityContext';
import PaymentContext from './../../context/payment/paymentContext';
import {ETH_EUR} from '../../constants.js'
import {EUR_ETH} from '../../constants.js'
Moment.globalFormat = 'DD.MM.YYYY HH:MM:SS';




const RentalAgreement = ({ agreement }) => {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);

  let tenant = agreement[0];
  let tenantSignature = agreement[1];
  let lessor = agreement[2];
  let lessorSignature = agreement[3];
  let device = agreement[4];
  let usageFee = agreement[5];
  let contractTerm = agreement[6];
  let creation = agreement[7];
  let state = agreement[8];
  let paymentHash = agreement[9]
  let id = agreement[10];
  let hash = agreement[11];

  const rentalContext = useContext(RentalContext);
  const paymentContext = useContext(PaymentContext);
  const identityContext = useContext(IdentityContext);
  const { acceptRentalAgreement, getAgreements, terminateRentalAgreement } = rentalContext;
  const { identities, ownIdentity } = identityContext;
  const { charge, getSignedPaymentJSON, redeem, addPaymentHash, getPaymentAgreements, paymentAgreements, paymentHashes } = paymentContext;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getPayments();
  //     getAgreements();
  //   }, 5000);
  //   return () => clearTimeout(timer);
  //   // eslint-disable-next-line
  // },[payments]);

  useEffect(() => {
    addPaymentHash(paymentHash);

    getPaymentAgreements(controller);
    // eslint-disable-next-line
  },[]);

  useEffect(() => {
    getPaymentAgreements(controller);
    // eslint-disable-next-line
  },[paymentHashes]);

  const deviceIdentity = identities.find((identity) => {
    return identity['address'].toLowerCase() == device.toLowerCase()
  });

  let deviceName = !deviceIdentity? "" : deviceIdentity['name'];

  const lessorIdentity = identities.find((identity) => {
    return identity['address'].toLowerCase() == lessor.toLowerCase()
  });
  const lessorName = !lessorIdentity? "" : lessorIdentity['name'];

  const tenantIdentity = identities.find((identity) => {
    return identity['address'].toLowerCase() == tenant.toLowerCase()
  });
  const tenantName = !tenantIdentity? "" : tenantIdentity['name'];

  const [expanded, setExpanded] = useState(false);

  const onToggleInvoice = async() => {
    setExpanded(!expanded);
    getPaymentAgreements(controller);
  }

  const onPay = async() => {
    let units = 1;
    let timestampStart = Math.floor(Date.now() / 1000);
    let timestampEnd = timestampStart + 60*60*24*10;
    console.log(paymentHash, timestampStart, timestampEnd, units, usageFee, device, controller);
    await getSignedPaymentJSON(paymentHash, timestampStart, timestampEnd, units, usageFee, device, controller);
  }

  const onCharge = async() => {
    let amount = 10.0 * 1000000000000000000 * EUR_ETH;
    await charge(paymentHash, amount);
    await getPaymentAgreements(controller);
  }

  const onAccept = async() => {
    await acceptRentalAgreement(tenant,lessor,device,usageFee,contractTerm,id);
    await getPaymentAgreements(controller);
  }

  const onTerminate = async() => {
    await terminateRentalAgreement(id);
    await getPaymentAgreements(controller);
  }

  const [paymentAgreement, setPaymentAgreement] = useState({});
  const [history, setHistory] = useState([]);
  const [timestampStartArr, setTimestampStartArr] = useState([]);
  const [timestampEndArr, setTimestampEndArr] = useState([]);
  const [units, setUnits] = useState([]);
  const [costs, setCosts] = useState([]);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  useEffect(() => {
    let tmp = paymentAgreements.find(obj => {
      return obj.paymentHash === paymentHash
    })
    if(tmp) {
      setPaymentAgreement(tmp);
    }
    // eslint-disable-next-line
  },[paymentAgreements]);

  useEffect(() => {
    if(Object.keys(paymentAgreement).length !== 0 && paymentAgreement.constructor === Object) {
      if(paymentAgreement['history'][0].length > 0) {
        Object.entries(paymentAgreement['history']).forEach((item, i) => {
          switch (item[0]) {
            case "0":
              setTimestampStartArr(item[1]);
              break;
            case "1":
              setTimestampEndArr(item[1]);
              break;
            case "2":
              setUnits(item[1]);
              break;
            case "3":
              setCosts(item[1]);
              break;
            default:
              break;
          }
        });
        let newHistory = [];
        for (let i = 0; i < costs.length; i++) {
          let tmp = {
            "timestampStart": timestampStartArr[i],
            "timestampEnd": timestampEndArr[i],
            "units": units[i],
            "costs": costs[i],
          };
          newHistory.push(tmp);
        }
        setHistory(newHistory);
        setTotalUnits(history.reduce((sum,record) => sum + parseInt(record['units']), 0));
        // setTotalCosts(history.reduce((sum,record) => sum + parseInt(record['costs']), 0));
        setTotalCosts(totalUnits * costs[0]);
      }


    }

    // eslint-disable-next-line
  },[paymentAgreement]);



  const onRedeem = async() => {
    let obj = JSON.parse(json);
    await redeem(obj.hash, obj.timestampStart, obj.timestampEnd, obj.units, obj.costs, obj.signature, obj.device );
    getPaymentAgreements(controller);
  }

  const [json, setJson] = useState(null);

  const handleHashInput = (event) => {
    setJson(event.target.value);
  }

  // const handleInputChange = event => {
  //   setValue(event.target.value === '' ? '' : Number(event.target.value));
  // };


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
               { ownIdentity['role'] == "1"?
                   <Fragment>
                     <Typography variant="h5">
                       {tenantName}
                     </Typography>
                     <Typography variant="overline" color="textSecondary">
                       Mieter: {tenant}
                     </Typography>
                   </Fragment>
                 : ownIdentity['role'] == "2"?
                   <Fragment>
                     <Typography variant="h5">
                       {lessorName}
                     </Typography>
                     <Typography variant="overline" color="textSecondary">
                       Hersteller: {lessor}
                     </Typography>
                   </Fragment>
                :
                  null
                }
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
                 <p>Kosten pro Einheit:<br/>~{(usageFee / 1000000000000000000 * ETH_EUR).toFixed(2)}€<br/>({(usageFee / 1000000000000000000).toFixed(4)}<br/>ETH)</p>
               </Typography>
               {parseInt(state) === 1 &&
                 <Fragment>
                   <Typography variant="caption" color="textSecondary">
                     <p>Kosten Gesamt:<br/>~{(totalCosts /1000000000000000000 * ETH_EUR).toFixed(2)}€<br/>({(totalCosts /1000000000000000000).toFixed(4)}<br/>ETH)</p>
                   </Typography>
                   <Typography variant="caption" color="textSecondary">
                     <p>Einheiten Gesamt:<br/>{paymentAgreement && totalUnits}</p>
                   </Typography>
                   <Typography variant="caption" color="textSecondary">
                     <p>Guthaben:<br/>~{(paymentAgreement['balance']/1000000000000000000 * ETH_EUR).toFixed(2)}€<br/>({(paymentAgreement['balance']/1000000000000000000).toFixed(4)}<br/>ETH)</p>
                   </Typography>
                 </Fragment>
               }
             </Container>
           </Grid>
         </Grid>
         <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
           <Grid item xs align="center">
                 {parseInt(state) === 0 && ownIdentity['role'] == "2"?
                 <Button onClick={onAccept} size="large" variant="outlined" color="primary">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Akzeptieren
                   </Typography>
                 </Button>
                   : null
                 }
                 {parseInt(state) === 1?
                   <Fragment>
                     <Button onClick={onTerminate} size="large" variant="outlined" color="secondary">
                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Beenden
                       </Typography>
                     </Button>
                     {parseInt(state) === 1 && ownIdentity['role'] == "2"?
                     <Fragment>
                       <Button onClick={onPay} size="large" variant="outlined" color="primary">
                         <Typography variant="body2" style={{ cursor: 'pointer' }}>
                          1 Kaffee Bezahlen
                         </Typography>
                       </Button>
                       <Button onClick={onCharge} size="large" variant="outlined" color="primary">
                         <Typography variant="body2" style={{ cursor: 'pointer' }}>
                          10€ Aufladen
                         </Typography>
                       </Button>
                     </Fragment>
                     : null
                     }
                     {parseInt(state) === 1 && ownIdentity['role'] == "1"?
                     <Fragment>
                       <TextField label="JSON" onChange={handleHashInput} onSubmit={onRedeem}/>
                       <Button onClick={onRedeem} size="large" variant="outlined" color="primary">Einlösen</Button>
                     </Fragment>
                     : null
                     }
                     <Button onClick={onToggleInvoice} size="large" variant="outlined" color="primary">
                       <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Rechnungen
                       </Typography>
                     </Button>
                    </Fragment>
                   : null
                 }
                 {/*{parseInt(state) === 2?
                 <Button size="large" variant="outlined" color="default">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Reaktivieren
                   </Typography>
                 </Button>
                   : null
                 }*/}
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
                        <TableCell>Zeitraum von</TableCell>
                        <TableCell>Zeitraum bis</TableCell>
                        <TableCell>Einheiten</TableCell>
                        <TableCell align="right">Summe</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        history.length > 0 && history.map((elem, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell size="small" align="left"><Moment unix format="DD.MM.YYYY HH:mm:ss">{elem['timestampStart']}</Moment></TableCell>
                              <TableCell size="small" align="left"><Moment unix format="DD.MM.YYYY HH:mm:ss">{elem['timestampEnd']}</Moment></TableCell>
                              <TableCell size="small" align="left">{elem['units']}</TableCell>
                              <TableCell size="small" align="right">~{(elem['costs'] * elem['units'] / 1000000000000000000 * ETH_EUR).toFixed(2)}€<br/>({(elem['costs'] * elem['units'] / 1000000000000000000).toFixed(4)}<br/>ETH)</TableCell>
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
