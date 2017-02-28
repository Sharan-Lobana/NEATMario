var config={
	

//the global variables defines here
var BoxRadius :6,
var InputSize :(BoxRadius*2+1)*(BoxRadius*2+1);
var Inputs = InputSize+1,
var  = 6; // Buttonnames  ... check this 
var Population =300;
var DeltaDisjoint =2.0;
var DeltaWeights =0.4;
var DeltaThreshold =1.0;
var StaleSpecies=15;
var MutateConnectionsChance =0.25;
var PerturbChance = 0.90;
var CrossoverChance = 0.75;
var LinkMutationChance = 2.0;
var NodeMutationChance = 0.50;
var BiasMutationChance = 0.40;
var StepSize = 0.1;
var DisableMutationChance = 0.4;
var EnableMutationChance = 0.2;
var TimeoutConstant = 20;
var MaxNodes = 1000000;

	
};

function sigmoid(x){
	return 2/(1+math.exp(-4.9*x))-1
}

module.exports = config;
