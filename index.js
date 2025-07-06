const { Jimp } = require('jimp');
const fs = require('fs');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

async function main() {
    try{
        const rl = readline.createInterface({
            input, output
        });

        const srcDirectory = (await rl.question('Source Directory: '));
        const destination = await rl.question('Destination: ');

        // Get files to combine.
        const files = fs.readdirSync(`${srcDirectory}/`).sort();
        console.log('Images found in specified directory: ', files, '...');

        // Iterate through the images. First image will dictate the width
        // and height of each frame in the spritesheet and the dimensions
        // of the spritesheet.
        let imageWidth = 0;
        let imageHeight = 0;
        let spritesheet = null;

        console.log('Combining images into spritesheet...');
        for(let i=0; i < files.length; i++) {
            const image = await Jimp.read(`${srcDirectory}/${files[i]}`);

            if (i === 0) {
                imageWidth = image.width;
                imageHeight = image.height;
                spritesheet = new Jimp({
                    width: files.length * imageWidth,
                    height: imageHeight,
                    color: 0x00000000
                });
            }

            const x = i * imageWidth;
            const y = 0; // TODO: Change based on row.
            spritesheet.composite(image, x, y);
        }

        await spritesheet.write(destination);

        console.log(`Spritesheet ${destination} has been created.`);
        process.exit(0);
    } catch(err) {
        console.error('Error: ', err);
        process.exit(-1);
    }
}

main();