var VehicleColours = [];
var ModelInfos = {};
var ModelInfosName = {};
var CurrentModel = null;

function
SetCarColors(cols)
{
	carColors = [
		[ 0, 0, 0, 255 ],
		[ 0, 0, 0, 255 ],
		[ 0, 0, 0, 255 ],
		[ 0, 0, 0, 255 ]
	];
	if(cols !== undefined)
		for(let i = 0; i < cols.length; i++){
			let col = VehicleColours[cols[i]];
			carColors[i][0] = col[0];
			carColors[i][1] = col[1];
			carColors[i][2] = col[2];
		}
}

function
LoadColors(cols)
{
	SetCarColors(cols);
	setVehicleColors(modelinfo, carColors[0], carColors[1], carColors[2], carColors[3]);
}

function
SelectModel(model)
{

	CurrentModel = ModelInfosName[model];
	let col1 = [ 0, 0, 0, 255 ];
	let col2 = [ 0, 0, 0, 255 ];


	camDist = 5.0;
	camPitch = 0.3;
	camYaw = 1.0;
	SetCarColors(CurrentModel.colors[0]);

	loadCar(model + ".dff");
}

function
StartUI()
{

}

function
LoadVehicle(fields)
{
	let id = Number(fields[0]);
	let mi = {};
	mi.id = id;
	mi.type = "vehicle";
	mi.model = fields[1];
	mi.txd = fields[2];
	mi.vehtype = fields[3];
	mi.handling = fields[4];
	if(mi.vehtype == "car"){
		// TODO: check SA
		mi.wheelId = Number(fields[11]);
		mi.wheelScale = Number(fields[12]);
	}
	mi.colors = [];
	ModelInfos[mi.id] = mi;
	ModelInfosName[mi.model] = mi;
}

function
LoadColour(fields)
{
	let r = Number(fields[0]);
	let g = Number(fields[1]);
	let b = Number(fields[2]);
	VehicleColours.push([r, g, b]);
}

function
LoadVehicleColour(fields)
{
	let mi = ModelInfosName[fields[0]];
	for(let i = 1; i < fields.length; i += 2){
		let c1 = Number(fields[i]);
		let c2 = Number(fields[i+1]);
		mi.colors.push([c1, c2]);
	}
}

function
LoadVehicleColour4(fields)
{
	let mi = ModelInfosName[fields[0]];
	for(let i = 1; i < fields.length; i += 4){
		let c1 = Number(fields[i]);
		let c2 = Number(fields[i+1]);
		let c3 = Number(fields[i+2]);
		let c4 = Number(fields[i+3]);
		mi.colors.push([c1, c2, c3, c4]);
	}
}

function
LoadObjectTypes(text)
{
	LoadSectionedFile(text, {
		"cars": LoadVehicle
	});
}

function
LoadVehicleColours(text)
{
	LoadSectionedFile(text, {
		"col": LoadColour,
		"car": LoadVehicleColour,
		"car4": LoadVehicleColour4
	});
}

function
LoadSectionedFile(text, sections)
{
	let section = "end";
	let lines = text.split("\n");
	for(let i = 0; i < lines.length; i++){
		let line = lines[i].replace(/,/g, " ").replace(/#.*/g, "").trim().toLowerCase();
		if(line.length == 0)
			continue;
		let fields = line.split(/[\t ]+/);

		if(section == "end"){
			section = fields[0];
			continue;
		}
		if(fields[0] == "end"){
			section = "end";
			continue;
		}

		if(section in sections)
			sections[section](fields);
	}
}

function
loadText(filename, cb)
{
	let req = new XMLHttpRequest();
	req.open("GET", configEngine.cdnurl + "data/" + filename, true);
	req.responseType = "text";

	req.onload = function(oEvent){
		cb(req.response);
	};

	req.send(null);
}

function
loadVehicleViewer(idefile, CB)
{
	VehicleColours = [];
	ModelInfos = {};
	ModelInfosName = {};
	CurrentModel = null;

	loadText(idefile, function(text){
		LoadObjectTypes(text);
		loadText("carcols.dat", function(text){
			LoadVehicleColours(text);
			CB();
		});
	});
}