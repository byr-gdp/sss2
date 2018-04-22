const fs = require('fs');
const path = require('path');

/**
 * 根据相对路径，返回相对于服务所在目录（process.cwd()）的绝对路径下的文件结构
 * 若路径不存在，fs.lstatSync 发生错误，返回如下结构:
 * {
 *    "type": "error"
 * }
 * 若路径存在，且是目录，返回结构如下：
 * {
 *    "type": "directory",
 *    "data": [
 *      "name": "",
 *      "path": "",
 *      "isDirectory": true/false // 目前暂时没用到
 *    ]
 * }
 * 若路径存在，且是文件，返回结构如下：
 * {
 *    "name": "file",
 *    "fileName": "",
 *    "fileContent": "" // 文件内容预览用，需要解决编码问题，同时二进制文件无解...
 * }
 * @param {String} relativePath 相对于服务当前目录德的路径
 */
const tree = (relativePath) => {
  const rootPath = process.cwd();
  const absolutePath = path.resolve(rootPath, relativePath);
  const treeData = {};
  let absolutePathStat;

  try {
    absolutePathStat = fs.lstatSync(absolutePath);
  } catch (e) {
    treeData.type = 'error';
    return treeData;
  }

  if (!absolutePathStat.isDirectory()) {
    treeData.type = 'file';
    treeData.fileName = _getFileNameByRelativePath(relativePath);
    treeData.fileContent = fs.readFileSync(relativePath, {
      encoding: 'utf8'
    });
  } else {
    const array = fs.readdirSync(absolutePath);
    /**
       * 默认添加当前目录和上级目录路由
       * 结构如下：
      {
        path: '/foo',
        name: '/foo',
        isDirectory: false,
      }
       */

    const data = [
      {
        name: '.',
        path: './',
        isDirectory: true
      }, {
        name: '..',
        path: '../',
        isDirectory: true
      }
    ];

    array.forEach((item) => {
      const itemPath = path.resolve(absolutePath, item);
      const stat = fs.lstatSync(itemPath);

      data.push({
        name: item,
        path: path.relative(rootPath, path.resolve(relativePath, itemPath)),
        isDirectory: stat.isDirectory()
      });
    });

    treeData.type = 'directory';
    treeData.data = data;
  }
  return treeData;
}

const _getFileNameByRelativePath = (relativePath = '/') => {
  const lastIndex = relativePath.lastIndexOf('/');
  return relativePath.slice(lastIndex + 1);
}

module.exports = exports = tree;
