import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IdentityContext from './../../context/identity/identityContext';

const Profile = () => {
  const identityContext = useContext(IdentityContext);
  const { ownIdentity, authenticated } = identityContext;


  if(authenticated && ownIdentity) {
    return (
      <Container>
        <Paper>
          <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} align="center">
              <Typography variant="h5">
                Profileseite
              </Typography>
              <br/>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography variant="overline">
                Name
              </Typography>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography variant="overline">
                Addresse
              </Typography>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography variant="overline">
                Rolle
              </Typography>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography>
                {ownIdentity['name']}
              </Typography>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography>
                {ownIdentity['address']}
              </Typography>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography>
                { (function() {
                  switch (ownIdentity['role']) {
                    case '1':
                      return <span> Hersteller</span>
                    case '2':
                      return <span> Kunde</span>
                    case '3':
                      return <span> Service-Techniker</span>
                    case '4':
                      return <span> Lieferant</span>
                    default:
                      return <span> Unbekannt</span>
                  }

                })()}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <br/>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  } else {
    return null
  }
};

export default Profile;
