const axios = require('axios');
const jsonxml = require('jsontoxml');
const express = require('express');
const router = express.Router();
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

const config = {
  headers: { referer: process.env.REFERER_1 },
};

// @route   GET api/csv/:sid
// @desc    Get CSV for Stock ID from morningstar
// @access  Public
router.get('/csv/:sid', async (req, res) => {
  const sid = req.params.sid;
  const url = process.env.CSV.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  // console.log(response.data);
  res.status(200).send(response.data);
});

// @route   GET api/finance/:sid
// @desc    Get FINANCIALS for Stock ID from morningstar
// @access  Public
router.get('/finance/:sid', async (req, res) => {
  const sid = req.params.sid;
  const url = process.env.FINANCE.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  let newData = response.data.replace('jsonp1593228161807(', '');
  newData = newData.substring(0, newData.length - 1);
  // console.log(newData);
  var xml = jsonxml(newData);
  res.status(200).send(xml);
});

// @route   GET api/keyratio/:sid
// @desc    Get KEY RATIOS for Stock ID from morningstar
// @access  Public
router.get('/keyratio/:sid', async (req, res) => {
  const sid = req.params.sid;
  const url = process.env.KEYRATIO.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  let newData = response.data.replace('jsonp1593233446296(', '');
  newData = newData.substring(0, newData.length - 1);
  newData = newData.replace(
    'id=\\"tab-growth\\" style=\\"display:none;\\"',
    'id=\\"tab-growth\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-cashflow\\" style=\\"display:none;\\"',
    'id=\\"tab-cashflow\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-financial\\" style=\\"display:none;\\"',
    'id=\\"tab-financial\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-efficiency\\" style=\\"display:none;\\"',
    'id=\\"tab-efficiency\\" style=\\"display:block;\\"'
  );
  // console.log(newData);
  var xml = jsonxml(newData);
  res.status(200).send(xml);
});

// @route   GET api/valuation/:sid
// @desc    Get VALUATION for Stock ID from morningstar
// @access  Public
router.get('/valuation/:sid', async (req, res) => {
  config.headers.referer = process.env.REFERER_2;
  config.headers.apikey = process.env.APIKEY;

  const sid = req.params.sid;
  const url = process.env.VALUATION.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  response.data.Collapsed.userType = {};
  let array1 = response.data.Collapsed.rows;
  let array2 = response.data.Expanded.rows;
  let array0 = [...array1, ...array2];
  //console.log(array0);
  let row = '';
  array0.forEach((item, i) => {
    let label = item.salDataId.split('.').join('-');
    let value = item.datum;
    row += `<tr id="${label}">
    <td headers="Y${i} i0">${item.datum[0]}</td>
    <td headers="Y${i} i1">${item.datum[1]}</td>
    <td headers="Y${i} i2">${item.datum[2]}</td>
    <td headers="Y${i} i3">${item.datum[3]}</td>
    <td headers="Y${i} i4">${item.datum[4]}</td>
    <td headers="Y${i} i5">${item.datum[5]}</td>
    <td headers="Y${i} i6">${item.datum[6]}</td>
    <td headers="Y${i} i7">${item.datum[7]}</td>
    <td headers="Y${i} i8">${item.datum[8]}</td>
    <td headers="Y${i} i9">${item.datum[9]}</td>
    <td headers="Y${i} i10">${item.datum[10]}</td>
    <td headers="Y${i} i11">${item.datum[11]}</td>
    <td headers="Y${i} i12">${item.datum[12]}</td>
    </tr>`;
  });
  // console.log(row);

  res.status(200).send(row);
});

// @route   GET api/cashflow/:sid
// @desc    Get CASHFLOW for Stock ID from morningstar
// @access  Public
router.get('/cashflow/:sid', async (req, res) => {
  config.headers.referer = process.env.REFERER_2;
  config.headers.apikey = process.env.APIKEY;

  const sid = req.params.sid;
  const url = process.env.CASHFLOW.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  let array = response.data.rows[0].subLevel;
  // console.log(array);
  let row = '';
  array.forEach((item, i) => {
    let label = item.label.split(' ').join('-');
    let value = item.datum;
    row += `<tr id="${label}">
    <td headers="Y${i} i0">${item.datum[0]}</td>
    <td headers="Y${i} i1">${item.datum[1]}</td>
    <td headers="Y${i} i2">${item.datum[2]}</td>
    <td headers="Y${i} i3">${item.datum[3]}</td>
    <td headers="Y${i} i4">${item.datum[4]}</td>
    <td headers="Y${i} i5">${item.datum[5]}</td>
    <td headers="Y${i} i6">${item.datum[6]}</td>
    <td headers="Y${i} i7">${item.datum[7]}</td>
    <td headers="Y${i} i8">${item.datum[8]}</td>
    <td headers="Y${i} i9">${item.datum[9]}</td>
    <td headers="Y${i} i10">${item.datum[10]}</td>
    </tr>`;
  });
  //console.log(row);

  res.status(200).send(row);
});

// @route   GET api/fcf/:sid
// @desc    Get FCF for Stock ID from morningstar
// @access  Public
// @return  "EXPAND","SHRINK","NOTPASS" for FCF short, medium, long terms status
router.get('/fcf/:sid', async (req, res) => {
  const sid = req.params.sid;
  const url = process.env.KEYRATIO.replace('xxxxxx', sid);

  let response = await axios.get(url, config);
  let newData = response.data.replace('jsonp1593233446296(', '');
  newData = newData.substring(0, newData.length - 1);
  newData = newData.replace(
    'id=\\"tab-growth\\" style=\\"display:none;\\"',
    'id=\\"tab-growth\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-cashflow\\" style=\\"display:none;\\"',
    'id=\\"tab-cashflow\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-financial\\" style=\\"display:none;\\"',
    'id=\\"tab-financial\\" style=\\"display:block;\\"'
  );
  newData = newData.replace(
    'id=\\"tab-efficiency\\" style=\\"display:none;\\"',
    'id=\\"tab-efficiency\\" style=\\"display:block;\\"'
  );
  // console.log(newData);
  let xml = jsonxml(newData);
  //var xml = '<book><title>Harry Potter</title></book>';
  let xmlDoc = new dom({
    errorHandler: {
      warning: (msg) => {},
      error: (msg) => {},
      fatalError: (msg) => {},
    },
  }).parseFromString(xml, 'text/xml');
  // console.log(xmlDoc);
  //var test = xpath.select('//td[@headers="cf-Y0 cf-cashflow i41"]', xmlDoc);

  let arrFCF = xpath.select(
    '//td[contains(@headers,"cf-cashflow i41")]',
    xmlDoc
  );
  // console.log(arrFCF.length);
  // console.log(arrFCF[0].localName + ': ' + arrFCF[0].firstChild.data);
  // console.log('Node: ' + arrFCF[0].toString());

  let status = 'NOTPASS';
  let countPositive = 0;
  let row = '';
  try {
    arrFCF.forEach((item, index) => {
      // CANNNOT HAVE "—"
      if (item.firstChild.data === '—' || isNaN(item.firstChild.data)) {
        throw BreakException;
      }
      // ATLEAST 5 YRS IS POSITIVE VALUE
      if (item.firstChild.data > 0) {
        countPositive++;
      }
    });
  } catch (error) {}

  if (countPositive >= 5) {
    status = 'PASS';

    // DETERMINE EXPAND OR SHRINK
    let len = arrFCF.length - 1;
    if (
      parseFloat(arrFCF[len - 1].firstChild.data) >
      parseFloat(arrFCF[len - 4].firstChild.data)
    ) {
      row += '<td id="s">S-EXPAND</td>';
    } else if (
      parseFloat(arrFCF[len - 1].firstChild.data) <
      parseFloat(arrFCF[len - 4].firstChild.data)
    ) {
      row += '<td id="s">S-SHRINK</td>';
    }
    if (
      parseFloat(arrFCF[len - 1].firstChild.data) >
      parseFloat(arrFCF[len - 7].firstChild.data)
    ) {
      row += '<td id="m">M-EXPAND</td>';
    } else if (
      parseFloat(arrFCF[len - 1].firstChild.data) <
      parseFloat(arrFCF[len - 7].firstChild.data)
    ) {
      row += '<td id="m">M-SHRINK</td>';
    }
    if (
      parseFloat(arrFCF[len - 1].firstChild.data) >
      parseFloat(arrFCF[len - 10].firstChild.data)
    ) {
      row += '<td id="l">L-EXPAND</td>';
    } else if (
      parseFloat(arrFCF[len - 1].firstChild.data) <
      parseFloat(arrFCF[len - 10].firstChild.data)
    ) {
      row += '<td id="l">L-SHRINK</td>';
    }

    row = '<tr>' + row + '</tr>';
  }

  // console.log(row);
  res.status(200).send(row);
});

module.exports = router;
