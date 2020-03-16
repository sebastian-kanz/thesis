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
        </Grid>
      </Paper>
    </Container>
  );
};

export default Welcome;
