import { init } from 'z3-solver';

const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

solveExample();
solveChildrenAndPetsPuzzle();
solveInsideFence();
solveOnFence();
solveOutsideFence();

async function solveExample()
{
    const solver = new Solver();

    const x = Int.const('x');  // x is a Z3 integer

    solver.add(And(x.le(10), x.ge(9)));  // x <= 10, x >=9

    // Run Z3 solver, find solution and sat/unsat
    const satRes = await solver.check();
    console.log("EXAMPLE:");
    console.log(satRes);

    // Extract value for x
    const model = solver.model();
    const xVal = model.eval(x);
    console.log(`${xVal}`);
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
    const solver = new Solver();

    const leftFenceX = 5;
    const rightFenceX = 10;
    const topFenceY = 15;
    const bottomFenceY = 25;

    const x = Int.const("x");
    const y = Int.const("y");

    solver.add(And(x.gt(leftFenceX), x.lt(rightFenceX)));
    solver.add(And(y.lt(bottomFenceY), y.gt(topFenceY)));

    // Run Z3 solver, find solution and sat/unsat
    const satRes = await solver.check();
    console.log("INSIDE FENCE:");
    console.log(satRes);

    // Extract values
    const model = solver.model();
    const xRes = model.eval(x);
    const yRes = model.eval(y);
    console.log(`(x, y) = (${xRes}, ${yRes})`);
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