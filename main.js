

fetch('./loan_data.json')
.then(res => res.json())
.then(function(data){
	parentFunction(data);
	console.log("Parent Function Complete");
	// cropSVG();
});


function parentFunction(jsondata){


console.log("the data is")
console.log(jsondata)


const nodeColor = "#7d94b5"; // decision node color
const trueColor = "#909979"; // base green
const trueColor2 = "#ccd9ab"; // green + white mix
const falseColor = "#bd0909"; // base red
const falseColor2 = "#f70c0c"; // red + white mix
const nanColor = "#703f37"; // base brown (for leaves that could be true or false but model's tree depth was limited)
const nanColor2 = "#c7631c"; // brown + white mix

const mouseoverColor = "#9ebce6"; // decision node mouseover color

const removeTime = 750;
const createTime = 1500;
const mouseoverTime = 100;
const revealTime = 750;


// below did not work as intended...
//
// const removeTran = d3.transition().ease(d3.easeCubic).duration(removeTime);
// const createTran = d3.transition().ease(d3.easeCubic).duration(createTime);
// const mouseoverTran = d3.transition().ease(d3.easeCubic).duration(mouseoverTime);

const largeRadius = 16;
const smallRadius = 12;

let closed = false;

let mouseX = 0;
let mouseY = 501.975;
//these global variables I should later get via closure
let buttonTracker = [];
let rootNode = d3.hierarchy(jsondata, d=>d.children);
var pathLinks = rootNode.links(); 
var updatePathLinks;

var circleLinks = rootNode.descendants();
var updateCircleLinks;

var textLinks = rootNode.descendants();
var updateTextLinks;


let dim = {

	'viewBox': `-125 25 ${window.screen.width} ${window.screen.height}`,
	// 'viewBox': '-10 -10 100 100',
	'width': window.screen.width*0.85, 
	'height': window.screen.height*1.15, 
	'margin': 0
};

let html = d3.select('html').style("background-color", "#abac9f");

let svg = d3.select('#chart').append('svg')
	.attrs(dim);

// let svg2 = d3.select('svg');

// cropSVG(svg);



function cropSVG() {
	const bbox = d3.select('g').node().getBBox();
	// const bbox = svgElem.node().getBBox();
	// svgElem.setAttribute("width", bbox.width);
	// svgElem.setAttribute("height", bbox.height);
	console.log("bbox:")
	console.log(bbox);
	d3.select('svg').node().setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
	d3.select('svg').node().setAttribute("width", Math.max(bbox.width, window.screen.width));
	d3.select('svg').node().setAttribute("height", bbox.height);
	
}



document.querySelector("#chart").classList.add("center");




let g = svg.append('g');
			// .attr('transform', 'translate(140, 50)');

	// let layout = d3.tree().size([dim.height-50, dim.width-320]);
	let layout = d3.tree().size([dim.height, dim.width]);

	layout(rootNode);
	console.log(rootNode.links());
	console.log("----------------------");
	console.log(rootNode.descendants());
	//console.log(rootNode.descendants());

//first lets create a path 
let lines = g.selectAll('path');


function update(data){ //update paths


let group =g.selectAll('path')
	.data(data, (d,i) => d.target.data.id)
	.join(
	function(enter){
		return enter.append('path')
					.attrs({
						'd': d3.linkHorizontal()
						.x(d => mouseX)
						.y(d => mouseY),
						'fill':'none',
						'stroke':'white'
					})
					.call(function(path) {
					path = path.transition().ease(d3.easeCubic).duration(createTime)
					.attr('d', d3.linkHorizontal()
						.x(d => d.y)
						.y(d => mouseY))
					.transition().ease(d3.easeCubic).duration(createTime)
					.attr('d', d3.linkHorizontal()
						.x(d => d.y)
						.y(d => d.x))
					.attr("id", function(d,i){return "path"+i}
						)});
	},
	function(update){
		return update;
	},
	function(exit){

		// PATH REMOVAL TRANSITION
		return exit.call(path => path.transition().ease(d3.easeCubic).duration(removeTime).remove()
												.attr('d', d3.linkHorizontal()
															.x(d => d.y)
															.y(d =>mouseY)
															)
												.transition().ease(d3.easeCubic).duration(removeTime).remove()
												.attr('d', d3.linkHorizontal()
															.x(d => mouseX)
															.y(d => mouseY)
															)
												);
	}


);// PATH CREATION TRANSITION
//moved call to enter function
// .call(function(path) {
// path = path.transition().ease(d3.easeCubic).duration(createTime)
// .attr('d', d3.linkHorizontal()
// .x(d => d.y)
// .y(d => mouseY));
// return path.transition().ease(d3.easeCubic).duration(createTime)
// .attr('d', d3.linkHorizontal()
// .x(d => d.y)
// .y(d => d.x))
// .attr("id", function(d,i){return "path"+i}
// )});


}
update(pathLinks); //rootNode.links()



function updateCircles(data){
	g.selectAll('circle')
	.data(data, (d) => d.data.id)
	.join(
		function(enter){
			return enter.append('circle')
						.attrs({ // HOW IT IS STORED WHEN SHRUNK
							'cx':(d)=> mouseX,
							'cy':(d) => mouseY,
							'r':smallRadius,
							'fill':(d) => {
								if(d.children == undefined){
									//check if true or false
									if (d.data.value == true) {
										return trueColor;
									} else if (d.data.value == false) {
										return falseColor;
									} else {
										return nanColor;
									}
								}
								return nodeColor
							},
							'id': (d,i) =>d.data.id,
							'class':'sel'
						})
						.call(circle => circle.transition('moveCircle').ease(d3.easeCubic).duration(createTime)
							.attr('cx', (d)=>d.y)
							.attr('cy', (d)=>mouseY)
							.transition().ease(d3.easeCubic).duration(createTime)
							.attr('cy', (d)=>d.x))
		},
		function(update){
			return update;
		},
		function(exit){

			return exit.call(path => path.transition().ease(d3.easeCubic).duration(removeTime).remove()
			.attrs({
				// 'cx':(d) =>mouseX,
				'cy':(d) => mouseY
				// 'r':(d) => 0
			})
			.transition().ease(d3.easeCubic).duration(removeTime).remove().attrs({
				'cx':(d) => mouseX,
				'r':(d) => 0
			}));

		}


	)

	//moved call to enter function
	// .call(circle => circle.transition().ease(d3.easeCubic).duration(createTime)
	// .attr('cx', (d)=>d.y)
	// .attr('cy', (d)=>mouseY)
	// .transition().ease(d3.easeCubic).duration(createTime)
	// .attr('cy', (d)=>d.x))
	

	.on('mouseover', function(d){
	d3.select(this)
		.attrs({
			'fill': (d)=>{
				if (d.children==undefined) {
					if (d.data.value == true) {
						return trueColor
					} else if (d.data.value == false) {
						return falseColor
					} else {
						return nanColor
					}
				}
				return mouseoverColor
			},

		})
		.transition('circleColor').ease(d3.easeCubic).duration(mouseoverTime).attr('r', (d)=>{
			if (d.children==undefined) {
				return smallRadius
			}
			return largeRadius
		});
	})
	.on('mouseout', function(d){
		d3.select(this)
			.attr('fill', (d)=>{
				if(d.children ==undefined){
					if (d.data.value == true) {
						return trueColor
					} else if (d.data.value == false) {
						return falseColor
					} else {
						return nanColor
					}
				}
				return nodeColor
			})
			.transition('circleColor').ease(d3.easeCubic).duration(mouseoverTime).attr('r', smallRadius)

	})
	.on('click', async function(d){

		// console.log("x value:")
		// console.log(d3.select(this)["_groups"][0][0]["attributes"].);

		let buttonId = d3.select(this)["_groups"][0][0]["attributes"].id.value;
		mouseX = d3.select(this)["_groups"][0][0]["attributes"].cx.value;
		mouseY = d3.select(this)["_groups"][0][0]["attributes"].cy.value;
		//check to see if button already exists aka has been clicked
		//if it does, we need to send that data to update function
		//and remove that object

		let checkButtonExists = buttonTracker.filter(button => button.buttonId == buttonId);
		// console.log(checkButtonExists);

		var valueArray = await processedlinks(d.links());
		// console.log("valueArray");
		// console.log(d.links()); 

		updatePathLinks = pathLinks.filter(function(item){
				 return !valueArray.includes(item.target.data.id); 
		});
		// console.log(updatePathLinks);

		//now run the filter to get unfiltered items
		var clickedPathData = pathLinks.filter(function(item){
			return valueArray.includes(item.target.data.id);
			});


		updateCircleLinks = circleLinks.filter(function(item){
					return !valueArray.includes(item.data.id);
		});
		// console.log("update circle links");
		// console.log(updateCircleLinks);

		var clickedCircleData = circleLinks.filter(function(item){
					return valueArray.includes(item.data.id);
		});
		// console.log("clicked circle data");
		// console.log(clickedCircleData);
		
		
		updateTextLinks = textLinks.filter(function(item){
					return !valueArray.includes(item.data.id);
		});

		var clickedTextData = textLinks.filter(function(item){
					return valueArray.includes(item.data.id);
		});
		console.log("button tracker");
		console.log(buttonTracker);
		if(checkButtonExists[0]!=undefined){
			// console.log("button exists")
				//also remove this item from button tracker
			buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);
			
			//handle path update
			// updateLinks = checkButtonExists[0].buttonPathData;
			pathLinks = checkButtonExists[0].buttonPathData.concat(pathLinks);
			// console.log("path links:")
			// console.log(pathLinks);
			update(pathLinks);


				//handlecircle update
				// updateCirc = checkButtonExists[0].buttonCircleData;
			circleLinks = checkButtonExists[0].buttonCircleData.concat(circleLinks);
				updateCircles(circleLinks);

				//handle text update

				textLinks =checkButtonExists[0].buttonTextData.concat(textLinks);
				updateText(textLinks);

				return;

		} else { 
		buttonTracker.push({
			 buttonId:buttonId,
			 buttonPathData:clickedPathData,
			 buttonCircleData:clickedCircleData,
			 buttonTextData:clickedTextData
		});
		}
		update(updatePathLinks);
		updateCircles(updateCircleLinks);
		updateText(updateTextLinks);
		//now we push the circleData to an array

		
		async function processedlinks(dlinks) {
		var valueArray = [];
	
			return new Promise((resolve, reject)=>{
					dlinks.forEach(async(element) =>{
						valueArray.push(element.target.data.id); 
					});
					resolve(valueArray);
			});
		}

		pathLinks = updatePathLinks;
		circleLinks = updateCircleLinks;
		textLinks = updateTextLinks;


	});
	

	// type dataPoint = {
	// 	Gender: string;
	// 	Married: boolean;
	// 	Dependents: double;
	// 	Education: string;
	// 	Self_Employed: double;
	// 	Applicant_Income: double;
	// 	Coapplicant_Income: double;
	// 	Loan_Amount: double;
	// 	Loan_Amount_Term: double;
	// 	Credit_History: double;
	// 	Property_Area: string;
	// 	Loan_Status: boolean;
	// 	Nodes: string[];
	// };

	function DP(Gender, Married, Dependents, Education, 
		Self_Employed, Applicant_Income, Coapplicant_Income, 
		Loan_Amount, Loan_Amount_Term, Credit_History, 
		Property_Area, Nodes) {

		this.Gender = Gender;
		this.Married = Married;
		this.Dependents = Dependents;
		this.Education = Education;
		this.Self_Employed = Self_Employed;
		this.Applicant_Income = Applicant_Income;
		this.Coapplicant_Income = Coapplicant_Income;
		this.Loan_Amount = Loan_Amount;
		this.Loan_Amount_Term = Loan_Amount_Term;
		this.Credit_History = Credit_History;
		this.Property_Area = Property_Area;
		this.Nodes = Nodes;

	}

	
	// fetch('./dps.json')
	// .then(res => res.json())
	// .then(function(data){
	// });

	d3.select("#generator").on("click", async function(d) {
		// updateCircles(rootNode.descendants());
		// fetch('./dps.json')
		// .then(res => res.json())
		// .then(function(data){
		// 	addDP(data);
		// });

		mouseX = rootNode.y;
		mouseY = rootNode.x;
		addDP();
	})

	function generateDP(data) {
		// console.log(Object.keys(data).length);
		var dp = data;
		// var dp = data[319];
		// var dp = data[1];

		dp.Gender = dp.Gender
		.replace("Female", 0)
		.replace("Male", 1);

		dp.Dependents = dp.Dependents
		.replace("3+", 3);

		dp.Married = dp.Married
		.replace("No", 0)
		.replace("Yes", 1);

		dp.Education = dp.Education
		.replace("Graduate", 0)
		.replace("Not Graduate", 1);

		dp.Self_Employed = dp.Self_Employed
		.replace("No", 0)
		.replace("Yes", 1);

		dp.Property_Area = dp.Property_Area
		.replace("Rural", 0)
		.replace("Semiurban", 1)
		.replace("Urban", 2);

		// dp.Loan_Status = dp.Loan_Status
		// .replace("N", 0)
		// .replace("Y", 1);

		dp.Nodes = [];

		
		// var dp = new DP("Male", "Yes", 0, "Graduate", 
		// 	"No", 3246, 1417, 
		// 	138, 360, 1, 
		// 	"Semiurban", "Y", []);
		console.log("dp:");
		console.log(dp);
		return dp;
	}

	// addDP();
	async function addDP() {
		// console.log(data);
		console.log(document.getElementById('Gender').value);
		data = new DP(
			document.getElementById('Gender').value,
			document.getElementById('Married').value,
			document.getElementById('Dependents').value,
			document.getElementById('Education').value,
			document.getElementById('Self_Employed').value,
			document.getElementById('Applicant_Income').value,
			document.getElementById('Coapplicant_Income').value,
			document.getElementById('Loan_Amount').value,
			document.getElementById('Loan_Amount_Term').value,
			document.getElementById('Credit_History').value,
			document.getElementById('Property_Area').value
		);
		console.log(data)
		dp = generateDP(data);
		console.log("data here");
		console.log(rootNode);
		// console.log(rootNode.children[0]);
		var node = rootNode;
		let runNum = 1;
		
		while (node != "end") {
			runNum++;
			console.log(dp.Nodes);
			dp.Nodes.push(node);
			node = branchOut(dp, node, runNum);
		}

		d3.selectAll("circle")
			.transition().ease(d3.easeCubic)
			.delay(0)
			.duration(removeTime)
			.attr('fill', function(d) {
				if (d.children == undefined) {
					if (d.data.value == true) {
						return trueColor;
					} else if (d.data.value == false) {
						return falseColor;
					} else {
						return nanColor;
					}
				} else {
					return nodeColor;
				}
			});

		setTimeout(function() {
			updateCircles([rootNode]);
			
			update([]);
			updateText([rootNode.descendants()[0]]);
		}, removeTime)


		setTimeout(function() {
			updateCircles(dp.Nodes);
			runNum = 1;
			dp.Nodes.forEach(function(node) {
				d3.select("#"+node.data.id)
				.transition().ease(d3.easeCubic)
				.delay(createTime*2 + revealTime*runNum)
				.duration(revealTime)
				.attr('fill', function(d) {
					if (d.children == undefined) {
						if (d.data.value == true) {
							return trueColor2;
						} else if (d.data.value == false) {
							return falseColor2;
						} else {
							return nanColor2;
						}
					}
					return 'white';
				});
				runNum++;

			})
			// console.log(rootNode.links().filter(function(item) {
			// 	return dp.Nodes.includes(item.source);
			// }));
			update(rootNode.links().filter(function(item) {
				return (dp.Nodes.includes(item.source) && dp.Nodes.includes(item.target));
			}));

			// updateText()
			// console.log(rootNode.descendants());
			updateText(rootNode.descendants().filter(function(item) {
				return (dp.Nodes.includes(item));
			}));
		}, removeTime + removeTime*3)

		// update(dp.Nodes.links());
		// updatePathLinks(rootNode.links().filter);
		// branchOut(generateDP(), rootNode);
	}

	function branchOut(dp, node, runNum) {
		if (node.children == undefined) {
			// console.log(dp.Loan_Status);
			// console.log(node.datas.value);
			return "end";
		}
		else if (appliesToDP(node.data.name, dp)) {

			// d3.select("#"+node.children[0].data.id)
			// .transition().ease(d3.easeCubic)
			// .delay(revealTime*runNum)
			// .duration(revealTime)
			// .attr('fill', 'white');
			console.log("op1");
			return node.children[0];
		} else {
			// d3.select("#"+node.children[1].data.id)
			// .transition().ease(d3.easeCubic)
			// .delay(revealTime*runNum)
			// .duration(revealTime)
			// .attr('fill', 'white');
			console.log("op2");
			return node.children[1];
		}
		// appliesToDP("Loan_Amount_Term <= 308.0", dp);

	}

	function appliesToDP(condition, dp) {
		console.log("eval " + condition);
		var cond = eval("dp." + condition);
		console.log(cond);
		return cond;
	}

}

updateCircles(rootNode.descendants());
 

function updateText(data){

	g.selectAll('text')
	.data(data, (d) =>d.data.id)
	.join(
		function(enter){
			return enter.append('text')
						.attrs({
							'x': (d) =>{
								// console.log(1); 
								return mouseX
							},
							//text comes from CENTER of circle when entering
							'y':(d) => mouseY-20,

							'font-size':0
						})
						.text((d) => {
							if(d.children == undefined){
								//if leaf, name is blank
								return ""
							}
							return d.data.name
						})
						.call(text => 
							text.transition().ease(d3.easeCubic).duration(createTime).attrs({
						'x':(d) => {
							return d.y
						},
						'y': (d) => {
							return mouseY-20
							// return d.x+30;
						},
						'text-anchor':'middle',
						'font-size':17,
						'fill':'white',
						})

						.transition().ease(d3.easeCubic).delay(function(d){
							return 0;
						}).duration(createTime).attrs({
						'x':(d) => {
							// TODO: implement custom include function includesID(d.data)
							// console.log("checker");
							// console.log(buttonTracker.includes(d));
							// console.log(buttonTracker);
							// console.log(d);
// buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);

							return d.y
						},
						'y': (d) => {
							return d.x-20
							// return d.x+30;
						}
						})
						//transition two / optional
						.transition().ease(d3.easeCubic).duration(createTime).attrs({
						'x':(d) => {
							if (isClosed(d, buttonTracker)) {
								return d.y+125
							}
// buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);

							return d.y
						},
						'y': (d) => {
							if (isClosed(d, buttonTracker)) {
								return d.x+5
							}
							return d.x-20
							// return d.x+30;
						}
						})



						);
		},
		function(update){
			// console.log("here is update:")
			// console.log(update);
			return update.call(text => text.transition().ease(d3.easeCubic).delay(function(d){
				if (isClosed(d, buttonTracker)) {
					return removeTime*2;
				}
				return 0;
			}).duration(createTime)
				.attrs({
					'x':function(d) {
						if (isClosed(d, buttonTracker)) {
							return d.y+125;
						}
						return d.y;
					},
					'y':function(d) {
						if (isClosed(d, buttonTracker)) {
							return d.x+5;
						}
						return d.x-20;
					}
				}))
			
				// return update.call(text => text.transition().ease(d3.easeCubic).duration(createTime)
				// 	.attrs({
				// 		'x':(d) => {

				// 		}
				// 	}));
			// return update;
		},
		function(exit){
			return exit.call(text => text.transition().ease(d3.easeCubic).duration(removeTime).remove()
			.attrs({
			 'x':(d) => d.y,
			 'y':(d) => mouseY-20
			 // 'font-size':0 
			})
			.transition().ease(d3.easeCubic).duration(removeTime).remove().attrs({
				'x':(d) => mouseX,
				'font-size':(d) => 0
			}));
		}

	);
	//call added to enter function
	// .call(text => text.transition().ease(d3.easeCubic).duration(createTime).attrs({
	// 	'x':(d) => {
	// 		return d.y
	// 	},
	// 	'y': (d) => {
	// 		return d.x-20
	// 		// return d.x+30;
	// 	},
	// 	'text-anchor':'middle',
	// 	'font-size':17,
	// 	'fill':'white',
	// 	}))
}

updateText(textLinks);

}

function isClosed (d, buttonTracker) {
	if (buttonTracker.find(el => el.buttonId == d.data.id)) {
		return true;
	}
	return false;
}

// let crop = function() {
// const bbox = d3.select('g').node().getBBox();
// // const bbox = svgElem.node().getBBox();
// // svgElem.setAttribute("width", bbox.width);
// // svgElem.setAttribute("height", bbox.height);
// console.log("bbox:")
// console.log(bbox);
// d3.select('svg').node().setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
// d3.select('svg').transition().ease(d3.easeCubic).duration(400).attr("width", Math.max(bbox.width, window.screen.width));
// d3.select('svg').transition().ease(d3.easeCubic).duration(400).attr("height", bbox.height);
// console.log("cropping");
// }

// var timer = d3.interval(crop, 400);

