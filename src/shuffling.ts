import { MarkdownView } from "obsidian";
import { ScramblePluginSettings } from "./main";
import { setTimeout } from "timers/promises";

function get_char(custom_set = ""): string {
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = "0123456789";
    let symbols = ",.?/\\(^)![]{}*&^%$#\'";

    let chars = (lower + upper + num + symbols).split("");
    if (custom_set != "") {
        chars = custom_set.split("");
    }

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

async function finish(
    titleEl: HTMLElement, 
    og_title: string, 
    view: MarkdownView, 
    delta: number
) {
    let current_text = titleEl.textContent?.split("") as string[];
    
    for (let frame = 0; frame < og_title.length; frame++) {
        if (og_title != view.file?.basename) {
            console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        console.log("Finish frame " + frame + " Setting new char to: " + og_title.split("")[frame]);

        current_text[frame] = og_title.split("")[frame];
        titleEl.setText(current_text.join(""));

        await setTimeout(delta);
    }

    if (current_text.length > og_title.length) {
        for (let frame = og_title.length; frame < current_text.length; frame++) {
            if (og_title != view.file?.basename) {
                console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
                return;
            }

            current_text[frame] = "";
            titleEl.setText(current_text.join(""));
    
            await setTimeout(delta);
        }
    }
    
    titleEl.setText(og_title);

    //Make sure to make text selectable afterwards
    titleEl.style.pointerEvents = "auto";
}

async function finish_with_errors(
    titleEl: HTMLElement, 
    og_title: string, 
    view: MarkdownView, 
    delta: number
) {
    let current_text = titleEl.textContent?.split("") as string[];
    
    for (let frame = 0; frame < og_title.length; frame++) {
        if (og_title != view.file?.basename) {
            console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        console.log("Finish frame " + frame + " Setting new char to: " + og_title.split("")[frame]);

        let chance =  Math.random();
        if (chance < 0.2) {
            current_text[frame] = get_char("?/\\()![]{}&%$#");
        } else {
            current_text[frame] = og_title.split("")[frame];
        }
        titleEl.setText(current_text.join(""));

        await setTimeout(delta);
    }

    //Second pass to correct errors
    finish(titleEl, og_title, view, delta);
}

export async function shuffle(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings
): Promise<void> {    
    let titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    const delta = 1000 / settings.fps;
    let n_frames = settings.length / delta;

    //Look into
    titleEl.style.pointerEvents = "none";

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        console.log("Frame " + frame);

        titleEl.setText(get_garbled_string(og_title.length));

        await setTimeout(delta);
    }
        
    finish(titleEl, og_title, view, delta);
}

//Doesn't work if n_frames lower than og_title.length
export async function shuffle_overshoot(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings
): Promise<void> {    
    let titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    const delta = 1000 / settings.fps;
    let n_frames = settings.length / delta;

    //Look into
    titleEl.style.pointerEvents = "none";

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        titleEl.setText(get_garbled_string(frame));

        await setTimeout(delta);
    }
        
    finish_with_errors(titleEl, og_title, view, delta);
}

//TODO:
//Doesn't work if n_frames lower than og_title.length
export async function rolling_shuffle(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings
): Promise<void> {    
    let titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    let n_frames = og_title.length;

    const scramble_buffer = 7;
    n_frames += scramble_buffer;
    
    const delta = settings.length / n_frames;

    //Look into
    titleEl.style.pointerEvents = "none";

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.log("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        if (frame >= scramble_buffer + 1) {
            let scrambled = get_garbled_string(Math.min(frame, scramble_buffer, n_frames-frame-1));
            let fixed = og_title.split("").slice(0, frame - scramble_buffer+1);
            let output = fixed.concat(scrambled.slice(scramble_buffer - frame, scrambled.length));
            
            titleEl.setText(output.join(""));
        } else {
            titleEl.setText(get_garbled_string(frame));
        }

        await setTimeout(delta);
    }
}