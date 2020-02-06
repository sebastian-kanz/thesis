import React, { useEffect } from 'react';

const Alerts = () => {

  const controller = { cancelled: false };
  useEffect(() => {

    return () => controller.cancelled = true;
  }, []);


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
