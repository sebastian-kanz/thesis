import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AuthContext from './../../context/auth/authContext';
import IdentityContext from './../../context/identity/identityContext';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const identityContext = useContext(IdentityContext);
  const { authenticated } = authContext;
  const { ownIdentity } = identityContext;


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
                      break;
                    case '2':
                      return <span> Kunde</span>
                      break;
                    case '3':
                      return <span> Service-Techniker</span>
                      break;
                    case '4':
                      return <span> Lieferant</span>
                      break;
                    default:
                      return <span> Unbekannt</span>
                      break;

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
