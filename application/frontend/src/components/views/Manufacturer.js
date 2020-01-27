import React, { useContext, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import RentalContext from './../../context/rental/rentalContext';


const Manufacturer = () => {

  const rentalContext = useContext(RentalContext);
  const { addTestRentalAgreements, setRentalAccount, getAgreements, resetRental } = rentalContext;

  const onCreateTest = () => {
    addTestRentalAgreements();
  }

  return (
    <Fragment>
      <p>Manufacturer</p>
      <Button onClick={onCreateTest}>
        Create Test
      </Button>
    </Fragment>
  );
};

export default Manufacturer;
