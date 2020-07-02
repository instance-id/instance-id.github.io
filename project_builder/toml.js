#!/usr/bin/env node
'use strict';

let config = {
    root: '../', //  ----------------------------------- Root hugo folder, can be empty
    greymatter: '../jsontofm/gray-matter', // ---------- Path to grey-matter
    originalFolder: 'data/searcher/news', //  ---------- Data folder path (will fetch ALL files from here)
    contentPath: 'content', //  ------------------------ Path to content directory (in case it's not "content")
    type: 'news',
    project: 'searcher'
};

String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\/g, "")
        .replace(/\\r/g, "")
        .replace(/\\n/g, "")
        .replace(/\\t/g, "")
        .replace(/\\f/g, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\t/g, "")
        .replace(/\f/g, "")
        .replace(/"/g, "\"")
        .replace(/'/g, "\'")
        .replace(/\&/g, "\\&");
}

const path = require('path')
const matter = require(config.greymatter);
const toml = require('toml');
const fs = require('fs');

const converToObject = (file) => {
    const jstml = require('toml');

    const fileContent = fs.readFileSync(config.root + config.originalFolder + '/' + file, 'utf8');
    return jstml.parse(fileContent);
};

const runit = async (replace) => {
    if (typeof replace === 'undefined') replace = false;
    let dataFiles;
    console.log('Looking for data file in: ' + config.originalFolder);
    try {
        dataFiles = fs.readdirSync(config.root + config.originalFolder);
    } catch (e) {
        return console.log('e', e);
    }
    console.log('Data file found. ' + dataFiles);

    if (dataFiles.length < 1) return console.log('No data files');
    for (let i in dataFiles) {
        console.log('Filename: ' + dataFiles[i]);
        let data = converToObject(dataFiles[i]);
        let pages =
            config.pages ? data[config.pages] :
                data;
        console.log('data.', data[config.pages]);
        for (let j in pages) {
            for (let k in pages[j]) {
                let string1 = pages[j][k];
                let newFile = JSON.parse(JSON.stringify(string1));
                newFile = JSON.stringify(newFile);
                console.log('data! ', newFile);

                if (replace) {
                    const newFilePath = path.join(config.root, config.contentPath, config.type, config.project)
                    await fs.writeFileSync(
                        path.join(newFilePath, `${pages[j][k].id}.md`),
                        newFile
                    )
                } else {
                    const newFilePath = path.join(config.root, config.contentPath, config.type, config.project)
                    await fs.writeFileSync(
                        path.join(newFilePath, `${pages[j][k].id}.md`),
                        newFile
                    )
                }
            }
        }
    }
}

const main = async (argvs) => {
    const mode = typeof argvs._[0] === 'undefined' ? 'default' : argvs._[0];
    const replace = typeof argvs['replace'] === 'undefined' ? false : true;
    const configFile = typeof argvs['configFile'] === 'undefined' ? false : require('./' + argvs['configFile']);
    Object.assign(config, configFile); // Overriding default settings
    config.root = (!!config.root ? config.root : '.') + '/';

    console.log('Converting to Front Matter...');

    if (mode === 'replace') {
        try {
            await runit(true);
        } catch (e) {
            return console.log('e', e);
        }
    } else {
        try {
            return console.log('Not Replacing!');

            await runit();
        } catch (e) {
            return console.log('e', e);
        }
    }
    console.log('Done!');
};

const argvs = require('yargs')
    .command('$0', 'Converts the file and creates a second index file named index.md.md that you can rename yourself')
    .option('configFile', {
        alias: 'c',
        description: 'Optionally use an external config file (JSON format only)'
    })
    .option('replace', {
        alias: 'r',
        description: 'Replace original index.md with new and rename original as index_old.md . Otherwise a second copy will be made with the name index.md.md containing new data'
    }).argv;

main(argvs);
