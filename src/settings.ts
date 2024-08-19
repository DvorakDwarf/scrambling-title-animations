import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface ScramblePluginSettings {
    cssclass: string,
    fps: number,
    duration: number,
    regular_shuffle: boolean,
    keyboard_shuffle: boolean,
    rolling_shuffle: boolean,
    overshoot_shuffle: boolean,
    regular_finish: boolean,
    error_finish: boolean,
}
  
export const DEFAULT_SETTINGS: Partial<ScramblePluginSettings> = {
    cssclass: "",
    fps: 30,
    duration: 600,
    regular_shuffle: true,
    keyboard_shuffle: true,
    rolling_shuffle: true,
    overshoot_shuffle: true,
    regular_finish: true,
    error_finish: true
};

export class ScrambleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("CSS class name")
            .setDesc("Leave blank for effect to apply to every note. If you only want the effect on certain notes, change this to the name of the tag you will put in the `cssclasses` frontmatter field of target notes")
            .addText((text) =>
                text
                .setValue(this.plugin.settings.cssclass)
                .onChange(async (value) => {
                    this.plugin.settings.cssclass = value;
                    await this.plugin.saveSettings();
            })
        );

        new Setting(containerEl)
            .setName("FPS")
            .setDesc("Frames per second of the animation")
            .addText((text) => {
                text
                .setPlaceholder("30")
                .setValue(String(this.plugin.settings.fps))
                .onChange(async (value) => {
                    this.plugin.settings.fps = Number(value);
                    await this.plugin.saveSettings();
                })
                text.inputEl.type = "number";
                text.inputEl.min = "1";
                text.inputEl.max = "120";
            });

        new Setting(containerEl)
            .setName("Animation duration (ms)")
            .setDesc("How long the scrambling animation will be, in miliseconds. The unscrambling time is independent of this")
            .addText((text) => {
                text
                .setPlaceholder("600")
                .setValue(String(this.plugin.settings.duration))
                .onChange(async (value) => {
                    this.plugin.settings.duration = Number(value);
                    await this.plugin.saveSettings();
                });
                text.inputEl.type = "number";
                //I don't think this does anything, but for future reference
                text.inputEl.min = "200";
                text.inputEl.max = "9999";
            });

        new Setting(containerEl)
            .setName("Reset settings")
            .setDesc("Change all the settings back to default")
            .addButton((button) => {
                button.setButtonText("Reset");
                button.onClick(async () => {
                    this.plugin.settings = Object.assign({}, this.plugin.settings, DEFAULT_SETTINGS);
                    await this.plugin.saveSettings();
                    this.display();
                });
            })

        new Setting(containerEl).setName('Scrambling variants').setHeading();
        containerEl.createEl("p", { text: "There are multiple different scrambling animations. Pick which ones you'd like to see. One of the enabled ones is picked randomly when you open a note to animate the scrambling process. If nothing is picked, the regular options are used" });
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
            .setDesc("The scrambled title increases by one character every frame. Looks like somebody smashing their keyboard")
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
            .setDesc("The title is typed out letter by letter, with older characters being unscrambled. Does not play a finishing animation because it finishes the text by itself. Additionally, doesn't change based on fps or duration settings")
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

        // containerEl.createEl("h1", { text: "Unscrambling variants" });
        new Setting(containerEl).setName('Unscrambling variants').setHeading();
        containerEl.createEl("p", { text: "After some time, there is a separate animation to unveil the scrambled text"});
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