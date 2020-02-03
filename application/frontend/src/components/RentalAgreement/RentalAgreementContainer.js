import React, {Fragment, useEffect, useContext } from 'react';
import RentalAgreement from './RentalAgreement';
import RentalContext from './../../context/rental/rentalContext';
import AuthContext from './../../context/auth/authContext';
import IdentityContext from './../../context/identity/identityContext';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';



const RentalAgreementContainer = ({state}) => {

  const rentalContext = useContext(RentalContext);
  const authContext = useContext(AuthContext);
  const identityContext = useContext(IdentityContext);
  const { getAgreements, rentalAgreements, account } = rentalContext;
  const { authenticated } = authContext;
  const { addIdentities, identities } = identityContext;


  useEffect(() => {
    getAgreements();
    // eslint-disable-next-line
  },[authenticated,account]);

  useEffect(() => {
    addRentalIdentities();
    // eslint-disable-next-line
  },[rentalAgreements]);

  const addRentalIdentities = async() => {
    let allIdentities = [];
    for( const agreement of rentalAgreements)  {
      //add device
      allIdentities.push(agreement[0]);
      //add lessor
      allIdentities.push(agreement[2]);
      //add device
      allIdentities.push(agreement[4]);
    }
    addIdentities(allIdentities);
  }

  let filteredAgreements = rentalAgreements.filter((agreement) => {return agreement[8] == state});

  return(
    <Fragment>
      {
        identities.length > 1 && filteredAgreements &&
        filteredAgreements.map((item, i) => {
            return <RentalAgreement key={i} agreement={item}/>
        })
      }
      {
        filteredAgreements.length === 0 &&
        <Container fixed style={{marginTop: 40}}>
          <Paper>
            <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
               <Grid item xs={12} align="center">
                 <Container>
                   <Typography>Sie haben keine Mietverträge in diesem Status.</Typography>
                 </Container>
               </Grid>
             </Grid>
           </Paper>
         </Container>
      }
    </Fragment>
  );
}

export default RentalAgreementContainer;
