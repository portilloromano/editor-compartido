import React, { useState } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';

const ModalSearchSelect = ({ buttonText, title, data, selected, changeFunction }) => {
  let tmpSelected = selected;

  const [state, setState] = useState(
    {
      loading: false,
      visible: false,
    }
  );

  const [rowSelected, setRowSelected] = useState(
    {
      name: selected.name,
      value: selected.value
    });

  const { loading, visible } = state;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
  ];

  const dataProcessed = data.map((item, index) => ({ key: item.value, name: item.name }));

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      tmpSelected = {
        name: selectedRows[0].name,
        value: selectedRows[0].key
      };
    }
  };

  const showModal = () => {
    setState({
      visible: true,
    });
  };

  const handleOk = () => {
    setState({ loading: true });
    setTimeout(() => {
      setState({ loading: false, visible: false });
    }, 3000);
    setRowSelected({
      name: tmpSelected.name,
      value: tmpSelected.value
    });
    changeFunction(tmpSelected.name, tmpSelected.value);
  };

  const handleCancel = () => {
    setState({ visible: false });
    tmpSelected = rowSelected;
  };

  return (
    <div>
      <Tooltip placement="topRight" title={title}>
        <Button type="primary" onClick={showModal}>
          {buttonText}
        </Button>
      </Tooltip>
      <Modal
        visible={visible}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Select
          </Button>,
        ]}
      >
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataProcessed}
          pagination={false}
          showHeader={false}
          scroll={{ y: 200 }}
        />
      </Modal>
    </div>
  );
}

export default ModalSearchSelect;