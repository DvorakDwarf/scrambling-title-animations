//Big thanks to https://easings.net/
//Unfortunately hadn't found any other easing functions that looks good

export function easeOutBack(x: number): number {
    //Modify c1 to change size of "hump"
    const c1 = 4.9;
    const c3 = c1 + 1;
    
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}