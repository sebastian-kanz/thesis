import React, { useContext, useEffect, Fragment } from 'react';
import RentalContext from './../../context/rental/rentalContext';
import IdentityContext from './../../context/identity/identityContext';
import Request from './Request';
import { isNullOrUndefined } from "util";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';




const Requests = () => {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);

  const { getRequests, requests } = rentalContext;
  const { ownIdentity, addIdentities } = identityContext;

  useEffect(() => {
    getRequests(ownIdentity['role'], controller);
    // eslint-disable-next-line
  },[]);

  let rentalRequests = [];
  let tenants = [];
  let lessors = [];
  let devices = [];
  let terms = [];

  Object.entries(requests).forEach((item, i) => {
    switch (item[0]) {
      case "0":
        tenants = item[1];
        break;
      case "1":
        lessors = item[1];
        break;
      case "2":
        devices = item[1];
        break;
      case "3":
        terms = item[1];
        break;
      default:
        break;
    }
  });

  // addIdentities(tenants);

  for (let i = 0; i < lessors.length; i++) {
    rentalRequests[i] = {
      "tenant": tenants[i],
      "lessor": lessors[i],
      "device": devices[i],
      "term": terms[i],
    };
  }

  return(
    <Fragment>
    {
      requests && rentalRequests.map((elem, i) => {
        return <Request key={i} request={elem}/>
      })
    }
    {
      rentalRequests.length === 0 &&
      <Container fixed style={{marginTop: 40}}>
        <Paper>
          <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
             <Grid item xs={12} align="center">
               <Container>
                 <Typography>Sie haben keine Mietantäge.</Typography>
               </Container>
             </Grid>
           </Grid>
         </Paper>
       </Container>
    }
    </Fragment>
  );
}


export default Requests;
