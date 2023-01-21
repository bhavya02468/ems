/**
 * @author author name
 */

//Load dependecies
const XLSX = require('xlsx');

const uploadDeleteToS3 = require('./uploadDeleteToS3');


module.exports = {


  //read xlsx file and parse data, columns wise
  readAndParseXLSX: function ParseData(params) {
    if (params && params.file && params.file.path) {
      try {
        // console.log(file, 'dsd');
        let workbook = XLSX.readFile(params.file.path);
        let sheet_name_list = workbook.SheetNames;
        let finalData = [], totalSheets = 0;
        sheet_name_list.forEach(function (y) {
          // console.log(y, 'y');
          if (totalSheets == 0) {
            let worksheet = workbook.Sheets[y];
            let headers = {};
            let data = [];
            for (z in worksheet) {
              if (z[0] === '!') continue;
              //parse out the column, row, and value
              let tt = 0;
              for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                  tt = i;
                  break;
                }
              };
              let col = z.substring(0, tt);
              let row = parseInt(z.substring(tt));
              let value = worksheet[z].v;

              //store header names
              if (row == 1 && value) {
                headers[col] = value;
                continue;
              }
              if (!data[row]) data[row] = {};
              data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
            let allData = [];
            // console.log(data[0].jobTitles, data[1], headers);
            Object.keys(headers).forEach((key, index) => {
              for (let k = 0; k < data.length; k++) {
                // console.log(key, 'index', index, headers[key], data[k]);
                // console.log(data[k][headers[key]])
                // console.log(headers[key], data[k])
                if (data[k]) {
                  let insideData = [];
                  Object.keys(data[k]).forEach((key1, index1) => {
                    if (headers[key] === key1) {
                      // console.log(key1, 'dffff', headers[key],  'index1', data[k][key1])
                      insideData.push(data[k][key1])
                    }
                  })
                  let isFound = false;
                  for (let l = 0; l < allData.length; l++) {
                    if (allData[l].header == headers[key]) {
                      isFound = true;
                      allData[l].columns.push.apply(allData[l].columns, insideData);
                      break;
                    }
                  }
                  if (!isFound) {
                    allData.push({ header: headers[key], columns: insideData });
                  }
                  else if (allData.length <= 0) {
                    allData.push({ header: headers[key], columns: insideData });
                    // console.log("ddddddddd", allData);
                  }
                }
              }
            });
            if (allData.length > 0) {
              finalData.push({
                sheet: y,
                data: allData
              })
            }
            totalSheets++;
          } else {
            //do nothing, just proceed
            // console.log("do nothing just proceed");
          }
          // console.log(worksheet, 'worksheet');
        });
        uploadDeleteToS3.__deleteTempFile(params.file.path);
        return finalData;
      } catch (ex) {
        // console.log(ex, 'ex');
        uploadDeleteToS3.__deleteTempFile(params.file.path);
        return [];
      }
    } else {
      return [];
    }
  },

  //read xlsx file and parse data, rows wise
  readAndParseXLSX1: function ParseData1(params) {
    if (params && params.file && params.file.path) {
      try {
        // console.log(file, 'dsd');
        let workbook = XLSX.readFile(params.file.path);
        let sheet_name_list = workbook.SheetNames;
        let finalData = [], totalSheets = 0;
        sheet_name_list.forEach(function (y) {
          if (totalSheets == 0) {
            // console.log(y, 'y');
            let worksheet = workbook.Sheets[y];
            let headers = {};
            let data = [];
            for (z in worksheet) {
              if (z[0] === '!') continue;
              //parse out the column, row, and value
              let tt = 0;
              for (let i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                  tt = i;
                  break;
                }
              };
              let col = z.substring(0, tt);
              let row = parseInt(z.substring(tt));
              let value = worksheet[z].v;

              //store header names
              if (row == 1 && value) {
                headers[col] = value;
                continue;
              }
              if (!data[row]) data[row] = {};
              data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
            finalData = data;
          } else {
            //do nothing
          }
        });
        console.log(finalData, 'finalData')
        uploadDeleteToS3.__deleteTempFile(params.file.path);
        return finalData;
      } catch (ex) {
        // console.log(ex, 'ex');
        uploadDeleteToS3.__deleteTempFile(params.file.path);
        return [];
      }
    } else {
      return [];
    }
  }


}
