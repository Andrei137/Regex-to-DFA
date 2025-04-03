import utils from '@utils';
import algorithm from '@algorithm';

const main = async () => {
    const transform = async (file_name) => {
        const [alphabet, regex] = (await utils.io.read(`bin/regex/${file_name}.txt`)).split('\n');
        const [postfix] = [regex]
            .map(algorithm.infix_to_extended(alphabet))
            .map(algorithm.extended_to_postfix(alphabet));
        const [dfa] = [postfix]
            .map(algorithm.postfix_to_ast)
            .map(algorithm.ast_to_dfa);

        await utils.io.write(`bin/postfix/${file_name}.txt`, postfix);
        await utils.io.write(`bin/dfa/${file_name}.txt`, dfa);
    };

    await utils.io.assure_existance('bin/regex');
    const file_names = process.argv.length >= 3
        ? process.argv.slice(2)
        : await utils.io.list_files('bin/regex');

    await utils.io.create_dir('bin/postfix');
    await utils.io.create_dir('bin/dfa');

    try {
        await Promise.all(file_names.map(transform));
        console.log('All files processed successfully!');
    }
    catch (error) {
        console.error(`Error processing files: ${error}`);
        process.exit(1);
    }
}

await main();
