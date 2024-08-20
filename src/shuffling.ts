import { MarkdownView } from "obsidian";
import { setTimeout } from "timers/promises";
import { ScramblePluginSettings } from "./settings";

//Get random character
function get_char(custom_set = ""): string {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";
    const symbols = "?/\\(^)![]{}&^%$#";

    let chars = (lower + upper + num + symbols).split("");
    if (custom_set != "") {
        chars = custom_set.split("");
    }

    const randomElement = chars[Math.floor(Math.random() * chars.length)];
    return randomElement;
}

//Get an entire random string of length
function get_garbled_string(length: number): string {
    let answer = "";

    //I want my for i in range :(((
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of "W".repeat(length)) {
        answer += get_char();
    }

    return answer
}

//Randomly pick the unveiling animation
//NOT called by rolling shuffle
async function pick_finish(
    settings: ScramblePluginSettings,
    titleEl: HTMLElement, 
    og_title: string, 
    view: MarkdownView, 
    delta: number
) {
    const available_function = [];

    if (settings.error_finish == true) {
        available_function.push(finish_with_errors);
    }

    if (settings.regular_finish == true || available_function.length == 0) {
        available_function.push(finish);
    }

    const picked_function = available_function[Math.floor(Math.random() * available_function.length)];
    await picked_function(titleEl, og_title, view, delta);
}

async function finish(
    titleEl: HTMLElement, 
    og_title: string, 
    view: MarkdownView, 
    delta: number
) {
    console.debug("REGULAR FINISH");

    const current_text = titleEl.textContent?.split("") as string[];
    
    //Unveil all letters
    for (let frame = 0; frame < og_title.length; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        current_text[frame] = og_title.split("")[frame];
        titleEl.setText(current_text.join(""));

        await setTimeout(delta);
    }

    //Delete any extra letters
    if (current_text.length > og_title.length) {
        for (let frame = og_title.length; frame < current_text.length; frame++) {
            if (og_title != view.file?.basename) {
                console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
                return;
            }

            current_text[frame] = "";
            titleEl.setText(current_text.join(""));
    
            await setTimeout(delta);
        }
    }
    
    //Just in case, set text to original title fully
    titleEl.setText(og_title);

    //Make sure to make text selectable afterwards
    titleEl.classList.remove("compliance-class");}

//This also calls regular finish for second pass
async function finish_with_errors(
    titleEl: HTMLElement, 
    og_title: string, 
    view: MarkdownView, 
    delta: number
) {
    console.debug("FINISH WITH ERRORS");

    const current_text = titleEl.textContent?.split("") as string[];
    
    for (let frame = 0; frame < og_title.length; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        const chance =  Math.random();
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
    console.debug("REGULAR SHUFFLE");

    const titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    const delta = 1000 / settings.fps;
    const n_frames = settings.duration / delta;

    //Make sure the title isn't selectable while it's garbled
    titleEl.classList.add("compliance-class");

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        titleEl.setText(get_garbled_string(og_title.length));

        await setTimeout(delta);
    }
        
    pick_finish(settings, titleEl, og_title, view, delta);
}

export async function shuffle_keysmash(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings
): Promise<void> {    
    console.debug("KEYSMASH SHUFFLE");

    const titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    const delta = 1000 / settings.fps;
    const n_frames = settings.duration / delta;

    //Make sure the title isn't selectable while it's garbled
    titleEl.classList.add("compliance-class");

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        titleEl.setText(get_garbled_string(frame));

        await setTimeout(delta);
    }
        
    pick_finish(settings, titleEl, og_title, view, delta);
}

//Doesn't care about fps or duration
export async function rolling_shuffle(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings
): Promise<void> {    
    console.debug("ROLLING SHUFFLE");

    const titleEl = view.inlineTitleEl;
    let n_frames = og_title.length;

    //How big the scrambled area up front is
    const scramble_buffer = 7;
    n_frames += scramble_buffer;

    //How long between each frame in ms
    const delta = 1000 / n_frames;

    //Make sure the title isn't selectable while it's garbled
    titleEl.classList.add("compliance-class");

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        if (frame >= scramble_buffer + 1) {
            const scrambled = get_garbled_string(Math.min(frame, scramble_buffer, n_frames-frame-1));
            const fixed = og_title.split("").slice(0, frame - scramble_buffer+1);
            const output = fixed.concat(scrambled.slice(scramble_buffer - frame, scrambled.length));
            
            titleEl.setText(output.join(""));
        } else {
            titleEl.setText(get_garbled_string(frame));
        }

        await setTimeout(delta);
    }
}

export async function shuffle_with_easing(
    view: MarkdownView, 
    og_title: string, 
    settings: ScramblePluginSettings,
    easing_function: CallableFunction
): Promise<void> {    
    console.debug("SHUFFLE WITH EASING");

    const titleEl = view.inlineTitleEl;
    //How long between each frame in ms
    const delta = 1000 / settings.fps;
    const n_frames = settings.duration / delta;

    //Make sure the title isn't selectable while it's garbled
    titleEl.classList.add("compliance-class");

    //I want my for i in range :(((
    for (let frame = 0; frame < n_frames; frame++) {
        if (og_title != view.file?.basename) {
            console.debug("THIS AIN'T THE SAME FILE ANYMORE, ABORT");
            return;
        }

        const easing_coefficient = easing_function((frame+1)/n_frames)
        const garble_length = easing_coefficient * og_title.length;
        titleEl.setText(get_garbled_string(garble_length));

        await setTimeout(delta);
    }
        
    pick_finish(settings, titleEl, og_title, view, delta);
}