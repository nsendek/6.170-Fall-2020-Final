const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const sleep = require("system-sleep");

let rowCount = 1;
const output = []
const headers = ['name', 'address', 'accountName', 'password', 'lat', 'lon']

/**
 * NEED THIS FILE TO:
 * 1. iterate the full OpenCambridge set of data, 
 * 2. convert addresses to exact addresses (zip, city, country) for google Maps
 * 3. add columns for accountName, password, lat, lon
 * 4. ignore uneeded columns (facebook, instagram, etc.)
 * 5. export out a new csv to use in postgres and SQLite
 */

/**
 * idk this is the only csv parser i could find for node
 * https://c2fo.io/fast-csv/docs/formatting/examples
 */
class CsvFile {
static write(filestream, rows, options) {
    return new Promise((res, rej) => {
        csv.writeToStream(filestream, rows, options)
            .on('error', err => rej(err))
            .on('finish', () => res());
    });
}

constructor(opts) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true };
}

create(rows) {
    return CsvFile.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts });
}

append(rows) {
    return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
        ...this.writeOpts,
        // dont write the headers when appending
        writeHeaders: false,
    });
}

read() {
    return new Promise((res, rej) => {
        fs.readFile(this.path, (err, contents) => {
            if (err) {
                return rej(err);
            }
            return res(contents);
        });
    });
}
}

const csvFile = new CsvFile({
path: path.resolve(__dirname, 'output.csv'),
headers,
});

// // 1. create the csv
async function writeDataToFile() {
  await csvFile
    .create(output)
    .then(() => csvFile.read())
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });  
  console.log("DONE");
}

async function processRowData(row) {
  sleep(1000); // sleeping between calls to prevent OVER_QUERY_LIMIT error in google API
  console.log("ROW: ",rowCount);

  // ignore lame businesses with no address or arbitrary "all locations"
  if (row.Address == "" || row.Address.toLowerCase().includes("location")) {
    return;
  }

  let out = {
    name : row.Name,
    address : row.Address,
    accountName : `b${rowCount}`,
    password : 'nvhj',
    lat : 0,
    lon : 0
  };

  rowCount += 1;

  let data = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", { 
      params : { 
          address : `${row.Address}, MA, USA`,
          key : "AIzaSyDKOlyw5FKzfofKtyQ5jfKFuleqelf1nhQ"
        }
    }).catch(err => err.response ? err.response : err)

  
  data = data.data

  try {
    out.address = data.results[0].formatted_address
    out.lat = data.results[0].geometry.location.lat
    out.lon = data.results[0].geometry.location.lng
  } catch (err) {
    console.log(err);
  }
  console.log(data);
  output.push(out);
}

function readDataFromFile() {
  fs.createReadStream(path.resolve(__dirname, 'OpenCambridgeFullSet.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', processRowData)
    .on('end', writeDataToFile);
    
}


readDataFromFile();
