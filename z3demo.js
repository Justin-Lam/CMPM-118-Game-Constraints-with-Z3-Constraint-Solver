import { init } from 'z3-solver';
const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

const MAX_VIABLE_SOLUTIONS = 100;
 
await solveExample();
await solveChildrenAndPetsPuzzle();
await solveInsideFence();
await solveOnFence();
await solveOutsideFence();

/**
 * Finds the set of solutions for a constraint problem and returns a random solution from the set.
 * @param {Int.const[]} variables an array of Z3 solver Int.const variables
 * @param {[]} constraints an array of Z3 solver constraints (ex. And, Or)
 * @param {number} solutionLimit the limit for the number of solutions to find if the total number is really large or infinite
 * @returns {number[]} a solution represented as an array of numbers, where each element is the solution value for the corresponding variable
 */
async function getRandomSolution(variables, constraints, solutionLimit) {

	// Initialize solver
	const solver = new Solver();
	constraints.forEach(constraint => solver.add(constraint));

	// Initialize solutions
	const solutions = [];

	// Get solutions
	let solverRes = await solver.check();
	while (solverRes === "sat" && solutions.length < solutionLimit) {

		// Get a new viable solution and add it to solutions
		const model = solver.model();
		const solution = [];
		variables.forEach(variable => solution.push(model.eval(variable)));
		solutions.push(solution);

		// Make the found solution no longer viable
		// constraint represents: "next time try to solve for a new solution you haven't solved for already"
		// constraint is only false when the solver chooses an solution that's already been discovered as viable
		// array.map() returns an array
		// the spread operator (...) makes it so instead of passing in an array of elements, we pass in the array's elements
		const clauses = variables.map((variable, i) => variable.neq(solution[i]));
		const constraint = Or(...clauses);
		solver.add(constraint);

		// Try to get a new viable solution
		solverRes = await solver.check();
	}

	// Return random solution
	console.log(solutions.length + " solution(s)");
	// sat
	if (solutions.length > 0) {
		const randIndex = Math.floor(Math.random() * solutions.length);
		return solutions[randIndex];
	}
	// unsat
	else {
		return [];
	}
	
}

async function solveExample()
{
	console.log("EXAMPLE: ")

	const x = Int.const('x');
	const variables = [x];

	const constraint = And(x.le(10), x.ge(9));
	const constraints = [constraint];

	const randSolution = await getRandomSolution(variables, constraints, MAX_VIABLE_SOLUTIONS);
	console.log(randSolution.toString());
}
async function solveChildrenAndPetsPuzzle()
{
	console.log("CHILDREN & PETS: ");

	const cat = 1;
	const dog = 2;
	const bird = 3;
	const fish = 4;
	const bob = Int.const("bob");
	const mary = Int.const("mary");
	const cathy = Int.const("cathy");
	const sue = Int.const("sue");
	const variables = [bob, mary, cathy, sue];

	const constraints = [];
	
	// Everyone has a cat, dog, bird, or fish
	constraints.push(And(bob.ge(cat), bob.le(fish)));
	constraints.push(And(mary.ge(cat), mary.le(fish)));
	constraints.push(And(cathy.ge(cat), cathy.le(fish)));
	constraints.push(And(sue.ge(cat), sue.le(fish)));
	
	// Everyone has a different pet
	constraints.push(Distinct(bob, mary, cathy, sue));
	
	// Bob has a dog
	constraints.push(bob.eq(dog));
	
	// Sue has a pet with two legs (bird)
	constraints.push(sue.eq(bird));
	
	// Mary does not have a fish
	constraints.push(mary.neq(fish));

	const randSolution = await getRandomSolution(variables, constraints, MAX_VIABLE_SOLUTIONS);
	console.log(randSolution.toString());
}
async function solveInsideFence()
{
	console.log("INSIDE FENCE:");

	// Fence Constants
	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	// Object Variables
	const objX = Int.const("objX");    // the x pos of the obj to be placed
	const objY = Int.const("objY");    // the y pos of the obj to be placed
	const variables = [objX, objY];

	// Constraints
	const objBetweenLeftAndRightFence = And(objX.gt(leftFenceX), objX.lt(rightFenceX));
	const objBetweenTopAndBottomFence = And(objY.lt(bottomFenceY), objY.gt(topFenceY));
	const constraints = [objBetweenLeftAndRightFence, objBetweenTopAndBottomFence];

	const randSolution = await getRandomSolution(variables, constraints, MAX_VIABLE_SOLUTIONS);
	console.log(randSolution.toString());
}
async function solveOnFence()
{
	console.log("ON FENCE: ");

	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	const x = Int.const("x");
	const y = Int.const("y");
	const variables = [x, y];

	const constraints =  [
		Or(x.eq(leftFenceX), y.eq(topFenceY)),
		Or(x.neq(leftFenceX), y.neq(topFenceY)),
		And(x.ge(leftFenceX), x.le(rightFenceX)),
		And(y.ge(topFenceY), y.le(bottomFenceY))
	];

	const randSolution = await getRandomSolution(variables, constraints, MAX_VIABLE_SOLUTIONS);
	console.log(randSolution.toString());
}
async function solveOutsideFence()
{
	console.log("OUTSIDE FENCE: ");

	const minX = 8;
	const minY = 20;
	const leftFenceX = 5;
	const rightFenceX = 10;
	const topFenceY = 15;
	const bottomFenceY = 25;

	const x = Int.const("x");
	const y = Int.const("y");
	const variables = [x, y];

	const constraints = [
		x.ge(minX),
		y.ge(minY),
		Or(
			And(
				x.ge(leftFenceX),
				x.le(rightFenceX),
				y.gt(bottomFenceY)
			),
			And(
				y.ge(topFenceY),
				y.le(bottomFenceY),
				x.gt(rightFenceX)
			)
		)
	];

	const randSolution = await getRandomSolution(variables, constraints, MAX_VIABLE_SOLUTIONS);
	console.log(randSolution.toString());
}