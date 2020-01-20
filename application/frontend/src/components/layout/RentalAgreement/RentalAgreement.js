import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';



export default function RentalAgreement({ contractState })  {


  return (
    <Container fixed>
      <Paper>
        <Grid container spacing={2}>
          <p></p>
        </Grid>
        <Grid container spacing={2}>
           <Grid item xs={2}>
             <Grid container spacing={2}>
               <Grid item xs={12}>
                   {contractState === "Pending"?
                     <HourglassEmptyIcon style={{fontSize: 50}}/> : null
                   }
                   {contractState === "Active"?
                     <CheckIcon style={{fontSize: 50}}/> : null
                   }
                   {contractState === "Terminated"?
                     <IndeterminateCheckBoxIcon style={{fontSize: 50}}/> : null
                   }
               </Grid>
               <Grid item xs={12}>
                 <Typography variant="caption" color="textSecondary">
                   <p>Vertragsbeginn:<br/>10.01.2020</p>
                 </Typography>
                 <Typography variant="caption" color="textSecondary">
                   <p>Gültig bis:<br/>31.12.2020</p>
                 </Typography>
               </Grid>
             </Grid>
           </Grid>
           <Grid item xs={8}>
             <Grid container spacing={2}>
               <Grid item xs={12} align="left">
                 <Typography variant="h4">
                   Kaffeemaschine 123
                 </Typography>
                 <Typography variant="overline" color="textSecondary">
                   Adresse: 0xF2fE5097D51e81d1Eb696ac8668F28fC6E2Ee4ff
                 </Typography>
                 <br/>
                 <br/>
                 <Typography variant="h5">
                   Miele GmbH
                 </Typography>
                 <Typography variant="overline" color="textSecondary">
                   Addresse: 0x35aaec18440965BF72149f38F6078D98ccD3aC8f
                 </Typography>
                 <br/>
                 <br/>
                 <Typography variant="h5">
                   ServiceProviderABC GmbH
                 </Typography>
                 <Typography variant="overline" color="textSecondary">
                   Addresse: 0x088c183aD514B19dE490832C7b442b339576c95F
                 </Typography>
                 <br/>
                 <br/>
                 <Typography variant="h5">
                   Lieferant123 GmbH
                 </Typography>
                 <Typography variant="overline" color="textSecondary">
                   Addresse: 0x3972741f41256d705403e27a3d7B91C9e3ADAC84
                 </Typography>
               </Grid>
             </Grid>
           </Grid>
           <Grid item xs={2}>
             <Grid container spacing={2}>
               <Grid item>
                 <Typography variant="caption" color="textSecondary">
                   <p>Kosten pro Einheit:<br/>0.1€<br/>(0.00066 Ether)</p>
                 </Typography>
                 <Typography variant="caption" color="textSecondary">
                   <p>Kosten Gesamt:<br/>0.2€<br/>(0.00132 Ether)</p>
                 </Typography>
                 <Typography variant="caption" color="textSecondary">
                   <p>Einheiten Gesamt:<br/>2</p>
                 </Typography>
               </Grid>
             </Grid>
           </Grid>
         </Grid>
         <Grid container spacing={2}>
           <Grid item xs>

                 {contractState === "Pending"?
                 <Button size="large" variant="outlined" color="primary">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Akzeptieren
                   </Typography>
                 </Button>
                   : null
                 }
                 {contractState === "Active"?
                 <Button size="large" variant="outlined" color="secondary">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Beenden
                   </Typography>
                 </Button>
                   : null
                 }
                 {contractState === "Terminated"?
                 <Button size="large" variant="outlined" color="default">
                   <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Reaktivieren
                   </Typography>
                 </Button>
                   : null
                 }
           </Grid>
         </Grid>
        </Paper>
     </Container>
   );
}
