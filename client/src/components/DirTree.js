import React, { useEffect, useState } from 'react';
import { Tree, Button } from 'antd';
import axios from 'axios';
import GLOBAL from '../global';

const { DirectoryTree } = Tree;

const DirTree = () => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    axios.get(`${GLOBAL.server}/filemanagment/dirtree`)
      .then(res => {
        setTreeData([res.data]);
      });
  }, []);

  const onSelect = (keys, event) => {
    if (event.node.isLeaf) {
      // axios.post(`${GLOBAL.server}/filemanagment/readfile`, {
      //   path: event.node.path
      // })
      //   .then(res => {
      //     console.log(res);
      //   });
    }
  };

  return (
    <div>
      {treeData === [] ?
        <Button>Open folder</Button> :
        <DirectoryTree
          multiple
          defaultExpandAll
          onSelect={onSelect}
          treeData={treeData}
        />
      }
    </div>
  );
}

export default DirTree;