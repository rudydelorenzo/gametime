![GameTime Banner](assets/banner.png)

# Welcome to GameTime

An Electron app born out of necessity. It provides a GUI to generate JSON files that are in turn used to make skinned broadcast graphics 
in NewBlue Titler.

## Developer Notes
This git does not include node-modules. However, a simple `npm install`
command will install all dependencies.

Generate app icons with `./node_modules/.bin/electron-icon-builder --input=assets/logodark.png --output=./ --flatten`

| OS      | Icon location       |
|---------|---------------------|
| macOS   | icons/icon.icns     |
| Windows | icons/icon.ico      |
| Linux   | icons/1024x1024.png |

Run app with `npm start`.

Build app with `npm run make`.

## Dependencies
* electron
* electron-forge
* electron-icon-maker
