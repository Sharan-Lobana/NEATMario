var Config={
	

//the global variables defines here
BoxRadius :6,
InputSize:169, //BoxRadius*2+1)*(BoxRadius*2+1),

Inputs :2,//InputSize+1,
Outputs :1,

ButtonNames : [
		"A",
		"Up",
		"Down",
		"Left",
		"Right",
	],

Population :50,
DeltaDisjoint :2.0,
DeltaWeights :0.4,
DeltaThreshold :1.0,
StaleSpecies :15,
MutateConnectionsChance :0.25,
PerturbChance :0.90,
CrossoverChance :0.75,
LinkMutationChance :2.0,
NodeMutationChance :0.50,
BiasMutationChance :0.40,
StepSize :0.1,
DisableMutationChance :0.4,
EnableMutationChance :0.2,
TimeoutConstant :20,
MaxNodes :1000
	
};

Config.sigmoid = function(x){
	return 2/(1+math.exp(-4.9*x))-1
}

