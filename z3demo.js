import { init } from 'z3-solver';
const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

//solveExample();
//solveChildrenAndPetsPuzzle();   
solveInsideFence();
//solveOnFence();
//solveOutsideFence();

async function solve(constraints, maxNumSolutions) {
	// Initialize solver
	const solver = new Solver();
	constraints.forEach(constraint => solver.add(constraint));


}
async function solveExample()
{
	const solver = new Solver();

	const x = Int.const('x');  // x is a Z3 integer
	solver.add(And(x.le(10), x.ge(9)));  // x <= 10, x >=9
	
	// Run Z3 solver, find solution and sat/unsat
	
	if (await solver.check() === "sat") {
	
		// Extract value for x
		let model = solver.model();
		let xVal = parseInt(model.eval(x).toString());
		console.log(`sat. A valid value for x is: ${xVal}`);
	
	} else {
	
		console.log("unsat. Could not find a valid value for x.");
	
	}
}
async function solveChildrenAndPetsPuzzle()
{
	const solver = new Solver();

	const cat = 1;
	const dog = 2;
	const bird = 3;
	const fish = 4;
	const bob = Int.const("bob");
	const mary = Int.const("mary");
	const cathy = Int.const("cathy");
	const sue = Int.const("sue");
	
	// Everyone has a cat, dog, bird, or fish
	solver.add(And(bob.ge(cat), bob.le(fish)));
	solver.add(And(mary.ge(cat), mary.le(fish)));
	solver.add(And(cathy.ge(cat), cathy.le(fish)));
	solver.add(And(sue.ge(cat), sue.le(fish)));
	
	// Everyone has a different pet
	solver.add(Distinct(bob, mary, cathy, sue));
	
	// Bob has a dog
	solver.add(bob.eq(dog));
	
	// Sue has a pet with two legs (bird)
	solver.add(sue.eq(bird));
	
	// Mary does not have a fish
	solver.add(mary.neq(fish));
	
	// Run Z3 solver, find solution and sat/unsat
	const satRes = await solver.check();
	console.log("CHILDREN & PETS:");
	console.log(satRes);
	
	// Extract results for everyone
	const model = solver.model();
	console.log(`Bob = ${numToPet(model.eval(bob))}`);
	console.log(`Mary = ${numToPet(model.eval(mary))}`);
	console.log(`Cathy = ${numToPet(model.eval(cathy))}`);
	console.log(`Sue = ${numToPet(model.eval(sue))}`);
	
	function numToPet(num)
	{
		if (num == cat) {
			return "Cat";
		}
		else if (num == dog) {
			return "Dog";
		}
		else if (num == bird) {
			return "Bird";
		}
		else if (num == fish) {
			return "Fish";
		}
		else {
			return "Other";
		}
	}
}
async function solveInsideFence()
{
	console.log("INSIDE FENCE:");

	// Solver
	const solver = new Solver();

	// Fence Constants
	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	// Object Variables
	const objX = Int.const("objX");    // the x pos of the obj to be placed
	const objY = Int.const("objY");    // the y pos of the obj to be placed

	// Constraints
	const objBetweenLeftAndRightFence = And(objX.gt(leftFenceX), objX.lt(rightFenceX));
	const objBetweenTopAndBottomFence = And(objY.lt(bottomFenceY), objY.gt(topFenceY));
	solver.add(objBetweenLeftAndRightFence);
	solver.add(objBetweenTopAndBottomFence);

	// Answer Set
	const viableObjPositions = [];

	// Get answer set
	let satResult = await solver.check();
	while (satResult === "sat") {

		const model = solver.model();
		const xResult = model.eval(objX);
		const yResult = model.eval(objY);

		viableObjPositions.push({
			x: xResult,
			y: yResult
		});

		// constraint represents: "next time try to solve for a new position you haven't solved for already"
		// constraint is only false when the solver chooses an (x, y) pair that's already been discovered as viable
		const constraint = Or(objX.neq(xResult), objY.neq(yResult));
		solver.add(constraint);

		satResult = await solver.check();
	}

	// Display results
	console.log(`${viableObjPositions.length} viable positions`);
	let positions = "";
	viableObjPositions.forEach(pos => positions += `(${pos.x}, ${pos.y}), `);
	console.log(positions);
}
async function solveOnFence()
{
	const solver = new Solver();

	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	const x = Int.const("x");
	const y = Int.const("y");

	solver.add(Or(x.eq(leftFenceX), y.eq(topFenceY)));
	solver.add(Or(x.neq(leftFenceX), y.neq(topFenceY)));
	solver.add(And(x.ge(leftFenceX), x.le(rightFenceX)));
	solver.add(And(y.ge(topFenceY), y.le(bottomFenceY)));

	// Run Z3 solver, find solution and sat/unsat
	const satRes = await solver.check();
	console.log("ON FENCE:");
	console.log(satRes);

	// Extract values
	const model = solver.model();
	const xRes = model.eval(x);
	const yRes = model.eval(y);
	console.log(`(x, y) = (${xRes}, ${yRes})`);
}
async function solveOutsideFence()
{
	const solver = new Solver();

	const minX = 8;
	const minY = 20;
	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	const x = Int.const("x");
	const y = Int.const("y");

	solver.add(x.ge(minX));
	solver.add(y.ge(minY));
	solver.add(Or(x.lt(leftFenceX), x.gt(rightFenceX)));
	solver.add(Or(y.lt(topFenceY), y.gt(bottomFenceY)));

	// Run Z3 solver, find solution and sat/unsat
	const satRes = await solver.check();
	console.log("OUTSIDE FENCE:");
	console.log(satRes);

	// Extract values
	const model = solver.model();
	const xRes = model.eval(x);
	const yRes = model.eval(y);
	console.log(`(x, y) = (${xRes}, ${yRes})`);
}