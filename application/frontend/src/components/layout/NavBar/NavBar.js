import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AuthContext from './../../../context/auth/authContext';
import IdentityContext from './../../../context/identity/identityContext';
import RentalContext from './../../../context/rental/rentalContext';
import RentalAgreementContainer from './../../RentalAgreement/RentalAgreementContainer';
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
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const authContext = useContext(AuthContext);
  const rentalContext = useContext(RentalContext);
  const identityContext = useContext(IdentityContext);
  const { setOwnIdentity, ownIdentity, resetIdentity } = identityContext;
  const { login, logout, authenticated, balance } = authContext;
  const { addTestRentalAgreements, setRentalAccount, getAgreements, resetRental } = rentalContext;



  const ethereum = window.ethereum;
  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.on('chainChanged', chainId => {
      if(authenticated) {
        reload();
      }
    })
    ethereum.on('networkChanged', () => {
      if(authenticated) {
        reload();
      }
    });
    ethereum.on('accountsChanged', () => {
      if(authenticated) {
        reload();
      }
    });
  }

  let history = useHistory();

  const onLogin = async() => {
    let newAccount = await login();
    await setOwnIdentity(newAccount);
    await setRentalAccount(newAccount);
    history.push("/overview");
  }

  const reload = () => {
    onLogout();
    onLogin();
  }

  const onLogout = () => {
    logout();
    resetIdentity();
    resetRental();
    history.push("/welcome");
  }

  const onCreateTest = () => {
    addTestRentalAgreements();
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
              </Button>
              <Typography variant="button" style={{marginLeft: 10}}>
                ETH: {balance}
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
