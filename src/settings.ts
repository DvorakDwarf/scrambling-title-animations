import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class ScrambleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

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
            .setName("Animation Length (ms)")
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
    }
}