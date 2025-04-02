import path from 'path';
import { promises as fs } from 'fs';

const read = async (input_file) => {
    try {
        return await fs.readFile(input_file, 'utf-8');
    }
    catch (error) {
        console.log(`Error reading file: ${input_file}`, error);
        throw error;
    }
};

const write = async (output_file, content) => {
    try {
        await fs.writeFile(output_file, content, 'utf-8');
    }
    catch (error) {
        console.log(`Error writing to file: ${output_file}`, error);
        throw error;
    }
};

const list_files = async (folder_path) => {
    try {
        return (await fs
            .readdir(folder_path))
            .filter(file => file.endsWith('.txt'))
            .map(file => path.parse(file).name);
    }
    catch (error) {
        console.error(`Error reading folder: ${folder_path}`, error);
        throw error;
    }
};

export default {
    read,
    write,
    list_files,
};
