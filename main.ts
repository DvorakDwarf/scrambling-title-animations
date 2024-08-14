import { MarkdownView, Plugin } from 'obsidian';

function shuffle(view: MarkdownView, step: number): void {
    console.log("Step " + step);

    let title = view.inlineTitleEl;
    title.setText("!".repeat(step));
    setTimeout(() => {
        shuffle(view, step+1) 
    }, 3000)}

export default class ShuffleTextPlugin extends Plugin {
	onload() {
		console.log("Scrambler started");

		this.registerMarkdownPostProcessor((element, ctx) => {
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (activeView) {
                console.log("BBBBBBBBBBBBBB");
                activeView.inlineTitleEl.style.color = "red";
                shuffle(activeView, 1);
            }
		});
	}

	onunload() { 
		console.log("Scrambler ended")
	}
}