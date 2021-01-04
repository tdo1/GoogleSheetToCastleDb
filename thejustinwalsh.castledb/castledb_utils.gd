enum { CDB_ID, CDB_STRING, CDB_BOOL, CDB_INT, CDB_FLOAT, CDB_COLOR, CDB_FILE, CDB_TILE, CDB_VECTOR2, CDB_VECTOR3, CDB_LIST, CDB_NIL }

static func get_column_type(column):
	match column["typeStr"]:
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
		_:
			return CDB_NIL

static func gen_castle_types() -> String:
	return ""
	
static func gen_column_keys(name:String, columns:Array, lines:Array, outKeys:Array, indent:int) -> String:
	var tab = ""
	for i in indent:
		tab += "\t"
		
	var code = ""
	var unique_id = ""
	for column in columns:
		if get_column_type(column) == CDB_ID:
			unique_id = column["name"]
	if unique_id != "":
		for line in lines:
			var id = line[unique_id]
			outKeys.push_back(id)
			code += tab + "const %s := \"%s\"" % [id, id] + "\n"
	return code
	
static func gen_column_data(path:String, name:String, columns:Array, lines:Array, keys:Array, indent:int) -> String:
	var tab = ""
	for i in indent:
		tab += "\t"
	
	var code = tab + "class %sRow:" % name + "\n"
	var params = []
	var types = []
	for column in columns:
		var type = get_column_type(column)
		match type:
			CDB_ID, CDB_STRING, CDB_FILE:
				code += tab + "\t" + "var %s := \"\"" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_BOOL:
				code += tab + "\t" + "var %s := false" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_INT:
				code += tab + "\t" + "var %s := 0" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_FLOAT:
				code += tab + "\t" + "var %s := 0.0" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_COLOR:
				code += tab + "\t" + "var %s := Color()" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_TILE:
				code += tab + "\t" + "var %s := CastleDB.Tile.new()" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_VECTOR2:
				code += tab + "\t" + "var %s := Vector2()" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_VECTOR3:
				code += tab + "\t" + "var %s := Vector3()" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			CDB_LIST:
				code += tab + "\t" + "var %s := []" % column["name"] + "\n"
				params.push_back(column["name"])
				types.push_back(type)
			_:
				pass
	
	# Init func
	code += tab + "\t\n"
	code += tab + "\t" + "func _init("
	for i in params.size():
		var param = params[i]
		var type = types[i]
		if i > 0: code += ", "
		match type:
			CDB_ID, CDB_STRING, CDB_FILE:
				code += "%s = \"\"" % params[i]
			CDB_BOOL:
				code += "%s = false" % params[i]
			CDB_INT:
				code += "%s = 0" % params[i]
			CDB_FLOAT:
				code += "%s = 0.0" % params[i]
			CDB_COLOR:
				code += "%s = Color()" % params[i]
			CDB_TILE:
				code += "%s = CastleDB.Tile.new()" % params[i]
			CDB_VECTOR2:
				code += "%s = Vector2()" % params[i]
			CDB_VECTOR3:
				code += "%s = Vector3()" % params[i]
			CDB_LIST:
				code += "%s = []" % params[i]
			_:
				code += "%s = \"\"" % params[i]
	code += "):" + "\n"
	for param in params:
		code += tab +"\t\t" + "self.%s = %s" % [param, param] + "\n"
	code += tab + "\n"
	
	# Data
	if lines.size() > 0:
		code += tab + "var all = ["
		for i in lines.size():
			var line = lines[i];
			code += "%sRow.new(" % name
			for j in params.size():
				var param = params[j]
				var type = types[j]
				if line.has(param):
					if j > 0: code += ", "
					match type:
						CDB_ID:
							code += "%s" % line[param]
						CDB_BOOL:
							code += "%s" % "true" if line[param] else "false"
						CDB_INT:
							code += "%d" % line[param]
						CDB_FLOAT:
							code += "%f" % line[param]
						CDB_STRING, CDB_FILE:
							code += "\"%s\"" % line[param]
						CDB_COLOR:
							code += "Color(%d)" % line[param]
						CDB_TILE:
							var img = Image.new()
							img.load(path + "/" + line[param]["file"])
							var stride = int(img.get_width() / line[param]["size"])
							code += "CastleDB.Tile.new(\"%s\", %s, %s, %s, %s)" % [ line[param]["file"], line[param]["size"], line[param]["x"], line[param]["y"], stride ]
						CDB_VECTOR2:
							code += "Vector2(%s)" % line[param]
						CDB_VECTOR3:
							code += "Vector3(%s)" % line[param]
						CDB_LIST:
							code += "[%s]" % line[param]
						_:
							code += "\"%s\"" % line[param]
			code += ")"
			if i != lines.size() - 1:
				code += ", "
		code += "]" + "\n"
	
	# Index
	if keys.size() > 0:
		code += tab + "var index = {"
		for i in keys.size():
			code += "%s: %s" % [keys[i], i]
			if i != keys.size() - 1:
				code += ", "
		code += "}" + "\n"
		code += tab + "\n"
	
	# Get function
	code += tab + "func get(id:String) -> %sRow:" % name + "\n"
	code += tab + "\t" + "if index.has(id):" + "\n"
	code += tab + "\t\t" + "return all[index[id]]" + "\n"
	code += tab + "\t" + "return null" + "\n"
	
	# Get index function
	code += "\n"
	code += tab + "func get_index(idx:int) -> %sRow:" % name + "\n"
	code += tab + "\t" + "if idx < all.size():" + "\n"
	code += tab + "\t\t" + "return all[idx]" + "\n"
	code += tab + "\t" + "return null" + "\n"
		
	return code
