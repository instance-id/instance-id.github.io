#!/usr/bin/env node
'use strict';

let config = {
	root: '../', //  ------------------- Root hugo folder, can be empty
	dataFolder: 'data', //  ------------ Data folder path (will fetch ALL files from here)
	type: 'projects', //  -------------- Type name [layout] (save it under "layouts/NAME/single.html" or themes/THEME/layouts/NAME/single.html). Can be overridden on individual pages by defining "type" under "fields"
	pages: 'projects', //  ------------- Pages elemenet in your data, in case it's "posts" or "articles" etc.
	name: 'projects.yml', //  ---------- Name of project config file
	contentPath: 'content', //  -------- Path to content directory (in case it's not "content")
	hugoPath: 'hugo', //  -------------- Path to hugo binary (if global, e.g. /snap/bin/hugo)
	mergi: 'mergi' //  ----------------- Mergi path to resize images
};

const fs = require('fs');
const fse = require('fs-extra');
const prompts = require('prompts');

const converToObject = (file) => {
	const jsyml = require('js-yaml');
	const jstml = require('toml');
	const filetype = file.split('.').pop();
	const fileContent = fs.readFileSync(config.root + config.dataFolder + '/' + file, 'utf8');
	if (filetype === 'json') return JSON.parse(fileContent);
	if (filetype === 'yml' || filetype === 'yaml') return jsyml.safeLoad(fileContent);
	if (filetype === 'toml') return jstml.parse(fileContent);
};
const build = async (add, force, resize) => {
	if (typeof add === 'undefined') add = true;
	if (typeof force === 'undefined') force = false;
	if (typeof resize === 'undefined') resize = false;
	if (!config.contentPath || config.contentPath === '/') return console.log("Error: config.contentPath cannot be '' or '/')!");
	let dataFiles;
	try {
		dataFiles = fs.readdirSync(config.root + config.dataFolder);
	} catch (e) {
		return console.log('e', e);
	}
	if (dataFiles.length < 1) return console.log('No data files');
	for (let i in dataFiles) {
		if (dataFiles[i] != config.name) continue;
		console.log(dataFiles[i]);
		let data = converToObject(dataFiles[i]);
		let page1 =
			config.pages ? data[config.pages] :
				data;
		let pages = page1.projects_list;
		for (let j in pages) {
			if (!pages[j].path) return console.log('Error: Pages must include path!');
			if (!pages[j].fields) return console.log('Error: Pages must include fields!');
			if (!pages[j].fields.type) pages[j].fields.type = config.type;

			// Automatic image resize to create thumbnails
			if (resize) {
				let imageFiles;
				try {
					imageFiles = fs.readdirSync(`${config.root}/static/images/${pages[j].path}/${pages[j].fields.name}/`);
				} catch (e) {
					return console.log('e', e);
				}
				const { execSync } = require('child_process');
				for (let i in imageFiles) {
					// Console.log('Image name: ' + imageFiles[i]);
					const imgBase = imageFiles[i].split('.');
					if (imgBase[0].includes('_small')) continue;
					console.log('Image base: ' + imgBase[0]);
					const tmpOldImage = `${config.root}/static/images/${pages[j].path}/${pages[j].fields.name}/${imgBase[0]}.png`;
					const tmpNewImage = `${config.root}/static/images/${pages[j].path}/${pages[j].fields.name}/${imgBase[0]}_small.png`;
					const tmpImage = tmpOldImage.toLowerCase();
					const newImage = tmpNewImage.toLowerCase();
					const mergiString = `.\\mergi.exe -i  ${tmpImage} -r "300 178" -o ${newImage} `;

					try {
						await execSync(mergiString);
					} catch (e) {
						return console.log('e', e);
					}
					console.log('Rezied image: ' + newImage);
				}
			}
			const tmpPath = config.root + config.contentPath + '/' + pages[j].path + '/' + pages[j].name;
			const pagePathSplit = tmpPath.split(' ').join('-');
			const pagePath = pagePathSplit.toLowerCase();
			if (add) {
				fse.ensureDirSync(pagePath);
				fs.writeFileSync(pagePath + '/index.md', JSON.stringify(pages[j].fields) + '\n');
				console.log('Created file: ' + pagePath + '/index.md');
			} else if (fs.existsSync(pagePath)) {
				let response;
				if (!force) {
					response = await prompts({
						type: 'confirm',
						name: 'value',
						message: 'Delete ' + pagePath + ' ?'
					});
				}

				if (force || response.value) {
					fse.removeSync(pagePath);
					console.log('Removed folder: ' + pagePath);
				}
			}
		}
	}
};
const main = async (argvs) => {
	const mode =

		typeof argvs._[0] === 'undefined' ? 'default' :
			argvs._[0];
	const resize =

		typeof argvs['resize'] === 'undefined' ? false :
			true;
	const force =

		typeof argvs['force'] === 'undefined' ? false :
			true;
	const configFile =

		typeof argvs['configFile'] === 'undefined' ? false :
			require('./' + argvs['configFile']);
	Object.assign(config, configFile); // Overriding default settings
	config.root =
		(
			!!config.root ? config.root :
				'.') + '/';
	const { execSync } = require('child_process');
	if (mode === 'server') {
		// Server mode - create data-generated files, run hugo server, remove data-generated files on stop
		console.log('Building data-generated files...');
		await build();
		console.log('Running Hugo Server...');
		process.on('SIGINT', () => { }); // Not exiting on ctrl+c (instead, going to "catch" clause)
		try {
			await execSync('(cd ' + config.root + ' && ' + config.hugoPath + ' server)');
		} catch (e) {
			console.log('Removing data-generated files...');
			await build(false, force);
		}
	} else if (mode === 'generate') {
		// Generate - just create data-generated files (no hugo running, and no removal)
		console.log('Building data-generated files...');
		await build();
	} else if (mode === 'clean') {
		// Clean - just remove data-generated files
		console.log('Removing data-generated files...');
		await build(false, force);
	} else if (mode === 'resize') {
		//  Resize images to create thumbnails
		console.log('Resize...');
		await build(true, false, true);
	} else {
		// Default behavior - create data-generated files, run hugo build, remove data-generated files
		console.log('Building data-generated files...');
		await build();
		console.log('Running Hugo (build)...');
		await execSync('(cd ' + config.root + ' && ' + config.hugoPath + ')');
		// Console.log('Removing data-generated files...');
		// Await build(false, force);
	}

	console.log('Done!');
};

//  Defining commands and flags
const argvs = require('yargs')
	.command('$0', 'Generate folders/files from data, then run `hugo build`')
	.command('generate', 'Generate folders/files from data (does not run hugo build)')
	.command('server', 'Generate folders/files from data, run `hugo server`, then cleanup on exit')
	.command('clean', 'Trigger cleanup manually')
	.option('resize', {
		alias: 'r',
		description: 'Create image thumbnails'
	})
	.option('force', {
		alias: 'f',
		description: 'Use this flag to skip folder removal prompts (be careful with this one!)'
	})
	.option('configFile', {
		alias: 'c',
		description: 'Optionally use an external config file (JSON format only)'
	}).argv;

main(argvs);
