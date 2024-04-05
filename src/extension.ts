import * as vscode from 'vscode';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vs2moo.GetVerb', async () => {
		let userInput = await vscode.window.showInputBox({ prompt: 'Enter input in the format #ID:verbname' });
		if (userInput) {
			let [id, verbName] = userInput.split(':');
			id = id.replace('#', '');
			let Folder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
			let config = vscode.workspace.getConfiguration('vs2moo');
			let apiEndpoint = config.get('APIEndpoint');
			http.get(`${apiEndpoint}${id}:${verbName}`, (res) => {
				let data = '';
				res.on('data', (chunk) => data += chunk);
				res.on('end', () => {
					let fileUri = vscode.Uri.file(`${Folder}/${id}.${verbName}.moo`);
					let encoder = new TextEncoder();
					let dataUint8Array = encoder.encode(data);

					vscode.workspace.fs.writeFile(fileUri, dataUint8Array);
					// open the file
					vscode.workspace.openTextDocument(fileUri).then(doc => {
						vscode.window.showTextDocument(doc);
					}
					);
				});
			}).on('error', (err) => {
				console.error(`Request error: ${err.message}`);
			});
		}
	});
	context.subscriptions.push(disposable);

	let watcher;
	if (vscode.workspace.workspaceFolders) {
		watcher = chokidar.watch(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '**/*.moo'));
	} else {
		watcher = chokidar.watch('');
	}
	// have the watcher listen for newly saved files
	// and copy them to the outputPath with the name outgoing.moo
	watcher.on('add', path => console.log(`File ${path} has been added`));
	watcher.on('change', path => console.log(`File ${path} has been changed`));
	watcher.on('unlink', path => console.log(`File ${path} has been removed`));
	watcher.on('error', error => console.log(`Watcher error: ${error}`));
	watcher.on('change', (file) => {
		if (file.endsWith('.moo')) {
			let config = vscode.workspace.getConfiguration('vs2moo');

			let outputPath = path.resolve(config.get('outputPath') as string);
			let fileName = file.split('/').pop();
			let fileUri = vscode.Uri.file(path.join(outputPath, 'outgoing.moo'));
			fs.copyFile(file, `${outputPath}/outgoing.moo`, (err) => {
				if (err) {
					console.log(err);
				}
			});
		}
	});

	context.subscriptions.push({
		dispose: () => watcher.close()
	});



}

export function deactivate() {


}