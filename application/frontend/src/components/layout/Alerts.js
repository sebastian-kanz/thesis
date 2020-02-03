import React from 'react';

const Alerts = () => {

  let test = [];

  return (
    test.length > 0 &&
    test.map(alert => (
      <div key={alert.id}>
        {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
