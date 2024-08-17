import { App, FileManager, MarkdownView, Plugin, TFile } from 'obsidian';
import { ScrambleSettingTab } from "./settings";
import { rolling_shuffle, shuffle, shuffle_overshoot } from './shuffling';

export interface ScramblePluginSettings {
    cssclass: string,
    fps: number,
    length: number,
    verbose: boolean
}
  
const DEFAULT_SETTINGS: Partial<ScramblePluginSettings> = {
    cssclass: "",
    fps: 30,
    length: 2000,
    verbose: false
};

export default class ScrambleTextPlugin extends Plugin {
	settings: ScramblePluginSettings;
    
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
	    await this.loadSettings();
        this.addSettingTab(new ScrambleSettingTab(this.app, this));

        console.log("Scrambler started");

        this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => {
            console.log("BIG LEAF MOMENT (Start of event)");
            
            let view = leaf.workspace.getActiveViewOfType(MarkdownView);
            if (view == null) {
                return;
            }            
            // console.log(view);

            if (this.settings.cssclass == "") { 
                rolling_shuffle(view, view.inlineTitleEl.textContent, this.settings);
                return;
            }

            const cssclass = this.settings.cssclass;
            const file = this.app.workspace.getActiveFile()
            if (file) {
                this.app.fileManager.processFrontMatter(file,  (frontmatter: any) => {
                    if (frontmatter.cssclasses && frontmatter.cssclasses.includes(cssclass)) {
                        console.log("Found " + cssclass);
                        rolling_shuffle(view, view.inlineTitleEl.textContent, this.settings);
                        return;
                    }
                });
            }
        }));
	}

	onunload() { 
		console.log("Scrambler ended");
	}
}