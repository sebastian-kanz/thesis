import React, { useContext } from 'react';

const Alerts = () => {

  let test = [];

  return (
    test.length > 0 &&
    test.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i className='fas fa-info-circle' /> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
