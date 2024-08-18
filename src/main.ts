import { App, FileManager, MarkdownView, Plugin, TFile } from 'obsidian';
import { ScrambleSettingTab } from "./settings";
import { rolling_shuffle, shuffle, shuffle_keysmash, shuffle_with_easing } from './shuffling';
import { easeOutBack } from './easing';

export interface ScramblePluginSettings {
    cssclass: string,
    fps: number,
    length: number,
    regular_shuffle: boolean,
    keyboard_shuffle: boolean,
    rolling_shuffle: boolean,
    overshoot_shuffle: boolean,
    regular_finish: boolean,
    error_finish: boolean,

}
  
const DEFAULT_SETTINGS: Partial<ScramblePluginSettings> = {
    cssclass: "",
    fps: 30,
    length: 2000,
    regular_shuffle: true,
    keyboard_shuffle: true,
    rolling_shuffle: true,
    overshoot_shuffle: true,
    regular_finish: true,
    error_finish: true
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
                shuffle_with_easing(view, view.inlineTitleEl.textContent, this.settings, easeOutBack);
                return;
            }

            const cssclass = this.settings.cssclass;
            const file = this.app.workspace.getActiveFile()
            if (file) {
                this.app.fileManager.processFrontMatter(file,  (frontmatter: any) => {
                    if (frontmatter.cssclasses && frontmatter.cssclasses.includes(cssclass)) {
                        console.log("Found " + cssclass);
                        shuffle_with_easing(view, view.inlineTitleEl.textContent, this.settings, easeOutBack);
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