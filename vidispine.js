var rp = require('request-promise');
var Table = require('cli-table');
var chalk = require('chalk');
var numeral = require('numeral');

const STORAGE_URL = 'API/storage';
const STORAGE_FILE_URL = 'file?count=true';
const STORAGE_IMPORTABLE_URL = 'importable?count=true';

var vidispine = {};

var limit = 0;
var index = 1;

var env = {};
var globalOptions = {
  json: true,
  auth: {
    user: 'admin',
    pass: 'admin'
  }
};

var table = new Table({
  head: ['StorageId', 'Capacity (GB)', 'Used (GB)', 'Type', 'Name', 'Files', 'Importables'],
});

vidispine.checkStorages = function(environment) {
  env = environment;
  globalOptions.url = `${env.host}/${STORAGE_URL}`;

  rp(globalOptions)
  .then(setStorages)
  .then(getStoragesFiles)
  .catch(function (err) {
    console.log(err);
  });
};

function setStorages(response) {
  var storages = response.storage;
  return storages;
}

function getStoragesFiles(storages) {
  limit = storages.length;
  storages.forEach(function(storage) {
    getStorageFiles(storage);
  });
}

function getStorageFiles(storage) {
  var options = globalOptions;
  options.url = `${env.host}/${STORAGE_URL}/${storage.id}/${STORAGE_FILE_URL}`;
  
  var method = getStorageMethod(storage);
  var capacity = numeral(storage.capacity).format('0.00 b');
  var used = numeral(storage.capacity - storage.freeCapacity).format('0.000 b');
  
  rp(options)
  .then(function(res) {
    var files = numeral(res.hits).format('0,0');

    options.url =`${env.host}/${STORAGE_URL}/${storage.id}/${STORAGE_IMPORTABLE_URL}`,

    rp(options)
    .then(function(res) {
      var importables = numeral(res.hits).format('0,0');
      table.push([storage.id, capacity, used, method.type, method.name, files, importables]);

      index++;

      if (index === limit) {
       getTotals();
     }
   });
  });
}

function getTotals() {
  globalOptions.url = `${env.host}/${STORAGE_URL}/${STORAGE_FILE_URL}`;

  rp(globalOptions)
  .then(function(res) {
    var files = numeral(res.hits).format('0,0');
    
    globalOptions.url = `${env.host}/${STORAGE_URL}/${STORAGE_IMPORTABLE_URL}`;

    rp(globalOptions)
    .then(function(res) {
      var importables = numeral(res.hits).format('0,0');
      
      table.sort(function(a, b) {
        return a > b;
      });
    
      table.push(['', '', '', '', '', 'Total Importable', importables]);
      table.push(['', '', '', '', '', 'Total Files', files]);
      
      console.log(table.toString());
    });

  })
  .catch(function (err) {
    console.log(err);
  });
}

function getStorageMethod(storage) {
  var method = {};

  if (!storage || !storage.method || !storage.method.length) {
    method.type = 'N/A';
    method.name = 'N/A';
    return method;
  }
  
  var url = storage.method[0].uri.toLowerCase();
  
  var name = url.split('=@')[1];
  //method.name = 'bucket-' + storage.id.split('-')[2];
  method.name = name.substring(0, name.length -1);
  
  if (url.indexOf('s3://') !== -1) {
    method.type = 'S3';
  } 
  if (url.indexOf('azure://') !== -1) {
    method.type = 'S3';
  } 
  else {
    method.tpye = 'Unknown';
  }

  return method;
}

function parseGb(bytes) {
  var gb = bytes / 1073741824;
  return Math.round(gb, 2);
}

module.exports = vidispine;