import React from 'react';
import { Result } from 'antd';

const JoinRejected = () => (
  <Result
    status="error"
    title="Reject"
    subTitle="Your request has been rejected."
  />
);

export default JoinRejected;