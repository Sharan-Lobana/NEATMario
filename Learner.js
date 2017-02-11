//1
function newGeneration(){
	cullSpecies(false); // Cull the bottom half of each species
	rankGlobally();
	removeStaleSpecies();
	rankGlobally();
	for (var s in pool.species){
		var species = pool.species[s];
		calculateAverageFitness(species);
	}
	removeWeakSpecies();
	var sum = totalAverageFitness();
	var children = {};
	for (var s in pool.species){
		var species = pool.species[s];
		var breed = Math.floor(species.averageFitness / sum * Population) - 1;
		for (var i = 1; i <= breed; i++) {
			children.push(breedChild(species));
		}
	}
	cullSpecies(true) // Cull all but the top member of each species
	while (children.length + pool.species.length < Population) {
		var index = Math.floor((Math.random() * pool.species.length) + 1);
		var species = pool.species[index];
		children.push(breedChild(species));
	}
	for (var c in children) {
		var child = children[c];
		addToSpecies(child);
	}
	
	pool.generation = pool.generation + 1;
	
	writeFile("backup." .. pool.generation .. "." .. forms.gettext(saveLoadFile));
}
// 2
function initializePool(){
	var pool = newPool();

	for (var i = 1; i <= Population; i++) {
		var basic = basicGenome();
		addToSpecies(basic);
	}

	initializeRun();
}
// 3
function clearJoypad(){
	var controller = {};
	for (var b in ButtonNames) {
		controller["P1 " .. ButtonNames[b]] = false;
	}
	joypad.set(controller);
}
// 4
function initializeRun(){
	savestate.load(Filename);
	var rightmost = 0;
	pool.currentFrame = 0;
	var timeout = TimeoutConstant;
	clearJoypad();
	
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	generateNetwork(genome);
	evaluateCurrent();
}
// 5
function evaluateCurrent(){
	local species = pool.species[pool.currentSpecies]
	local genome = species.genomes[pool.currentGenome]

	var inputs = getInputs();
	var controller = evaluateNetwork(genome.network, inputs);
	
	if (controller["P1 Left"] && controller["P1 Right"]) {
		controller["P1 Left"] = false;
		controller["P1 Right"] = false;
	}
	if (controller["P1 Up"] && controller["P1 Down"]) {
		controller["P1 Up"] = false;
		controller["P1 Down"] = false;
	}

	joypad.set(controller);
}

if (pool == null) {
	initializePool();
}
// 6
function nextGenome(){
	pool.currentGenome = pool.currentGenome + 1;
	if (pool.currentGenome > pool.species[pool.currentSpecies].genomes.length) {
		pool.currentGenome = 1;
		pool.currentSpecies = pool.currentSpecies+1;
		if (pool.currentSpecies > pool.species.length) {
			newGeneration();
			pool.currentSpecies = 1;
		}
	}
}
// 7
function fitnessAlreadyMeasured(){
	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	
	return genome.fitness != 0;
}
// 8
writeFile("temp.pool");

event.onexit(onExit);

while (true) {

	var species = pool.species[pool.currentSpecies];
	var genome = species.genomes[pool.currentGenome];
	
	if (forms.ischecked(showNetwork)) {
		displayGenome(genome);
	}
	
	if (pool.currentFrame % 5 == 0) {
		evaluateCurrent();
	}

	joypad.set(controller);

	getPositions();
	if (marioX > rightmost) {    // rightmost gives the last frame of the level
		rightmost = marioX;
		timeout = TimeoutConstant;
	}
	
	timeout = timeout - 1;
	
	
	var timeoutBonus = pool.currentFrame / 4;
	if (timeout + timeoutBonus <= 0) {
		var fitness = rightmost - pool.currentFrame / 2;
		if (rightmost > 4816) {                // 4816 should be replaced by width of the level
			fitness = fitness + 1000;
		}
		if (fitness == 0) {
			fitness = -1;
		}
		genome.fitness = fitness;
		
		if (fitness > pool.maxFitness) {
			pool.maxFitness = fitness
			//forms.settext(maxFitnessLabel, "Max Fitness: " .. Math.floor(pool.maxFitness));
			writeFile("backup." .. pool.generation .. "." .. forms.gettext(saveLoadFile));
		}
		
		console.writeline("Gen " .. pool.generation .. " species " .. pool.currentSpecies .. " genome " .. 
			pool.currentGenome .. " fitness: " .. fitness);
		pool.currentSpecies = 1;
		pool.currentGenome = 1;
		while (fitnessAlreadyMeasured()) {
			nextGenome();
		}
		initializeRun();
	}

	var measured = 0;
	var total = 0;
	/*for (_,species in pairs(pool.species)) {
		for (_,genome in pairs(species.genomes)) {
			total = total + 1;
			if (genome.fitness != 0) {
				measured = measured + 1;
			}
		}
	}*/
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
	/*if (!forms.ischecked(hideBanner)) {
		gui.drawText(0, 0, "Gen " .. pool.generation .. " species " .. pool.currentSpecies .. " genome " .. 
			pool.currentGenome .. " (" .. Math.floor(measured/total*100) .. "%)", 0xFF000000, 11);
		gui.drawText(0, 12, "Fitness: " .. math.floor(rightmost - (pool.currentFrame) / 2 - 
			(timeout + timeoutBonus)*2/3), 0xFF000000, 11);
		gui.drawText(100, 12, "Max Fitness: " .. math.floor(pool.maxFitness), 0xFF000000, 11);
	}*/
		
	pool.currentFrame = pool.currentFrame + 1;

	//emu.frameadvance();
}