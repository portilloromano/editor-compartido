import React from 'react';
import { Result } from 'antd';

const InvalidConnection = () => (
  <Result
    status="error"
    title="Failed Connection"
    subTitle="Verify the link is correct or the session has not expired."
  />
);

export default InvalidConnection;