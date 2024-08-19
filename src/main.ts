import { MarkdownView, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, ScramblePluginSettings, ScrambleSettingTab } from "./settings";
import { rolling_shuffle, shuffle, shuffle_keysmash, shuffle_with_easing } from './shuffling';
import { easeOutBack } from './easing';

//Randomly selects which shuffle/scramble animation will be played
async function pick_shuffle(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings,
    easing_function: CallableFunction
): Promise<void> {

    const available_functions = [];

    if (settings.keyboard_shuffle == true) {
        available_functions.push(shuffle_keysmash);
    }

    if (settings.rolling_shuffle == true) {
        if (og_title.length > 7) {
            available_functions.push(rolling_shuffle);
        }
    }

    if (settings.overshoot_shuffle == true) {
        available_functions.push(shuffle_with_easing);
    }

    if (settings.regular_shuffle == true || available_functions.length == 0) {
        available_functions.push(shuffle);
    }

    const picked_function = available_functions[Math.floor(Math.random() * available_functions.length)];
    await picked_function(view, og_title, settings, easing_function);
}

//The main plugin
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

        //The plugin activates every time the active window changes
        this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => {
            console.debug("BIG LEAF MOMENT (new note, scrambling)");
            
            const view = leaf.workspace.getActiveViewOfType(MarkdownView);
            if (view == null) {
                return;
            }            

            //If the user didn't set a cssclass in settings. always work
            if (this.settings.cssclass == "") { 
                pick_shuffle(view, view.inlineTitleEl.textContent, this.settings, easeOutBack);
                return;
            }

            //If cssclass is set, respect that
            const cssclass = this.settings.cssclass;
            const file = this.app.workspace.getActiveFile()
            if (file) {
                this.app.fileManager.processFrontMatter(file,  (frontmatter) => {
                    if (frontmatter.cssclasses && frontmatter.cssclasses.includes(cssclass)) {
                        console.debug("cssclass found: " + cssclass);
                        pick_shuffle(view, view.inlineTitleEl.textContent, this.settings, easeOutBack);
                        return;
                    }
                });
            }
        }));
	}

	onunload() { 
	
    }
}