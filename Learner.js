var Config = require('./config');
var Genome = require('./Genome');
var Genes = require('./Gene');
var Species = require('./Species');
var Pool = require('./Pool');
var DataStorage = require('./datastorage');
var NeuralNet = require('./NeuralNet');

var Robot = require('robotjs');

var Utility{
	controller: null
}
// 1
Utility.newGeneration = function(){
	Species.cullSpecies(false); // Cull the bottom half of each species
	Pool.rankGlobally();
	Species.removeStaleSpecies();
	Pool.rankGlobally();
	for (var s in Pool.species){
		var species = Pool.species[s];
		Species.calculateAverageFitness(species);
	}
	Species.removeWeakSpecies();
	var sum = Pool.totalAverageFitness();
	var children = {};
	for (var s in Pool.species){
		var species = Pool.species[s];
		var breed = Math.floor(Species.averageFitness / sum * Config.Population) - 1;
		for (var i = 1; i <= breed; i++) {
			children.push(Species.breedChild(species));
		}
	}
	Species.cullSpecies(true) // Cull all but the top member of each species
	while (children.length + Pool.species.length < Config.Population) {
		var index = Math.floor((Math.random() * Pool.species.length) + 1);
		var species = Pool.species[index];
		children.push(Species.breedChild(species));
	}
	for (var c in children) {
		var child = children[c];
		Pool.addToSpecies(child);
	}
	
	Pool.generation += 1;
	
	DataStorage.writeToFile("Backup" + "_" + Pool.generation + "_" + /*forms.gettext(saveLoadFile)*/ Config.filename);
}
// 2
Utility.clearJoypad = function(){
	//Utility.controller = {};
	for (var b in Config.ButtonNames) {
		//controller["P1 " .. ButtonNames[b]] = false;
		Robot.keyToggle(Config.ButtonNames[b], 'up');
	}
	//joypad.set(controller);
}
// 3
Utility.initializeRun = function(){
	savestate.load(Filename);
	//var rightmost = 0;
	Pool.currentFrame = 0;
	var timeout = Config.TimeoutConstant;
	Utility.clearJoypad();
	
	var species = Pool.species[Pool.currentSpecies];
	var genome = species.genomes[Pool.currentGenome];
	NeuralNet.generateNetwork(genome);
	Utility.evaluateCurrent();
}
// 4
Utility.evaluateCurrent = function(){
	var species = Pool.species[Pool.currentSpecies];
	var genome = species.genomes[Pool.currentGenome];

	var inputs = getInputs();  // getInputs() must be modified, <Adapter>.getInputs() must be present where Adapter.js is the file responsible for getting inputs
	controller = NeuralNet.evaluateNetwork(genome.network, inputs);  // inputs is only used here 
	Utility.controller = controller;

	if (controller["P1 Left"] && controller["P1 Right"]) {
		controller["P1 Left"] = false;
		controller["P1 Right"] = false;
	}
	if (controller["P1 Up"] && controller["P1 Down"]) {
		controller["P1 Up"] = false;
		controller["P1 Down"] = false;
	}

	for (var b in Config.ButtonNames) {
		if(controller["P1 " + Config.ButtonNames[b]] == true){
			Robot.keyToggle(Config.ButtonNames[b], 'down');
		}
	}
	//joypad.set(controller);
}

if (Pool == null) {
	Pool.initializePool();
	Utility.initializeRun();
}
// 5
Utility.nextGenome = function(){
	Pool.currentGenome += 1;
	if (Pool.currentGenome > Pool.species[Pool.currentSpecies].genomes.length) {
		Pool.currentGenome = 1;
		Pool.currentSpecies += 1;
		if (Pool.currentSpecies > Pool.species.length) {
			Utility.newGeneration();
			Pool.currentSpecies = 1;
		}
	}
}
// 6
Utility.fitnessAlreadyMeasured = function(){
	var species = Pool.species[Pool.currentSpecies];
	var genome = species.genomes[Pool.currentGenome];
	
	return genome.fitness != 0;
}
// 7
Utility.startUtility = function(){
	DataStorage.writeToFile("temp.pool");  

	//event.onexit(onExit);
	/*if (onGameEnd){
		forms.destroy(form);
	}*/

	/*form = forms.newform(200, 260, "Fitness")
	maxFitnessLabel = forms.label(form, "Max Fitness: " .. math.floor(pool.maxFitness), 5, 8)
	showNetwork = forms.checkbox(form, "Show Map", 5, 30)
	showMutationRates = forms.checkbox(form, "Show M-Rates", 5, 52)
	restartButton = forms.button(form, "Restart", initializePool, 5, 77)
	saveButton = forms.button(form, "Save", savePool, 5, 102)
	loadButton = forms.button(form, "Load", loadPool, 80, 102)
	saveLoadFile = forms.textbox(form, Filename .. ".pool", 170, 25, nil, 5, 148)
	saveLoadLabel = forms.label(form, "Save/Load:", 5, 129)
	playTopButton = forms.button(form, "Play Top", playTop, 5, 170)
	hideBanner = forms.checkbox(form, "Hide Banner", 5, 190) */

	while (!gameStateOver) {

		var species = Pool.species[Pool.currentSpecies];
		var genome = species.genomes[Pool.currentGenome];
	
		/*if (forms.ischecked(showNetwork)) {
			displayGenome(genome);
		}*/
	
		if (Pool.currentFrame % 2 == 0) {
			Utility.evaluateCurrent();
		}

		//joypad.set(controller);
		for (var b in Config.ButtonNames) {
			if(Utility.controller["P1 " + Config.ButtonNames[b]] == true){
				Robot.keyToggle(Config.ButtonNames[b], 'down');
			}
		}

		//getPositions();
		var timeout;
		if (Config.onLevelEnd) {    // rightmost gives the last frame of the level
			timeout = Config.TimeoutConstant;
		}
	
		timeout = timeout - 1;
	
		var timeoutBonus = Pool.currentFrame / 4;
		if (timeout + timeoutBonus <= 0) {
			var fitness = rightmost - pool.currentFrame / 2;  // rightmost gives the last frame of the level
			if (Config.onLevelEnd) {                
				fitness += 1000;
			}
			if (fitness == 0) {
				fitness = -1;
			}
			genome.fitness = fitness;
		
			if (fitness > Pool.maxFitness) {
				Pool.maxFitness = fitness;
				//forms.settext(maxFitnessLabel, "Max Fitness: " .. Math.floor(pool.maxFitness));
				DataStorage.writeToFile("Backup" + "_" + Pool.generation + "_" + /*forms.gettext(saveLoadFile)*/ Config.filename);
			}
		
			console.writeline("Generation: " + Pool.generation + " Species: " + Pool.currentSpecies + " Genome: " + 
				Pool.currentGenome + " Fitness: " + fitness);
			Pool.currentSpecies = 1;
			Pool.currentGenome = 1;
			while (Utility.fitnessAlreadyMeasured()) {
				Utility.nextGenome();
			}
			Utility.initializeRun();
		}

		var measured = 0;
		var total = 0;
		
		for (var key in Pool.species) {
			var species = Pool.species[key];
			for (var k in species.genomes) {
				var genome = species.genomes[k];
				total = total + 1;
				if (genome.fitness != 0) {
					measured = measured + 1;
				}
			}
		}
		/*if (!forms.ischecked(hideBanner)) {
			gui.drawText(0, 0, "Gen " .. pool.generation .. " species " .. pool.currentSpecies .. " genome " .. 
				pool.currentGenome .. " (" .. Math.floor(measured/total*100) .. "%)", 0xFF000000, 11);
			gui.drawText(0, 12, "Fitness: " .. math.floor(rightmost - (pool.currentFrame) / 2 - 
				(timeout + timeoutBonus)*2/3), 0xFF000000, 11);
			gui.drawText(100, 12, "Max Fitness: " .. math.floor(pool.maxFitness), 0xFF000000, 11);
		}*/
		
		Pool.currentFrame += 1;

		//emu.frameadvance();
	}
}

module.exports = Utility;