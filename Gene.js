

var Gene = function(){
	var into = 0;
	var out = 0;
  	var	weight = 0.0;
	var enabled = true;
	var innovation = 0;

	return{
		'into':into,
		'out':out,
		'weight':weight,
		'enabled':enabled,
		'innovation':innovation,
	}
};

function copyGene(gene){
	
  	gene2 = new Gene();
	gene2.into = gene.into;
	gene2.out = gene.out;
	gene2.weight = gene.weight;
	gene2.enabled = gene.enabled;
	gene2.innovation = gene.innovation;
	return gene2;
}
