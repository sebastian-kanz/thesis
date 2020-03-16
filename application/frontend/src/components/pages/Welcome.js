import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import WelcomeImage from '../../assets/images/Welcome.png';

const Welcome = () => {
  return (
    <Container>
      <Paper>
        <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
          <Grid item xs align="center" style={{padding: 20}}>
            <img src={WelcomeImage} alt="Welcome Image" width="100%"/>
          </Grid>
          <Grid item xs align="center" style={{padding: 20}}>
            <Typography variant="h5">Test Profile</Typography>
          </Grid>
          <Grid item xs align="left" style={{padding: 20}}>
            <Typography variant="body1">Hersteller: 7948B42D530C006BA9394F84945E0A816ABE55720690182A29313A5FB026C78D</Typography>
            <Typography variant="body1">Kunde: F1AAB763D40CB301BD17966EB96250C37A0716A1E88DE64CB60BA183F64A480A</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Welcome;
