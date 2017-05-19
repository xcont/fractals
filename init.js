var population=[];
var fitness=[];
var anglemin=14; //population with anglemin angles
var anglemax=16; //population with anglemax angles
var PopulationSize=20; // !!! Must be divisible by 4


var min=-75; //angles for create population
var max=75;
var step=15;

var minm=-89; //angles for mutations
var maxm=89;
var stepm=1;

// we want to see history of evolution //
var oldPopulation=[]; // in this arrays we will save old populations
var parents=[]; //here we save index of parents for all fractals in new population
var crossover=[]; // crossover information here
var mutations=[]; // in mutations arrays we will save all mutations history
var exchanges=[]; // if some of them will change the number of genes - we will save that in exchanges arrays
for(var i=0; i<4; i++){
	oldPopulation[i]=[];
	parents[i]=[];
	crossover[i]=[];
	mutations[i]=[];
	exchanges[i]=[];
}
// we want to see history of evolution //

function randomangl(min, max, step){
	if(step==0) step=1; //we don't want division by zero
	var rand;
	var minS=min/step;
	var maxS=max/step;
	rand=Math.floor(Math.random() * (maxS - minS + 1)) + minS;
	if(rand==0) rand=1; //we don't want angles with 0 degrees
	rand*=step;
	if(rand>max) rand=max;
	return Math.round(rand); //we have no problem with fractional angles, but in interface that's looks shitty :)
}


var PopulationNumber;
var FractalNumber=[];
var iteration=17;
var docWidth=document.documentElement.clientWidth;
var canvasSize;
var xA, yA, xB, yB;

/// crutch for mobile devices ///
if (docWidth>=2547){
	canvasSize=600;
	xA=300;
	yA=150;
	xB=300;
	yB=450;
}else{
	canvasSize=Math.floor((docWidth-20)/2.2);																										///!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 3.2
	xA=Math.floor((canvasSize)/2);
	yA=Math.floor((canvasSize)/10)*3;
	xB=Math.floor((canvasSize)/2);
	yB=Math.floor((canvasSize)/10)*7;
}
/// crutch for mobile devices ///


/// local storage functions ///
var drawmode;
var drawmodeInStorage;
function changeDrawMode(){
	var dm = document.getElementById("drawmode");
	var dms = dm.options[dm.selectedIndex].value;
	drawmode=Number(dms);
	localStorage["fractal.drawmode"] = drawmode;
	//get2fractals();
	drawcanvas(1, true);
	drawcanvas(2, true);
}
function getDrawMode(){
	drawmodeInStorage = (localStorage["fractal.drawmodeInStorage"] == "true");
	if(drawmodeInStorage){
		drawmode = JSON.parse(localStorage["fractal.drawmode"]);
		var dm = document.getElementById("drawmode");
		dm.value = drawmode;
	}else{
		drawmode=0;
		localStorage["fractal.drawmode"] = drawmode;
		localStorage["fractal.drawmodeInStorage"] = "true";
	}
}

var PopulationInStorage;
function supportsLocalStorage(){
	return ('localStorage' in window) && window['localStorage'] !== null;
}

function savePopulation(){
	if (!supportsLocalStorage()) { return false; }
	localStorage["fractal.in.Storage"] = PopulationInStorage;
	localStorage["fractal.population"] = JSON.stringify(population);
	
	localStorage["fractal.oldPopulation"] = JSON.stringify(oldPopulation);
	localStorage["fractal.parents"] = JSON.stringify(parents);
	localStorage["fractal.crossover"] = JSON.stringify(crossover);
	localStorage["fractal.mutations"] = JSON.stringify(mutations);
	localStorage["fractal.exchanges"] = JSON.stringify(exchanges);
	return true;
}
function saveSettings(){
	localStorage["fractal.anglemin"] = anglemin;
	localStorage["fractal.anglemax"] = anglemax;
	localStorage["fractal.PopulationSize"] = PopulationSize;
	
	localStorage["fractal.min"] = min;
	localStorage["fractal.max"] = max;
	localStorage["fractal.step"] = step;
	localStorage["fractal.minm"] = minm;
	localStorage["fractal.maxm"] = maxm;
	localStorage["fractal.stepm"] = stepm;
}
function saveFitness(){
	if (!supportsLocalStorage()) { return false; }
	localStorage["fractal.fitness"] = JSON.stringify(fitness);
	return true;	
}
function resumePopulation(){
	if (!supportsLocalStorage()) { return false; }
	PopulationInStorage = (localStorage["fractal.in.Storage"] == "true");
	if (!PopulationInStorage) { return false; }
	population=JSON.parse(localStorage["fractal.population"]);
	fitness=JSON.parse(localStorage["fractal.fitness"]);
	anglemin=JSON.parse(localStorage["fractal.anglemin"]);
	anglemax=JSON.parse(localStorage["fractal.anglemax"]);
	PopulationSize=JSON.parse(localStorage["fractal.PopulationSize"]);
	
	min=JSON.parse(localStorage["fractal.min"]);
	max=JSON.parse(localStorage["fractal.max"]);
	step=JSON.parse(localStorage["fractal.step"]);
	minm=JSON.parse(localStorage["fractal.minm"]);
	maxm=JSON.parse(localStorage["fractal.maxm"]);
	stepm=JSON.parse(localStorage["fractal.stepm"]);
	
	
	oldPopulation=JSON.parse(localStorage["fractal.oldPopulation"]);
	parents=JSON.parse(localStorage["fractal.parents"]);
	crossover=JSON.parse(localStorage["fractal.crossover"]);
	mutations=JSON.parse(localStorage["fractal.mutations"]);
	exchanges=JSON.parse(localStorage["fractal.exchanges"]);
	return true;
}
function newPopulation(){
	population=[];
	fitness=[];
	localStorage.clear();
	for(var n=anglemin; n<=anglemax; n++){
		population[n]=[];
		fitness[n]=[];
		for(var i=0; i<PopulationSize; i++){
			population[n][i]=[];
			fitness[n][i]=0;
			for(var j=0; j<n; j++){
				population[n][i][j]=randomangl(min, max, step);
				if(j==0) population[n][i][j]=Math.abs(population[n][i][j]);
			}
		}
	}
	PopulationInStorage = true;
	
	oldPopulation=[];
	parents=[];
	crossover=[];
	mutations=[];
	exchanges=[];
	for(var i=0; i<4; i++){
		oldPopulation[i]=[];
		parents[i]=[];
		crossover[i]=[];
		mutations[i]=[];
		exchanges[i]=[];
	}
	
	savePopulation();
	saveFitness();
	saveSettings();
}
function flood(selected){
	var mutation=document.getElementById("mutatepercent").value;
	var arrselected=population[PopulationNumber][FractalNumber[selected]];
	population[PopulationNumber]=[];
	fitness[PopulationNumber]=[];
	for(var i=0; i<PopulationSize; i++){
		population[PopulationNumber][i]=[];
		fitness[PopulationNumber][i]=0;
		for(var j=0; j<PopulationNumber; j++){
			population[PopulationNumber][i][j]=arrselected[j];
		}
	}
	if(mutation>0){
		var m=100/mutation;
		for(var i=0; i<PopulationSize; i++){
			var rnd=Math.floor(Math.random()*(m))+1;
			if(rnd==1){
				var mutatedgene=Math.floor(Math.random()*(PopulationNumber));
				population[PopulationNumber][i][mutatedgene]=randomangl(minm, maxm, stepm);
			}
		}
	}
	savePopulation();
	saveFitness();
	get2fractals();
}
function recreate(){
	newPopulation();
	get2fractals();
	showPopulationInfo();
}
/// local storage functions ///

function init(){
	if (!resumePopulation()){
		newPopulation();
	}
	getDrawMode();
	get2fractals();
	savePopulation();
	saveFitness();
	showPopulationInfo();
}

function get2fractals(){
	PopulationNumber=Math.floor(Math.random() * (anglemax - anglemin + 1))+anglemin;
	drawcanvas(1);
	drawcanvas(2);
}

function drawcanvas(n, isFractalNumberExist=false){
	var canvas=document.getElementById('myCanvas'+n);
	var context=canvas.getContext('2d');
	canvas.width=canvasSize;
	canvas.height=canvasSize;
	context.fillStyle = 'rgb(255,255,255)';
	context.fillRect (0, 0, canvas.width, canvas.height);
	var position=[];
	
	if(!isFractalNumberExist){
		if(n==1){ //we don't want two same fractals
			FractalNumber[1]=Math.floor(Math.random() * (PopulationSize));
		}else{
			do{
				var rnd = Math.floor(Math.random() * (PopulationSize));
			}while(rnd==FractalNumber[1])
			FractalNumber[2]=rnd;
		}
	}
	
	var array1fractal=population[PopulationNumber][FractalNumber[n]];
	
	var fractaln=document.getElementById('button'+n);
	fractaln.innerHTML="Fractal #"+FractalNumber[n]+", ["+PopulationNumber+" population], fitness: "+fitness[PopulationNumber][FractalNumber[n]];
	
	context.beginPath();
	context.fillStyle = 'rgb(0,0,0)';
	draw(context, array1fractal, position, iteration, xA, yA, xB, yB);
	context.stroke();
}

function drawSingle(canv, n, i, iterations, canvasSizeIn, drawarr){
	if(n!=null){
		var arr=population[n][i];
	}else{
		var arr=drawarr;
	}
	var context=canv.getContext('2d');
	canv.width=canvasSizeIn;
	canv.height=canvasSizeIn;
	if(arr!=null){
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect (0, 0, canv.width, canv.height);
		var position=[];
		var xAin=Math.floor((canvasSizeIn)/2);
		var yAin=Math.floor((canvasSizeIn)/10)*3;
		var xBin=Math.floor((canvasSizeIn)/2);
		var yBin=Math.floor((canvasSizeIn)/10)*7;
		//arr=[-45,45,45,-45];
		context.beginPath();
		context.fillStyle = 'rgb(0,0,0)';
		draw(context, arr, position, iterations, xAin, yAin, xBin, yBin);
		context.stroke();
	}else{
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect (0, 0, canv.width, canv.height);
	}
}

/// change fitness for selected fractal ///
function selecter(n){
	fitness[PopulationNumber][FractalNumber[n]]++;
	saveFitness();
	get2fractals();
}
/// change fitness for selected fractal ///

/// Interface ///
var freezeDescr=false;
var freezeDescrN=0;
var iseditstarted=false;
function showDescription(n){
	if(!freezeDescr){
		document.getElementById('frinfo').style.display = "block";
		document.getElementById('frinfo'+n).style.display = "block";
		document.getElementById('parents').style.display = "block";
		displayDescription(n);
	}else{
		displayDescription(freezeDescrN);
	}
	flushicons();
}
function hideDescription(n){
	if(!freezeDescr){
		document.getElementById('frinfo').style.display = "none";
		document.getElementById('frinfo'+n).style.display = "none";
		document.getElementById('parents').style.display = "none";
	}
}
function freezeDescription(n){
	document.getElementById('frinfo1').style.display = "none";
	document.getElementById('frinfo2').style.display = "none";
	document.getElementById('frinfo'+n).style.display = "block";
	if(freezeDescr==false){
		freezeDescr=true;
	}
	if(freezeDescrN==n){
		freezeDescr=!freezeDescr;
		freezeDescrN=0;
	}else{
		freezeDescrN=n;
		displayDescription(n);
	}
}
function displayDescription(n){
	var descriptionBoard=document.getElementById('content');
	descriptionBoard.innerHTML=population[PopulationNumber][FractalNumber[n]].join(', ');
	var buttonTree=document.getElementById('buttont');
	var buttonTreeOnclickFunction="showTree("+n+");"
	buttonTree.setAttribute("onclick", buttonTreeOnclickFunction);
	var buttonFlood=document.getElementById('buttonflood');
	var buttonFloodOnclickFunction="flood("+n+");"
	buttonFlood.setAttribute("onclick", buttonFloodOnclickFunction);
}
function resetDescription(){
	freezeDescr=false;
	freezeDescrN=0;
	document.getElementById('frinfo1').style.display = "none";
	document.getElementById('frinfo2').style.display = "none";
	document.getElementById('parents').style.display = "none";
}

function showinfointree(id,n,i){
	var canvas=document.getElementById('treedowncanvas');
	var arr=[];
	if(id!=null){
		arr=oldPopulation[id][n][i];
	}else{
		arr=population[n][i];
	}
	drawSingle(canvas, null, null, 16, 400, arr);
}

function recurstree(id, appendchildhere, parentsarrayid){
	if(parentsarrayid==4) return;
	//console.log(id);
	//console.log(parentsarrayid);
	//console.log(PopulationNumber);
	
	var left = document.createElement('div');
	left.className = "left";
	var right = document.createElement('div');
	right.className = "right";
	var clear = document.createElement('div');
	clear.className = "clear";
	var down = document.createElement('div');
	down.className = "down";
	
	var newcanvas=document.createElement('canvas');
	down.appendChild(newcanvas);
	
	if(id===undefined){
		drawSingle(newcanvas, null, null, 12, 100, null);
	}else{
		drawSingle(newcanvas, null, null, 12, 100, oldPopulation[parentsarrayid][PopulationNumber][id]);
		var onclickFunction="showinfointree("+parentsarrayid+","+PopulationNumber+","+id+");"
		down.setAttribute("onclick", onclickFunction);
	}
	

	var parentleft;
	var parentright;
	if(parents[parentsarrayid+1]!==undefined && id!==undefined){
		if(parents[parentsarrayid+1].length!=0){
			parentleft=parents[parentsarrayid+1][PopulationNumber][id][0];
			parentright=parents[parentsarrayid+1][PopulationNumber][id][1];
		}
	}
	//console.log(parents[parentsarrayid+1]);

	
	recurstree(parentleft, left, parentsarrayid+1);	
	recurstree(parentright, right, parentsarrayid+1);
	
	appendchildhere.appendChild(left);
	appendchildhere.appendChild(right);
	appendchildhere.appendChild(clear);
	appendchildhere.appendChild(down);
}

function showTree(n){
	var lock=document.getElementById('tree'); 
    lock.className='treeOn';

	var leftid=document.getElementById('leftid'); 
	var rightid=document.getElementById('rightid'); 
	var downid=document.getElementById('downid'); 
	
	var onclickFunction="showinfointree(null,"+PopulationNumber+","+FractalNumber[n]+");"
	downid.setAttribute("onclick", onclickFunction);
	
	var newcanvas=document.createElement('canvas');
	downid.appendChild(newcanvas);
	drawSingle(newcanvas, null, null, 12, 100, population[PopulationNumber][FractalNumber[n]]);
	
	var parentleft;
	var parentright;
	if(parents[0].length!=0){
		parentleft=parents[0][PopulationNumber][FractalNumber[n]][0];
		parentright=parents[0][PopulationNumber][FractalNumber[n]][1];
	}
	
	recurstree(parentleft, leftid, 0);	
	recurstree(parentright, rightid, 0);

	
	/*var hello=document.getElementById('console-log0');
	var txt1="parent1="+parents[0][PopulationNumber][FractalNumber[n]][0];
	var txt2="parent2="+parents[0][PopulationNumber][FractalNumber[n]][1];
	hello.innerHTML=txt1+", "+txt2;
	
	var hello=document.getElementById('console-log1');
	var txt0="children_gens="+population[PopulationNumber][FractalNumber[n]].join(', ');
	var txt1="parent1_gens="+oldPopulation[0][PopulationNumber][parents[0][PopulationNumber][FractalNumber[n]][0]].join(', ');
	var txt2="parent2_gens="+oldPopulation[0][PopulationNumber][parents[0][PopulationNumber][FractalNumber[n]][1]].join(', ');
	hello.innerHTML=txt0+"<br />"+txt1+"<br />"+txt2;
	
	var hello=document.getElementById('console-log2');
	var txt1=crossover[0][PopulationNumber][FractalNumber[n]].join(', ');
	hello.innerHTML=txt1;
	
	var hello=document.getElementById('console-log3');
	var txt1=mutations[0][PopulationNumber][FractalNumber[n]];
	hello.innerHTML=txt1;*/
	//oldPopulation[i]=[];
	//parents[i]=[];
	//crossover[i]=[];
	//mutations[i]=[];
	//exchanges[i]=[];
}
function hideTree(){
	var lock = document.getElementById('tree'); 
    lock.className = 'treeOff';
	var treeupcontent = document.getElementById('treeupcontent');
	var onemorediv = document.getElementById('onemoredivid');
	treeupcontent.removeChild(onemorediv);
	var newonemorediv = document.createElement('div');
	newonemorediv.setAttribute('id', 'onemoredivid');
	newonemorediv.className = "onemorediv";
	
	var left = document.createElement('div');
	left.setAttribute('id', 'leftid');
	left.className = "left";
	
	var right = document.createElement('div');
	right.setAttribute('id', 'rightid');
	right.className = "right";
	
	var clear = document.createElement('div');
	clear.className = "clear";
	
	var down = document.createElement('div');
	down.setAttribute('id', 'downid');
	down.className = "down";
	
	newonemorediv.appendChild(left);
	newonemorediv.appendChild(right);
	newonemorediv.appendChild(clear);
	newonemorediv.appendChild(down);
	treeupcontent.appendChild(newonemorediv);
	
	
	var treedowncontent = document.getElementById('treedowncontent');
	var treedowncanvas = document.getElementById('treedowncanvas');
	treedowncontent.removeChild(treedowncanvas);
	var newtreedowncanvas = document.createElement('canvas');
	newtreedowncanvas.setAttribute('id', 'treedowncanvas');
	treedowncontent.appendChild(newtreedowncanvas);
}

function flushicons(){
	document.getElementById('edit1').style.display = "inline-block";
	document.getElementById('edit2').style.display = "none";
	document.getElementById('edit3').style.display = "none";
	iseditstarted=false;
}
function editstart(){
	if(!iseditstarted){
		document.getElementById('edit1').style.display = "none";
		document.getElementById('edit2').style.display = "inline-block";
		document.getElementById('edit3').style.display = "inline-block";
		var descriptionBoard=document.getElementById('content');
		var arr1=population[PopulationNumber][FractalNumber[freezeDescrN]];
		var array2txt=arr1.join(', ');
		//var txtlength=array2txt.length-5;
		var edittxt="<input type=\"text\" id=\"edditedarray\" value=\""+array2txt+"\">";
		descriptionBoard.innerHTML=edittxt;
		iseditstarted=true;
	}
}
function editend(){
	var str=document.getElementById('edditedarray').value;
	var str2arr=str.split(",");
	var editedarray=[]
	var selectone;
	for(var i=0;i<PopulationNumber;i++){
		selectone=Number(str2arr[i]);
		if(isNaN(selectone) || selectone==0) selectone=45;
		editedarray[i]=selectone;
	}
	population[PopulationNumber][FractalNumber[freezeDescrN]]=editedarray;
	console.log(population);
	drawcanvas(freezeDescrN, true);
	savePopulation()
	flushicons();
	displayDescription(freezeDescrN);
}
function editcancel(){
	flushicons();
	displayDescription(freezeDescrN);
}

var freezeBattonAfter=0;
var freezeBattonBefore=0;
var somethingFreezed=false;
function press2(n){
	var buttonn=document.getElementById('button'+n);
	buttonn.style.borderImage = "url(\"css/border2.png\") 2 repeat";
	buttonn.style.background = "#EEEEEE";
	if(somethingFreezed==false){
		somethingFreezed=true;
		freezeBattonAfter=n;
	}else{
		if((freezeBattonBefore==1 || freezeBattonBefore==2 || freezeBattonBefore==5) && freezeBattonBefore!=n){
			unpress2(freezeBattonBefore);
			somethingFreezed=true;
			freezeBattonAfter=n;
		}else{
			somethingFreezed=false;
			freezeBattonAfter=0;
		}
	}
}
function unpress2(n){
	if (freezeBattonBefore==1 || freezeBattonBefore==2 || freezeBattonBefore==5){
		var buttonn=document.getElementById('button'+freezeBattonBefore);
		buttonn.style.borderImage = "url(\"css/border.png\") 2 repeat";
		buttonn.style.background = "#CCCCCC";
		freezeBattonBefore=0;
	}else{
		freezeBattonBefore=freezeBattonAfter;
	}
}
function resetInterface(){
	somethingFreezed=false;
	unpress2(freezeBattonBefore);
	freezeBattonAfter=0;
	freezeBattonBefore=0;
	resetDescription();
}
function press(n){
	var buttonn=document.getElementById('button'+n);
	buttonn.style.borderImage = "url(\"css/border2.png\") 2 repeat";
	buttonn.style.background = "#EEEEEE";
	resetInterface();
}
function unpress(n){
	var buttonn=document.getElementById('button'+n);
	buttonn.style.borderImage = "url(\"css/border.png\") 2 repeat";
	buttonn.style.background = "#CCCCCC";
}
function recreateMenu(){
	var lock = document.getElementById('skm_LockPane'); 
    lock.className = 'LockOn';
	document.getElementById('new-population').style.display = "block";
	document.getElementById("minangles").value=anglemin;
	document.getElementById("maxangles").value=anglemax;
	document.getElementById("popsize").value=PopulationSize/4;
	document.getElementById("min1").value=min;
	document.getElementById("max1").value=max;
	document.getElementById("step1").value=step;
	document.getElementById("min2").value=minm;
	document.getElementById("max2").value=maxm;
	document.getElementById("step2").value=stepm;
}
function recreateOk(){
	anglemin=Math.floor(Number(document.getElementById("minangles").value));
	anglemax=Math.floor(Number(document.getElementById("maxangles").value));
	PopulationSize=Math.floor(Number(document.getElementById("popsize").value));
	min=Math.floor(Number(document.getElementById("min1").value));
	max=Math.floor(Number(document.getElementById("max1").value));
	step=Math.floor(Number(document.getElementById("step1").value));
	minm=Math.floor(Number(document.getElementById("min2").value));
	maxm=Math.floor(Number(document.getElementById("max2").value));
	stepm=Math.floor(Number(document.getElementById("step2").value));
	if(anglemin<2) anglemin=2;
	if(anglemax<anglemin) anglemax=anglemin;
	if(PopulationSize<1) PopulationSize=1;
	PopulationSize*=4;
	recreate();
	var lock = document.getElementById('skm_LockPane'); 
    lock.className = 'LockOff';
	document.getElementById('new-population').style.display = "none";
}
function recreateCancel(){
	var lock = document.getElementById('skm_LockPane'); 
    lock.className = 'LockOff';
	document.getElementById('new-population').style.display = "none";
}
function showHelp(){
	var lock = document.getElementById('skm_LockPane'); 
    lock.className = 'LockOn';
	document.getElementById('help').style.display = "block";
}
function hideHelp(){
	var lock = document.getElementById('skm_LockPane'); 
    lock.className = 'LockOff';
	document.getElementById('help').style.display = "none";
}
function showPopulationInfo(){
	var angles=anglemax-anglemin+1;
	var size=PopulationSize;
	var allfractals=PopulationSize*angles;
	var populationinfo=document.getElementById('populationinfo');
	var inhelp=document.getElementById('inhelp');
	var infotxt=allfractals+" fractals ("+angles+" populations with ["+anglemin+", "+anglemax+"] angles. "+size+" fractals in each population)";
	populationinfo.innerHTML=infotxt;
	inhelp.innerHTML=infotxt;
}

var allFractals=[];
var field=[];
function showAll(){
	var lock = document.getElementById('showall'); 
    lock.className = 'showallOn';
	var notSelectedField=document.getElementById('allcontent');
	allFractals=[];
	field=[];
	for(var n=anglemin; n<=anglemax; n++){
		allFractals[n]=[];
		field[n]=[];
		for(var i=0; i<PopulationSize; i++){
			field[n][i]=0;
			var atr="fractalN"+n+"-"+i;
			allFractals[n][i]=document.createElement('div');
			allFractals[n][i].setAttribute("id", atr);
			allFractals[n][i].className = "showallChildBlocks";
			allFractals[n][i].setAttribute("id", atr);
			var onclickFunction="changeField("+n+","+i+");"
			allFractals[n][i].setAttribute("onclick", onclickFunction);
			var onmouseoverFunction="showBig("+n+","+i+");"
			allFractals[n][i].setAttribute("onmouseover", onmouseoverFunction);
			var onmouseoutFunction="hideBig("+n+","+i+");"
			allFractals[n][i].setAttribute("onmouseout", onmouseoutFunction);
			var canvasInChildBlock=document.createElement('canvas');
			var canvasId="MyCanvas"+n+"-"+i;
			canvasInChildBlock.setAttribute("id", canvasId);
			allFractals[n][i].appendChild(canvasInChildBlock);
			notSelectedField.appendChild(allFractals[n][i]);
			drawSingle(canvasInChildBlock, n, i, 12, 100);
		}
	}
}
function changeField(n, i){
	var notSelectedField=document.getElementById('allcontent');
	var SelectedField=document.getElementById('selectedcontent');
	if(field[n][i]==0){
		field[n][i]=1;
		notSelectedField.removeChild(allFractals[n][i]);
		SelectedField.appendChild(allFractals[n][i]);
	}else{
		field[n][i]=0;
		SelectedField.removeChild(allFractals[n][i]);
		notSelectedField.appendChild(allFractals[n][i]);
	}
}
function showAllEnd(){
	var lock = document.getElementById('showall'); 
    lock.className = 'showallOff';
	var delfromall=document.getElementById('all');
	var delallcontent=document.getElementById('allcontent');
	delfromall.removeChild(delallcontent);
	var newallcontent=document.createElement('div');
	newallcontent.setAttribute("id", "allcontent");
	delfromall.appendChild(newallcontent);
	
	var delfromall=document.getElementById('selected');
	var delallcontent=document.getElementById('selectedcontent');
	delfromall.removeChild(delallcontent);
	var newallcontent=document.createElement('div');
	newallcontent.setAttribute("id", "selectedcontent");
	delfromall.appendChild(newallcontent);
	
	document.getElementById('singleinall').style.display = "none";
}
function showAllEvolution(){
	for(var n=anglemin; n<=anglemax; n++){
		for(var i=0; i<PopulationSize; i++){
			fitness[n][i]=field[n][i];
		}
	}
	evolution();
	showAllEnd();
	showAll();
}
function showBig(n, i){
	document.getElementById('singleinall').style.display = "block";
	document.getElementById('singleinall').style.marginTop = 10+window.pageYOffset+"px";
	//document.getElementById('singleinall').style.marginLeft = docWidth/2-docWidth/5+"px";
	var canv=document.getElementById('myCanvasSingle');
	drawSingle(canv, n, i, 17, docWidth/2.5);
	var bigdescriptiondown=document.getElementById('bigdescriptiondown');
	bigdescriptiondown.innerHTML=population[n][i].join(', ');
	var bigdescription=document.getElementById('bigdescription');
	bigdescription.innerHTML="Fractal #"+i+", ["+n+" population]";
	//document.getElementById('showall').style.overflow="hidden";
}
function hideBig(){
	document.getElementById('singleinall').style.display = "none";
	//document.getElementById('showall').style.overflow="auto";
}
/// Interface ///

function sortf(a, b) {
	if (a[1] < b[1]) return 1;
	else if (a[1] > b[1]) return -1;
	else return 0;
}

function evolution(){

	for(var i=3; i>0; i--){
		oldPopulation[i]=oldPopulation[i-1]; //сюда старую популяцию пихаем
		parents[i]=parents[i-1]; //сюда индексы предков
		crossover[i]=crossover[i-1]; //в каком порядке унаследованы гены (0-первый парент, 1-второй)
		mutations[i]=mutations[i-1]; //какой ген мутировал
		exchanges[i]=exchanges[i-1]; //над этим подумать
	}
	
	oldPopulation[0]=[];
	parents[0]=[];
	crossover[0]=[];
	mutations[0]=[];
	exchanges[0]=[];
	
	for(var n=anglemin; n<=anglemax; n++){
		oldPopulation[0][n]=[];
		for(var i=0; i<PopulationSize; i++){
		oldPopulation[0][n][i]=[];
			for(var j=0; j<n; j++){
				oldPopulation[0][n][i][j]=population[n][i][j];
			}
		}
	}
	
		
	var sizehalf=PopulationSize/2;
	var sizequarter=sizehalf/2;
	var mutation=document.getElementById("mutatepercent").value;
	for(var n=anglemin; n<=anglemax; n++){ //for each populations
	
		parents[0][n]=[];
		crossover[0][n]=[];
		
		var arrayt=[]; //create temp array
		for(var i=0; i<PopulationSize; i++){ //join with fitness for sort
			arrayt[i]=[];
			arrayt[i][0]=population[n][i];
			arrayt[i][1]=fitness[n][i];
			arrayt[i][2]=i; //index of parent for new population;
		}
		arrayt.sort(sortf); //sort
		arrayt.length=sizehalf; //we've got temp array with half of fractals (more adapted individs)
		population[n].length=0;
		fitness[n].length=0;
		
		// crossover //
		for(var i=0; i<sizequarter; i++){
			var i0=i*4;
			var i1=i*4+1;
			var i2=i*4+2;
			var i3=i*4+3;
			
			var removed1=Math.floor(Math.random()*(arrayt.length));
			var parent1f = arrayt.splice(removed1,1);
			var parent1=parent1f[0][0]; //take first parent from temp array
			var removed2=Math.floor(Math.random()*(arrayt.length));
			var parent2f = arrayt.splice(removed2,1);
			var parent2=parent2f[0][0]; //take second parent from temp array
			
			var child1=[];
			var child2=[];
			crossover[0][n][i0]=[];
			crossover[0][n][i1]=[];
			crossover[0][n][i2]=[];
			crossover[0][n][i3]=[];
			parents[0][n][i0]=[];
			parents[0][n][i1]=[];
			parents[0][n][i2]=[];
			parents[0][n][i3]=[];
			for(var j=0; j<n; j++){ //create two children with parent genes (using random shuffle)
				var gen=Math.round(Math.random());
				if(gen==1){
					child1[j]=parent1[j];
					child2[j]=parent2[j];
					crossover[0][n][i2][j]=0;
					crossover[0][n][i3][j]=1;
				}else{
					child1[j]=parent2[j];
					child2[j]=parent1[j];
					crossover[0][n][i2][j]=1;
					crossover[0][n][i3][j]=0;
				}
			}
			
			parents[0][n][i0][0]=parent1f[0][2];
			parents[0][n][i1][0]=parent2f[0][2];
			parents[0][n][i2][0]=parent1f[0][2];
			parents[0][n][i2][1]=parent2f[0][2];
			parents[0][n][i3][0]=parent1f[0][2];
			parents[0][n][i3][1]=parent2f[0][2];
			
			population[n][i0]=parent1; //put them back to population
			population[n][i1]=parent2;
			population[n][i2]=child1;
			population[n][i3]=child2;
				
			fitness[n][i0]=0;
			fitness[n][i1]=0;
			fitness[n][i2]=0;
			fitness[n][i3]=0;
		}
		// crossover //
		
		// mutation //
		mutations[0][n]=[];
		if(mutation>0){
			var m=100/mutation;
			for(var i=0; i<PopulationSize; i++){
				mutations[0][n][i]=null;
				var rnd=Math.floor(Math.random()*(m))+1;
				if(rnd==1){
					var mutatedgene=Math.floor(Math.random()*(n));
					population[n][i][mutatedgene]=randomangl(minm, maxm, stepm);
					mutations[0][n][i]=mutatedgene;
				}
			}
		}
	}
	
	var exchange=document.getElementById("exchangepercent").checked;

	
	if(exchange){
		var n=anglemin;
		while(n<population.length){
			var rnd=Math.round(Math.random());
			var np=n+1;
			if(rnd==1 && (typeof population[np]!="undefined")){
				
				exchanges[0][n]=[];
				exchanges[0][np]=[];
				
				var i1=Math.floor(Math.random() * (PopulationSize));
				var i2=Math.floor(Math.random() * (PopulationSize));
				var tempa1=population[np][i1];
				var tempa2=population[n][i2];
				var indexofexcessgene=Math.floor(Math.random()*(tempa1.length));
				var excessgene=tempa1.splice(indexofexcessgene,1);
				tempa2.splice(indexofexcessgene,0,excessgene[0]);
				population[np][i1]=tempa2;
				population[n][i2]=tempa1;
				
				exchanges[0][n][0]=np;
				exchanges[0][n][1]=i1;
				exchanges[0][n][2]=indexofexcessgene;
				exchanges[0][np][0]=n;
				exchanges[0][np][1]=i2;
				exchanges[0][np][2]=indexofexcessgene;
				
				n+=2;
			}else{
				n++;
			}
		}
	}
	
	//console.log(exchanges);
	
	get2fractals();
	savePopulation();
	saveFitness();
}

	//var hello=document.getElementById('console-log');
	//hello.innerHTML=array.join(', ');