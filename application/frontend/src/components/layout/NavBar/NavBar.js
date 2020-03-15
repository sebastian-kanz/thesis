import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import IdentityContext from './../../../context/identity/identityContext';
import RentalContext from './../../../context/rental/rentalContext';
import PaymentContext from './../../../context/payment/paymentContext';
import MenuDefault from './MenuList/MenuDefault';
import MenuCustomer from './MenuList/MenuCustomer';
import MenuManufacturer from './MenuList/MenuManufacturer';
import MenuServiceProvider from './MenuList/MenuServiceProvider';
import MenuSupplier from './MenuList/MenuSupplier';
import { useHistory } from "react-router-dom";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Bar() {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);


  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const paymentContext = useContext(PaymentContext);
  const { login, logout, authenticated, balance, ownIdentity, getKnownDevices, getKnownManufacturers, getKnownServiceProviders, getKnownSuppliers } = identityContext;
  const { setRentalAccount, resetRental } = rentalContext;
  const { setPaymentAccount } = paymentContext;


  const ethereum = window.ethereum;
  if (!window.ethereum) {
    console.log("Install Metamask!");
  }
  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.on('chainChanged', chainId => {
      if(authenticated && ownIdentity) {
        console.log("chainChanged");
        onAccountChanged();
      }
    }, () => {
      ethereum.removeAllListeners();
    });
    ethereum.on('networkChanged', () => {
      if(authenticated && ownIdentity) {
        console.log("networkChanged");
        onAccountChanged();
      }
    }, () => {
      ethereum.removeAllListeners();
    });
    ethereum.on('accountsChanged', () => {
      if(authenticated && ownIdentity) {
        console.log("accountsChanged");
        onAccountChanged();
      }
    }, () => {
      ethereum.removeAllListeners();
    });
  }

  let history = useHistory();

  const onLogin = async() => {
    // let account = (await window.ethereum.enable())[0];
    // console.log(account);
    // await setOwnIdentity(account);
    // let newAccount = await login();
    // await getKnownDevices(controller);
    // await getKnownManufacturers(controller);
    // await getKnownServiceProviders(controller);
    // await getKnownSuppliers(controller);
    // await setRentalAccount(newAccount);
    // await setPaymentAccount(newAccount);

    let newAccount = await login();
    await setRentalAccount(newAccount);
    await setPaymentAccount(newAccount);
    await getKnownDevices(controller);
    await getKnownManufacturers(controller);
    await getKnownServiceProviders(controller);
    await getKnownSuppliers(controller);
    history.push("/overview");
  }

  const onAccountChanged = async() => {
    await onLogout();
  }


  const onLogout = () => {
    logout();
    resetRental();
    //resetPayment();
    window.location.assign('/welcome');
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{flexGrow: 1}}>
            Geräte-Verleih (Pay-As-You-Use)
          </Typography>
          { authenticated && ownIdentity ?
            <div>
              <Button
                color="inherit"
                startIcon={<ExitToAppIcon/>}
                onClick={onLogout}
              >
                Logout
              </Button>
              <Button
                color="inherit"
                startIcon={<PersonIcon/>}
                onClick={() => history.push('/profile')}
                aria-controls="simple-menu" aria-haspopup="true"
              >
                {ownIdentity['name']}
                {/*ownIdentity['name'] is empty on login!?!?!?*/}
              </Button>
              <Typography variant="button" style={{marginLeft: 10}}>
                ETH: {balance && balance}
              </Typography>
            </div>
            :
            <Button
              color="inherit"
              startIcon={<LockOpenIcon/>}
              onClick={onLogin}
            >
              Login
            </Button>
          }
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
          {authenticated && ownIdentity && (function() {
            switch (ownIdentity['role']) {
              case '1':
                return <MenuManufacturer/>
              case '2':
                return <MenuCustomer/>
              case '3':
                return <MenuServiceProvider/>
              case '4':
                return <MenuSupplier/>
              default:
                return null;
            }
          })()}
          { !authenticated && !ownIdentity &&
            <MenuDefault/>
          }
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {/*  */}
      </main>
    </div>
  );
}
