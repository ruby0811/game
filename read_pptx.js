const officeParser = require('officeparser');

officeParser.parseOfficeAsync('c:\\Workstation\\game\\게임 장르의 이해.pptx')
  .then(data => console.log(data))
  .catch(err => console.log(err));
