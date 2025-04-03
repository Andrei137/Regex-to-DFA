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
        console.log(`Error writing to file: ${output_file}`);
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
        console.error(`Error reading folder: ${folder_path}`);
        throw error;
    }
};

const assure_existance = async (folder_path) => {
    try {
        await fs.access(folder_path);
    }
    catch (error) {
        console.error(`Folder does not exist: ${folder_path}`);
        throw error;
    }
};

const create_dir = async (dir_path) => {
    try {
        await fs.mkdir(dir_path, { recursive: true });
        await assure_existance(dir_path);
    }
    catch (error) {
        console.error(`Error creating directory: ${dir_path}`);
        throw error;
    }
};

export default {
    read,
    write,
    list_files,
    assure_existance,
    create_dir,
};
