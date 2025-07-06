const { Jimp } = require('jimp');
const fs = require('fs');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

async function main() {
    try{
        const rl = readline.createInterface({
            input, output
        });

        const srcDirectory = await rl.question('Source Directory: ');
        const destination = await rl.question('Destination: ');
        const columnsCount = parseInt(await rl.question('Number of columns: '));

        // Get files to combine.
        const files = fs.readdirSync(`${srcDirectory}/`).sort();
        console.log(`${files.length } images found in specified directory...`);

        // Iterate through the images. First image will dictate the width
        // and height of each frame in the spritesheet and the dimensions
        // of the spritesheet.
        let imageWidth = 0;
        let imageHeight = 0;
        let spritesheet = null;

        let currentColumn = 0;
        let currentRow = 0;
        const rowCount = Math.round(files.length / columnsCount) + files.length % columnsCount

        console.log(`Columns: ${columnsCount}, Calculated rows: ${rowCount}`);
        console.log('Combining images into spritesheet...');
        for(let i=0; i < files.length; i++) {
            const image = await Jimp.read(`${srcDirectory}/${files[i]}`);

            if (i === 0) {
                imageWidth = image.width;
                imageHeight = image.height;
                spritesheet = new Jimp({
                    width: imageWidth * columnsCount,
                    height: imageHeight * rowCount,
                    color: 0x00000000
                });
            }

            if (currentColumn >= columnsCount) {
                currentColumn = 0;
                currentRow++;
            } else if (i === files.length - 1 && files.length % columnsCount > 0) {
                currentRow++;
            }

            const x = currentColumn * imageWidth;
            const y = currentRow * imageHeight;
            spritesheet.composite(image, x, y);

            currentColumn++;
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