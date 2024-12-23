import { select } from '@inquirer/prompts';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { argv } from 'process';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const run = async (answer) => {
    const imported = await import(path.join(__dirname, '..', answer, `${answer}.js`));

    const examples = [...(await fs.readdir(path.join(__dirname, '..', answer)))].filter(e => e.endsWith('.example'));

    if (examples.length) {
        for (const example of examples) {

            if (imported.part1) {
                let exampleInput = await fs.readFile(path.join(__dirname, '..', answer, example), 'utf8');
                if (imported.prepareInput) {
                    exampleInput = imported.prepareInput(exampleInput); 
                }
                console.log(`Example ${example.split('.')[0]} part 1: ${imported.part1(exampleInput)}`);
            }

            if (imported.part2) {
                let exampleInput = await fs.readFile(path.join(__dirname, '..', answer, example), 'utf8');
                if (imported.prepareInput) {
                    exampleInput = imported.prepareInput(exampleInput); 
                }
                console.log(`Example ${example.split('.')[0]} part 2: ${imported.part2(exampleInput)}`);
            }
        }
    }

    console.log('--------')


    if (imported.part1) {
        let input = await fs.readFile(path.join(__dirname, '..', answer, `${answer}.input`), 'utf8');
        const start = performance.now();
        if (imported.prepareInput) {
            input = imported.prepareInput(input); 
        }
        const part1 = imported.part1(input);
        const end = performance.now();
        console.log(`${answer} part 1: ${part1} in ${end - start}ms`);
    } else {
        console.log('Part 1 doesn\'t exist');
    }

    if (imported.part2) {
        let input = await fs.readFile(path.join(__dirname, '..', answer, `${answer}.input`), 'utf8');
        const start = performance.now();
        if (imported.prepareInput) {
            input = imported.prepareInput(input); 
        }
        const part2 = imported.part2(input);
        const end = performance.now();
        console.log(`${answer} part 2: ${part2} in ${end - start}ms`);
    } else {
        console.log('Part 2 doesn\'t exist');
    }
}

if (argv.length > 2) {
    program
        .argument('<day>', 'Day to run')
        .action(run)

    await program.parseAsync(argv);
} else {
    try {
        const days = [...(await fs.readdir(path.join(__dirname, '..')))].filter(e => e.startsWith('day'));

        const answer = await select({
            message: 'Select a day to run',
            choices: days.map(e => ({ name: e, value: e })),
            default: days[days.length - 1],
            loop: false
        });

        await run(answer);
    } catch (e) {
        console.error(e);
    }
}

