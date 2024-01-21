import { promises } from 'fs';

const title = 'fix Parcel bundle',
    filePattern = /^index\..+\.js$/i,
    bugPattern = /\$\w+?\$import\$\w+?;/g;

console.time(title);

(async () => {
    const files = await promises.readdir('dist');

    for (const name of files)
        if (filePattern.test(name)) {
            const file = `dist/${name}`;

            const source = await promises.readFile(file, { encoding: 'utf-8' });

            if (!bugPattern.test(source)) continue;

            await promises.writeFile(file, source.replace(bugPattern, ''));

            console.log(`[fixed] ${file}`);
        }
    console.timeEnd(title);
})();
