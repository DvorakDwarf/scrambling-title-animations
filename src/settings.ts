import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting, ToggleComponent } from "obsidian";

export class ScrambleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h1", { text: "General" });
        new Setting(containerEl)
            .setName("CSS class name")
            .setDesc("Leave blank for effect to apply to every note. If you only want the effect on certain notes, change this to the name of the tag you will put in the `cssclasses` frontmatter field of target notes")
            .addText((text) =>
                text
                //   .setPlaceholder("MMMM dd, yyyy")
                .setValue(this.plugin.settings.cssclass)
                .onChange(async (value) => {
                    this.plugin.settings.cssclass = value;
                    await this.plugin.saveSettings();
            })
        );

        new Setting(containerEl)
            .setName("FPS")
            .setDesc("Frames per second of the animation")
            .addText((text) =>
            text
            //   .setPlaceholder("MMMM dd, yyyy")
                .setValue(String(this.plugin.settings.fps))
                .onChange(async (value) => {
                this.plugin.settings.fps = Number(value);
                await this.plugin.saveSettings();
            })
        );

        new Setting(containerEl)
            .setName("Animation Duration (ms)")
            .setDesc("How long should the scrambling animation be, in miliseconds. The unscrambling time is independent of this")
            .addText((text) =>
                text
                //   .setPlaceholder("MMMM dd, yyyy")
                .setValue(String(this.plugin.settings.length))
                .onChange(async (value) => {
                    this.plugin.settings.length = Number(value);
                    await this.plugin.saveSettings();
            })
        );

        containerEl.createEl("h1", { text: "Scrambling Variants" });
        containerEl.createEl("p", { text: "There multiple different scrambling animations. Pick which ones you'd like to see. One of the enabled ones is picked randomly when you open a note to animate the scrambling process. If nothing is picked, the regular options are enabled" });
        new Setting(containerEl)
            .setName('Regular shuffle')
            .setDesc("The entire title is scrambled")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.regular_shuffle)
                .onChange(async value => {
                    this.plugin.settings.regular_shuffle = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );
        new Setting(containerEl)
            .setName('Keyboard smash shuffle')
            .setDesc("The scrambled title increases by one character every frame. Looks like somebody is smashing their keyboard")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.keyboard_shuffle)
                .onChange(async value => {
                    this.plugin.settings.keyboard_shuffle = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );
        new Setting(containerEl)
            .setName('Rolling shuffle')
            .setDesc("Title is typed out letter by letter, with older characters being unscrambled. Does not play a finishing animation because it finishes the text by itself")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.rolling_shuffle)
                .onChange(async value => {
                    this.plugin.settings.rolling_shuffle = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );
        new Setting(containerEl)
            .setName('Overshooting shuffle')
            .setDesc("Using an easing function, the scrambled text overshoots the character limit of the title, then bounces back")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.overshoot_shuffle)
                .onChange(async value => {
                    this.plugin.settings.overshoot_shuffle = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );

        containerEl.createEl("h1", { text: "Unscrambling Variants" });
        containerEl.createEl("p", { text: "After some time, there is a separate animation to unveil the scrambled text" });
        new Setting(containerEl)
            .setName('Regular finish')
            .setDesc("The title is unveilded letter by letter")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.regular_finish)
                .onChange(async value => {
                    this.plugin.settings.regular_finish = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );
        new Setting(containerEl)
            .setName('Finish with errors')
            .setDesc("Same as regular finish, but it leaves errors the first time, then does a second pass to correct them")
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.settings.error_finish)
                .onChange(async value => {
                    this.plugin.settings.error_finish = value
                    await this.plugin.saveSettings()
                    this.display()
                })
            }
        );
    }
}