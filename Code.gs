//Returns true if the passed value is an array.
function isArray(array)
{
  return Array.isArray(array);
}

//Returns true if the pased value is an object and is not null.
function isObject(object)
{
  return (typeof(object) === 'object' && object !== null);
}

//Returns true if the passed value is undefined.
function isUndefined(value)
{
  return (typeof(value) === 'undefined');
}

//Gets all of the sheet names in the current spreadsheet
function getSheetNames()
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var sheetNames = new Array();
  
  for(var i=0; i < sheets.length; i++)
  {
    sheetNames.push(sheets[i].getName());
  }
  
  return sheetNames;
}

//Gets the active sheet name in the current spreadsheet
function getActiveSheetName()
{
  var spreadsheet = SpreadsheetApp.getActive();
  
  return spreadsheet.getActiveSheet().getName();
}

// Escape HTML special characters for showing text in a textarea
function escapeHtml(content)
{
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



function getOAuthToken()
{
  return ScriptApp.getOAuthToken();
}


function onInstall(e)
{
  onOpen(e);
}

function CheckDecimal(inputtxt) 
{ 
  var decimal=  /^[-+]?[0-9]+\.[0-9]+$/; 
  if(inputtxt.match(decimal)) 
  { 
    return true;
  }
  else
  { 
    return false;
  }
} 

function isFloat(number)
{
    var isNumber = false;
    if(!isNaN(parseFloat(number)))
    {
      isNumber = true;
      var minusCount = 0;
      var decimalCount = 0;
      
      //Parse float is unreliable, so loop through to make sure the string is actually a float
      var numberStr = number.toString();
      for(var j=0; j < numberStr.length; j++)
      {
        if(isNaN(numberStr[j]))
        {
          if(numberStr[j] === '.')
          {
            if(decimalCount > 0)
            {
              isNumber = false;
              break;
            }
            else
            {
              decimalCount++;
            }
          }
          else if(numberStr[j] === '-')
          {
            if(minusCount > 0)
            {
              isNumber = false;
              break;
            }
            else
            {
              minusCount++;
            }
          }
          else
          {
            isNumber = false;
            break;
          }
        }
      }
    }
  
  if(!isNumber)
  {
    return isNumber;
  }
  else
  {
   return  CheckDecimal(numberStr);
  }
}

function parseAndReturnDB()
{
  //Sheets info
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  
  var sheetValues = [[]];
  var rawValue = "";
  var objectValue = {};
  var sheetsJson = []; 
  for(var l=0; l < sheets.length; l++)
  {
    var range = sheets[l].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    var sheetName = sheets[l].getName();
    var inTable = false;
    var inHeader = false;
    var nameCurrentTable = ""
    var obj = {};
    var headers = [];
    var headersColIndex = [];
    var headersForceType = [];
    var HeadersLine = -1;
    var  ValuesJson = [];
    for(var i=0; i < rows; i++) //go throw each line until we meet a !!
    {
       for(var j=0; j < columns; j++)
      {
        if(values[i][j] === "" || values[i][j] == null) continue;
        
        if(values[i][j].length > 2 && values[i][j].toString().substring(0,2) == "!!")
        {
          var remainingValue = values[i][j].toString().substring(2,values[i][j].toString().length)
          if(remainingValue == "End")
          {
            inTable = false;
            nameCurrentTable = "";
            HeadersLine = -1;
            obj["lines"] = ValuesJson;
            obj["separators"] =  [];
            obj["props"] = {};
            sheetsJson.push(obj);
            obj = {};
            headers = [];
            headersColIndex = [];
            headersForceType = [];
            HeadersLine = -1;
            ValuesJson = [];
          }
          else if(inTable == false)
          {
            nameCurrentTable = remainingValue;
            obj["name"] = nameCurrentTable;
            headers = [];
            headersColIndex = [];
            headersForceType = [];
            ValuesJson = [];
            inTable = true;
            j = columns;
            continue;
          }
          else
          {
            Logger.log("Erreur you sheet is missing !!End or !!Name");
            break; 
          }
        }
        if(inTable)
        {
          if(i == HeadersLine+1)
          {
            var headersValues = [];
            for(var k=0; k < headersColIndex.length; k++)
            {
              var headersObj = {};
              
              /*
		"0":
			return CDB_ID
		"1":
			return CDB_STRING
		"2":
			return CDB_BOOL
		"3":
			return CDB_INT
		"4":
			return CDB_FLOAT
		"11":
			return CDB_COLOR
		"13":
			return CDB_FILE
		"14":
			return CDB_TILE
		"15":
			return CDB_VECTOR2
		"16":
			return CDB_VECTOR3
		"17":
			return CDB_LIST
    "18":
			return CDB_DICT
		_:
			return CDB_NIL
            
              */
              var test = values[i-2];
              var headerForceType = values[i-2][headersColIndex[k]];
              if(k != 0 && headerForceType.length > 1 && headerForceType.substring(0,1) == "$")
              {
                if(headersForceType[k] == "ID")
                {
                  typeIntStr = "0";
                }
                else if(headerForceType == "$string")
                {
                  typeIntStr = "1";
                }
                else if(headerForceType == "$bool")
                {
                  typeIntStr = "2";
                }
                else if(headerForceType == "$int")
                {
                  typeIntStr = "3";
                }
                else if(headerForceType == "$float")
                {
                  typeIntStr = "4";
                }
                else if(headerForceType == "$color")
                {
                  typeIntStr = "11";
                }
                else if(headerForceType == "$file")
                {
                  typeIntStr = "13";
                }
                else if(headerForceType == "$tile")
                {
                  typeIntStr = "14";
                }
                else if(headerForceType == "$vector2")
                {
                  typeIntStr = "15";
                }
                else if(headerForceType == "$vector3")
                {
                  typeIntStr = "16";
                }
                else if(headerForceType == "$list")
                {
                  typeIntStr = "17";
                }
                else if(headerForceType == "$dict")
                {
                  typeIntStr = "18";
                }
                else if(headerForceType == "$nil")
                {
                  typeIntStr = "_";
                } 
              }
              else
              {
                var typeIntStr = "0";
                if(k == 0)
                {
                  typeIntStr = "0";
                }
                else if(isFloat(values[i][headersColIndex[k]]))
                {
                  typeIntStr = "4";
                }
                else if(typeof(values[i][headersColIndex[k]]) == 'number')
                {
                  typeIntStr = "3";
                }
                else if(values[i][headersColIndex[k]] === 'true' || values[i][headersColIndex[k]] === 'false' || typeof(values[i][headersColIndex[k]]) == 'boolean')
                {
                  typeIntStr = "2";
                }
                else if(typeof(values[i][headersColIndex[k]]) === 'string')
                {
                  typeIntStr = "1";
                }
              }
              headersObj["typeStr"] = typeIntStr;
              headersObj["name"] = headers[k];
              headersValues.push(headersObj)
            }
            obj["columns"] = headersValues;
            HeadersLine = -1;
          }
          if(values[i][j].length > 1 && values[i][j].toString().substring(0,1) == "!")
          {
            HeadersLine = i;
            var remainingValue = values[i][j].toString().substring(1,values[i][j].toString().length);
            headers.push(remainingValue);
            headersColIndex.push(j);
          }
        }
        if(i > HeadersLine)
        {
          var valueObj = {};
          for(var k=0; k < headersColIndex.length; k++)
          {
            valueObj[headers[k]] = values[i][headersColIndex[k]];
          }
          ValuesJson.push(valueObj);
           j = columns;
           continue;
        }
      }
    }
  }
  objectValue["sheets"] = sheetsJson;
  objectValue["customTypes"]= [];
  objectValue["compress"]= false;
  var final = JSON.stringify(objectValue);
  
  return final;
}

function exportToCDB()
{
  var content = "";
  var fileName = "";
  try
  {
    content = parseAndReturnDB();
    fileName = SpreadsheetApp.getActive().getName()  + ".cdb";

  }
  catch(e)
  {
    var html = HtmlService.createHtmlOutput('<html><body>Error parsing sheet : '+e+'</body></html>')
    SpreadsheetApp.getUi().showModalDialog(html, 'Download');
  }
  try
  {
    var resource = {
      title: fileName,
      mimeType: MimeType.PLAIN_TEXT
    };  
    var blob =  Utilities.newBlob("");
    blob.setDataFromString(content);
    var file = Drive.Files.insert(resource, blob);
   // var file = DriveApp.createFile(fileName, content);
   // var fileID = file.getId();
    //var fileName = file.getName();
    var downloadLink = "https://drive.google.com/uc?export=download&id="+file.getId();
    
    var html = HtmlService.createHtmlOutput('<html><body><a href="'+downloadLink+'" target="blank" onclick="google.script.host.close()">'+"Click right Save As"+'</a><br>Content : <br><br>'+content+'</body></html>')
    SpreadsheetApp.getUi().showModalDialog(html, 'Download');
  }
  catch(e)
  {
    var html = HtmlService.createHtmlOutput('<html><body> error : '+e+' <br> content of sheet<br><br><br>'+content+'</body></html>')
    SpreadsheetApp.getUi().showModalDialog(html, 'Download');
  }
}


function onOpen(e)
{
  var ui = SpreadsheetApp.getUi();
  ui.createAddonMenu()
  .addItem("ExportToCDB", "exportToCDB")
  .addToUi();
}
  