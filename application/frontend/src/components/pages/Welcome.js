import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const Welcome = () => {
  return (
    <Container>
      <Paper>
        <Grid container justify="center" alignContent="center" alignItems="center" spacing={2}>
          <Grid item xs align="center" style={{padding: 20}}>
            <Typography variant="h4">
              Willkommen. Bitte melde dich an, um auf deine Mietgeräte, Verträge und Abrechnungen zugreifen zu können.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Welcome;
