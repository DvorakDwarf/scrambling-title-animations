import { MarkdownView, Plugin } from 'obsidian';
import { setTimeout } from "timers/promises";

function get_char(): string {
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = "0123456789";
    let symbols = ",.?/\\(^)![]{}*&^%$#\'";

    let chars = (lower + upper + num + symbols).split("");

    const randomElement = chars[Math.floor(Math.random() * chars.length)];
    return randomElement;
}

function get_garbled_string(length: number): string {
    let answer = "";

    //I want my for i in range :(((
    for (let _ of "W".repeat(length)) {
        answer += get_char();
    }

    return answer
}

function finish(titleEl: HTMLElement, og_title: string) {
    titleEl.textContent = og_title;
}

async function shuffle(titleEl: HTMLElement, og_title: string): Promise<void> {            
    if (titleEl.textContent?.length != og_title.length) {
        return;
    }    

    let fps = 30
    
    //I want my for i in range :(((
    for (let step = 0; step < 20; step++) {
        console.log("Step " + step);

        titleEl.setText(get_garbled_string(og_title.length));

        await setTimeout(1000 / fps);
    }
        
    finish(titleEl, og_title);
}

export default class ShuffleTextPlugin extends Plugin {
	onload() {
		console.log("Scrambler started");

        this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => {
            console.log("BIG LEAF MOMENT");
            let view = leaf.workspace.getActiveViewOfType(MarkdownView);
            shuffle(view.inlineTitleEl, view.inlineTitleEl.textContent);
        }));

        // const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        // if (activeView) {
        //     console.log("BBBBBBBBBBBBBB");

        //     let titleEl = activeView.inlineTitleEl;
        //     let title = titleEl.textContent as string;
        //     titleEl.style.color = "red";

        //     // shuffle(titleEl, title, 0);

        //     this.registerInterval(
        //         window.setInterval(() => {
        //             shuffle(titleEl, title);
        //         }, 1000)
        //     );
        // }

		this.registerMarkdownPostProcessor((element, ctx) => {
            // const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            // if (activeView) {
            //     console.log("BBBBBBBBBBBBBB");

            //     let titleEl = activeView.inlineTitleEl;
            //     let title = titleEl.textContent as string;
            //     titleEl.style.color = "red";

            //     shuffle(titleEl, title, 0);

            //     let step = 0;
            //     this.registerInterval(
            //         window.setInterval(() => shuffle(
            //             titleEl, 
            //             title, 
            //             step
            //         ), 1000)
            //     );
            // }
		});
	}

	onunload() { 
		console.log("Scrambler ended");
	}
}