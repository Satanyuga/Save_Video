import { existsSync }  from 'node:fs';
import { join, parse } from 'node:path';
import { cwd }         from 'node:process';
import { readFile }    from 'node:fs/promises';

const findFile = (file) => {
    let dir = cwd();

    while (dir !== parse(dir).root) {
        if (existsSync(join(dir, file))) {
            return dir;
        }

        dir = join(dir, '../');
    }
}

const root = findFile('.git');
const pack = findFile('package.json');

const readGit = async (filename) => {
    if (!root) {
        return null; // 🔥 фикс — больше не падает
    }

    try {
        return await readFile(join(root, filename), 'utf8');
    } catch {
        return null;
    }
}

export const getCommit = async () => {
    const data = await readGit('.git/logs/HEAD');
    return data
        ?.split('\n')
        ?.filter(Boolean)
        ?.pop()
        ?.split(' ')[1] || "unknown";
}

export const getBranch = async () => {
    if (process.env.CF_PAGES_BRANCH) {
        return process.env.CF_PAGES_BRANCH;
    }

    if (process.env.WORKERS_CI_BRANCH) {
        return process.env.WORKERS_CI_BRANCH;
    }

    const data = await readGit('.git/HEAD');
    return data
        ?.replace(/^ref: refs\/heads\//, '')
        ?.trim() || "main";
}

export const getRemote = async () => {
    // 🔥 ВАЖНО — убрали зависимость от .git
    return "render";
}

export const getVersion = async () => {
    if (!pack) {
        throw 'no package root found';
    }

    const { version } = JSON.parse(
        await readFile(join(pack, 'package.json'), 'utf8')
    );

    return version;
}