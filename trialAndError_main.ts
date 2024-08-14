import { MarkdownView, Plugin } from 'obsidian';

export default class ShuffleTextPlugin extends Plugin {
	onload() {
		console.log("Scrambler started");


		this.registerMarkdownPostProcessor((element, ctx) => {
            // console.log(JSON.stringify(ctx.containerEl.children, null, 4));
            console.log("AAAAAAAAAAAAAAa");
            console.log(this.app.workspace.containerEl);

			// const highlightElements = element.querySelector("p");
            // console.log(highlightElements);
            // if (highlightElements) {
            //     // highlightElements.style.color = "red";
            // }

            // const title = document.querySelector("div > .inline-style");
            // console.log(typeof document.querySelector("title"));
            // if (title) {
            //     title.setAttribute("style", "color:red");
            // }

            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (activeView) {
                activeView.inlineTitleEl.style.color = "red";
            }
		});
	}

	onunload() { 
		console.log("Scrambler ended")
	}
}