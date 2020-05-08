'use strict';

const fs = require('fs');
const path = require('path');
let key = 0;

const DirTree = (filename = 'client') => {
  const stats = fs.lstatSync(filename);

  let info = {
    path: filename,
    title: path.basename(filename),
    key: key++
  };

  if (stats.isDirectory()) {
    info.isLeaf = false;
    info.children = fs.readdirSync(filename).map(child => {
      return DirTree(filename + '/' + child);
    });
  } else {
    info.isLeaf = true;
  }

  return info;
}

module.exports = DirTree;