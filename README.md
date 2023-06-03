## Usage

### Clone the repository

`git clone <repository-name>`

### Get the app running

1. cd into repository root and run `npm install`
2. To run the app in dev mode run `npm run dev` or `yarn run dev`
3. To run the production version of the app 
 - Run `npm run build`
 - cd into dist folder
 - Run the executable file with command `./hand-histories-1.0.0.AppImage`

### Once you have it running

If you don't have any hand history files, use the file in the `examples` directory in the project root and follow the upload instructions in the upload tab

The upload form only accepts directories. Any nested directories in the chosen directory will have their containing files uploaded. 

If any hand fails to upload, all hands in the containing file will fail and show an error message. 