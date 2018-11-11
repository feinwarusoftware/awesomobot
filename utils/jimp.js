"use strict";

const { colourDistance } = require("./misc");

const textWidth = (font, str) => {
                                                                        
    let width = 0;

    for (let i = 0; i < str.length; i++) {

        if (font.chars[str[i]] === undefined) {

            width += 0; 
            
        } else {

            width += font.chars[str[i]].xoffset + font.chars[str[i]].xadvance;       
        }                                                                   
    }

    return width;
}

const printCenter = (src, font, x, y, str, wrap = src.bitmap.width) => {

    let words = str.split(" ");

    let width = 0;
    let numLines = 0;
    let lastWord = 0;

    for (let i = 0; i < words.length; i++) {
        if (width + textWidth(font, words[i]) > wrap) {

            let text = "";
            for (let j = lastWord; j < i; j++) {
                text += words[j] + " ";
            }

            src.print(font, (src.bitmap.width / 2 - width / 2) + x, y + (numLines * font.chars["$"].height) + 5, text);

            lastWord = i;
            numLines++;
            width = 0;
        }

        width += textWidth(font, words[i]);
    }

    let text = "";
    for (let i = lastWord; i < words.length; i++) {
        text += words[i] + " ";
    }

    src.print(font, (src.bitmap.width / 2 - width / 2) + x, y + (numLines * font.chars["$"].height) + 5, text);
};

const printCenterCenter = (src, font, x, y, str, wrap = src.bitmap.width) => {

    let words = str.split(" ");

    let width = 0;
    let numLines = 0;

    for (let i = 0; i < words.length; i++) {
        if (width + textWidth(font, words[i]) > wrap) {

            numLines++;
            width = 0;
        }

        width += textWidth(font, words[i]);
    }

    let yoffset = 0;
    if (numLines === 3) {
        yoffset = 5;
    }
    if (numLines === 4) {
        yoffset = 10;
    }

    printCenter(src, font, x, (src.bitmap.height / 2 - ((numLines * font.chars["$"].height) + (numLines - 1) * 5)) / 2 + y + yoffset, str, wrap);
};

const getTextHeight = (font, str, wrap) => {

    const words = str.split(" ");

    let width = 0;
    let numLines = 0;

    for (let i = 0; i < words.length; i++) {
        if (width + textWidth(font, words[i]) > wrap) {

            numLines++;
            width = 0;
        }

        width += textWidth(font, words[i]);
    }

    return (font.chars["$"].height * numLines + font.chars["$"].yoffset * (numLines - 1));
}

const colourPrint = (src, font, x, y, str, colour, mix = "100") => {

    const text = new jimp(textWidth(font, str), font.common.lineHeight);

    text.print(font, 0, 0, str);
    text.color([
        { apply: "mix", params: [colour, mix] }
    ]);

    src.composite(text, x, y);
}

const colourText = (font, str, colour, mix = "100") => {

    const text = new jimp(textWidth(font, str), font.common.lineHeight);

    text.print(font, 0, 0, str);
    text.color([
        { apply: "mix", params: [colour, mix] }
    ]);

    return text;
}

const plainText = (font, str) => {

    const text = new jimp(textWidth(font, str), font.common.lineHeight);

    text.print(font, 0, 0, str);

    return text;
}

const magicRecolour = (src, targetColour, replaceColour, threshold) => {

    src.scan(0, 0, src.bitmap.width, src.bitmap.height, (x, y, idx) => {

        const thisColour = {

            r: src.bitmap.data[idx + 0],
            g: src.bitmap.data[idx + 1],
            b: src.bitmap.data[idx + 2],
            a: src.bitmap.data[idx + 3]
        };

        if (colourDistance(targetColour, thisColour) <= threshold) {

            src.bitmap.data[idx + 0] = replaceColour.r;
            src.bitmap.data[idx + 1] = replaceColour.g;
            src.bitmap.data[idx + 2] = replaceColour.b;
            src.bitmap.data[idx + 3] = replaceColour.a;
        }
    });
}



module.exports = {

    textWidth,
    printCenter,
    printCenterCenter,
    getTextHeight,
    colourPrint,
    colourText,
    plainText,
    magicRecolour
};