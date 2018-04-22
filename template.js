/**
 * 根据 tree.js 返回的数据生成 HTML 模板
 */
const generateTemplate = (data) => {
  if (data.type === 'error') {
    return `<h1>file or directory not found</h1>`;
  } else if (data.type === 'file') {
    return `
    <h1>file found</h1>
    <h2>fileName: ${data.fileName} <a href='?download=true'>下载</a></h2>
    <h2>fileContent:</h2>
    ${data.fileContent.split('\n').map(el => {
      return `<p>${el}</p>`
    }).join('\n')}
    `;
  } else {
    return `
    <h1>directory found</h1>
    <ul>
      ${data.data.map(item => {
        return `<li><a href='${item.path}'>${item.name}</a></li>`;
      }).join('')}
    </ul>
    `;
  }
}

module.exports = exports = generateTemplate;