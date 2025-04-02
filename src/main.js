import utils from '@utils';
import algorithm from '@algorithm';

const { io } = utils;

const transform = async (file_name) => {
    const [_, regex] = (await io.read(`bin/regex/${file_name}.txt`)).split(/\r?\n/);
    await io.write(`bin/dfa/${file_name}.txt`, [regex]
        .map(algorithm.infix_to_extended)
        .map(algorithm.extended_to_postfix)
        .map(algorithm.postfix_to_ast)
        .map(algorithm.ast_to_dfa)
    );
};

Promise.all(
    (process.argv.length >= 3
        ? process.argv.slice(2)
        : await io.list_files("bin/regex")
    ).map(transform)
);
