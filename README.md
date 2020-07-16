# GoogleSheetToCastleDb
google script to export google Sheet To castleDb

use !!!NameOfSheet for declare beginning of the db sheet
use !!end for declare the end of the dbSheet

use ! for the column name

use $type or ID to force the type of your column

ID
$string
$bool
$int
$float
$color
$file
$tile
$nil

the name of your file will be the name of the googleeSheet.cdb

<img src="https://github.com/tdo1/GoogleSheetToCastleDb/blob/master/capture.PNG">



result : 

{
	"sheets": [
		{
			"name": "Weapons",
			"columns": [
				{
					"typeStr": "0",
					"name": "ID"
				},
				{
					"typeStr": "1",
					"name": "name"
				},
				{
					"typeStr": "4",
					"name": "damage"
				},
				{
					"typeStr": "3",
					"name": "energyRequired"
				},
				{
					"typeStr": "13",
					"name": "image"
				}
			],
			"lines": [
				{
					"ID": "W1",
					"name": "weapon number one",
					"damage": 10.1,
					"energyRequired": 8,
					"image": "../art/engine/engine1.png"
				},
				{
					"ID": "W2",
					"name": "weapon two",
					"damage": 11.3,
					"energyRequired": 12,
					"image": "../art/engine/engine1.png"
				},
				{
					"ID": "W3",
					"name": "weapon three",
					"damage": 13.4,
					"energyRequired": 14,
					"image": "../art/engine/engine1.png"
				}
			],
			"separators": [],
			"props": {}
		},
		{
			"name": "Weapons2",
			"columns": [
				{
					"typeStr": "0",
					"name": "ID"
				},
				{
					"typeStr": "1",
					"name": "name"
				},
				{
					"typeStr": "4",
					"name": "damage"
				},
				{
					"typeStr": "3",
					"name": "energyRequired"
				},
				{
					"typeStr": "1",
					"name": "image"
				}
			],
			"lines": [
				{
					"ID": "W1",
					"name": "weapon number one",
					"damage": 10.1,
					"energyRequired": 10,
					"image": "../art/engine/engine1.png"
				},
				{
					"ID": "W2",
					"name": "weapon two",
					"damage": 11.3,
					"energyRequired": 12,
					"image": "../art/engine/engine1.png"
				},
				{
					"ID": "W3",
					"name": "weapon three",
					"damage": 13.4,
					"energyRequired": 14,
					"image": "../art/engine/engine1.png"
				}
			],
			"separators": [],
			"props": {}
		}
	],
	"customTypes": [],
	"compress": false
}
