var inputArray = [];
for(var i = 0; i < 15; i++){
	var row = [];
	for(var j = 0; j < 20; j++){
		row.push(0);
	}
	inputArray.push(row);
}

function setInputArrayToZero() {
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 20; j++)
		inputArray[i][j] = 0;
	}	
}
//console.log("HACKWORLD /////");
// hackWorld = $("#world");
hackLeftWorld = $("#world").css("left"); 
/*setInterval(function() {
	},
	100
);*/

setInterval(
	function() {
		setInputArrayToZero();
		var hackLeftWorld = $("#world").css("left");
		hackLeftWorld = Math.floor(hackLeftWorld.substr(0,hackLeftWorld.length-2));
		console.log(hackLeftWorld);
		$("#world").find(".matter").each(function(){
			// console.log(index);
			var localLeft = $(this).css("left")
			localLeft = Math.floor(localLeft.substr(0,localLeft.length-2));
			var localBottom = $(this).css("bottom");
			localBottom = Math.floor(localBottom.substr(0,localBottom.length-2));
			if(localLeft+hackLeftWorld+16 >= 0 && localLeft+hackLeftWorld<625) {
				inputArray[14 - (localBottom/32) ][Math.floor((localLeft+hackLeftWorld+16)/32)] = 1;
			}
			
		});
		$("#world").find(".figure").each(function() {
			var localLeft = $(this).css("left")
			localLeft = Math.floor(localLeft.substr(0,localLeft.length-2));
			var localBottom = $(this).css("bottom");
			localBottom = Math.floor(localBottom.substr(0,localBottom.length-2));
			if(localLeft+hackLeftWorld+16 >= 0 && localLeft+hackLeftWorld<625) {
				inputArray[14 - (localBottom/32) ][Math.floor((localLeft+hackLeftWorld+16)/32)] = -1;
			}
		});
	},
	5000
);
// var localstring = ""

setInterval(function(){
	for(var i=0; i<15;i++){
		console.log(i);
		console.log(inputArray[i]);
	}
	},
	10000
);