var xor = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
var xorindex = -1;
// addfa
var getInputs = function(){
	xorindex = (xorindex + 1)%4;
	console.log("\ngetInputs is executed");
	return xor[xorindex];
}

var Utility = function(){
	return {
	controller: {A: false, Left: false, Right: false, Up: false, Down: false},
	}

}
// 1
 var newGeneration = function(pool){
	cullSpecies(false,pool); // Cull the bottom half of each species
	rankGlobally(pool);
	removeStaleSpecies(pool);
	rankGlobally(pool);
	for (var s in pool.species){
		var species = pool.species[s];
		calculateAverageFitness(species);
	}
	removeWeakSpecies();
	var sum = totalAverageFitness(pool);
	var children = [];
	for (var s in pool.species){
		var species = pool.species[s];
		var breed = Math.floor(species.averageFitness / sum * Config.Population) - 1;
		for (var i = 1; i <= breed; i++) {
			children.push(breedChild(species));
		}
	}
	cullSpecies(true,pool) // Cull all but the top member of each species
	while (children.length + pool.species.length < Config.Population) {
		var index = Math.floor((Math.random() * pool.species.length));
		var species = pool.species[index];
		children.push(breedChild(species));
	}
	for (var c in children) {
		var child = children[c];
		pool.addToSpecies(child);
	}

	pool.generation += 1;
	// writeToFile("Backup" + "_" + pool.generation + "_" + /*forms.gettext(saveLoadFile)*/ Config.filename);
	console.log("\nnewGeneration is executed");
}
// 2
var clearJoypad = function(utility){
	for(var i in utility.controller) {
		utility.controller[i] = False;
	}
}

/*var initializeRun = function(pool,utility){
	// savestate.load(Filename);
	var rightmost = 0;
	pool.currentFrame = 0;
	var timeout = Config.TimeoutConstant;
	clearJoypad(utility);

	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	generateNetwork(genome);
	evaluateCurrent(pool);
}*/
// 4
var evaluateCurrent = function(pool){
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	var sqerror = 0.0;
	var misclassifications = 4;
	for(var index = 0; index < 4; index ++)
	{
	var inputs = getInputs();  // getInputs() must be modified, <Adapter>.getInputs() must be present where Adapter.js is the file responsible for getting inputs
	var trueOutput = inputs[2];
	inputs = inputs.slice(0,2);
	var predOutput = evaluateNetwork(genome,genome.network, inputs);  // inputs is only used here
	sqerror += Math.pow(predOutput-trueOutput,2);
	if(Math.abs(predOutput - trueOutput) < 0.5)
		misclassifications -= 1;
	}
	genome.fitness = 1/(sqerror<0.1?0.1:sqerror);

	// Utility.controller = controller;

	// if (controller["P1 Left"] && controller["P1 Right"]) {
	// 	controller["P1 Left"] = false;
	// 	controller["P1 Right"] = false;
	// }
	// if (controller["P1 Up"] && controller["P1 Down"]) {
	// 	controller["P1 Up"] = false;
	// 	controller["P1 Down"] = false;
	// }

	// for (var b in Config.ButtonNames) {
	// 	if(controller["P1 " + Config.ButtonNames[b]] == true){
	// 		Robot.keyToggle(Config.ButtonNames[b], 'down');
	// 	}
	// }
	// //joypad.set(controller);

	console.log(
		"\n\n Generation: "+pool.generation+
		"\n\n Species: "+ pool.currentSpecies+
		"\n\n Genome: "+ pool.currentGenome+
		"\n\n SquareError: "+sqerror+
		"\n\n Misclassifications: "+misclassifications
	);
	console.log("\nevaluateCurrent is executed");
	return misclassifications;
}

var	pool = initializePool();
	// initializeRun();

// 5
var nextGenome = function(pool){
	pool.currentGenome += 1;
	if (pool.currentGenome > pool.species[pool.currentSpecies].genomes.length) {
		pool.currentGenome = 1;
		pool.currentSpecies += 1;
		if (pool.currentSpecies > pool.species.length) {
			newGeneration(pool);
			pool.currentSpecies = 1;
		}
	}
}
// 6
var fitnessAlreadyMeasured = function(pool){
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];

	return genome.fitness != 0;
}
// 7
var startUtility = function(pool){
	// DataStorage.writeToFile("temp.pool");

var mycounter = 1;
while (!pool.shouldStop && mycounter < 3) {
		mycounter += 1;
		var species = pool.species[pool.currentSpecies];
		var genome = species.genomes[pool.currentGenome];

		/*if (forms.ischecked(showNetwork)) {
			displayGenome(genome);
		}*/


		// if (pool.currentFrame % 2 == 0) {
		generateNetwork(genome);
		var misclassifications = evaluateCurrent(pool);
		// }
		if(!misclassifications) {
			// console.log(genome);
			console.log("\n\n\nTHE POOL SHOULD STOP\n\n\n");
			pool.shouldStop = !0;
		}

		//joypad.set(controller);
		// for (var b in Config.ButtonNames) {
		// 	if(Utility.controller["P1 " + Config.ButtonNames[b]] == true){
		// 		Robot.keyToggle(Config.ButtonNames[b], 'down');
		// 	}
		// }

		//getPositions();
		// var timeout;
		// if (Config.onLevelEnd) {    // rightmost gives the last frame of the level
		// 	timeout = Config.TimeoutConstant;
		// }

		// timeout = timeout - 1;

		// var timeoutBonus = pool.currentFrame / 4;
		// if (timeout + timeoutBonus <= 0) {
		// 	var fitness = rightmost - pool.currentFrame / 2;  // rightmost gives the last frame of the level
		// 	if (Config.onLevelEnd) {
		// 		fitness += 1000;
		// 	}
		// 	if (fitness == 0) {
		// 		fitness = -1;
		// 	}
		// 	genome.fitness = fitness;

			if (genome.fitness > pool.maxFitness) {
				pool.maxFitness = fitness;
				//forms.settext(maxFitnessLabel, "Max Fitness: " .. Math.floor(pool.maxFitness));
				// DataStorage.writeToFile("Backup" + "_" + pool.generation + "_" + /*forms.gettext(saveLoadFile)*/ Config.filename);
			}

			// console.writeline("Generation: " + pool.generation + " Species: " + pool.currentSpecies + " Genome: " +
			// 	pool.currentGenome + " Fitness: " + fitness);
			pool.currentSpecies = 0;
			pool.currentGenome = 0;
			while (fitnessAlreadyMeasured(pool)) {
				nextGenome(pool);
			}
			// initializeRun();
		// }

		var measured = 0;
		var total = 0;

		for (var key in pool.species) {
			var species = pool.species[key];
			for (var k in species.genomes) {
				var genome = species.genomes[k];
				total = total + 1;
				if (genome.fitness != 0) {
					measured = measured + 1;
				}
			}
		}
		pool.currentFrame += 1;
	}
}
startUtility(pool);
