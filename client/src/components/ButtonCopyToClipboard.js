import React, { Fragment } from 'react';
import { Button, Tooltip, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';

const ButtonCopyToClipboard = ({ tooltip, buttonText, textToCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        message.success('Copied to clipboard.');
      })
      .catch(() => {
        message.error('Copy to clipboard failed.');
      });
  }

  return (
    <Fragment>
      <Tooltip title={tooltip}>
        <Button
          icon={<ShareAltOutlined />}
          onClick={handleCopy}
          block
        >
          {buttonText}
        </Button>
      </Tooltip >
    </Fragment>
  );
};

export default ButtonCopyToClipboard;