# YGO ODB

An online, fan-made Yu-Gi-Oh! deck builder.

## Introduction

This Yu-Gi-Oh! web application is not meant to be a full-fledged deck builder, but something that is good enough to get the job done. After all, this is only a side project of mine done in my free time that will be added to my portfolio eventually. It was made with the intent of readily building and editing decks in the comfort of your web browser. There are no plans to support other importing and exporting methods. There is no intent to include other formats like Speed Duels, GOAT, etc.

### Features

- Drag-and-drop functionality to add, transfer, and remove cards.
- Visual feedback while dragging a card.
- Add to, remove from, and transfer multiple card copies (max. 3) to a new deck drop zone from the previous in one go (desktop version only).
- View card information via tooltips or modal (if using a touch-screen device).
- Deck import and export through YDK files and YDKe URLs.
- Card filtering and sorting.
- Light and dark modes. It also respects your device's system theme.
- Display alternative artworks of cards (if there are any).

### Supported Formats

- OCG
- TCG
- Genesys

## Development

### Prerequisites

- [Git](https://git-scm.com/install/)
- [Node.js](https://nodejs.org/en/download)
- NPM (already included in Node.js)

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur if you have it installed in your VSCode extensions)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

**Other VSCode extensions (not required)**

- [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)
- [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets)
- [Vue 3 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets)

### Project Setup

1. Clone the repository.
2. Run `npm i` at the root of the cloned directory to install dependencies.
3. Execute `npm run dev` to start the development server.

### Optional

- Run `npm run lint` to enforce coding conventions and improve overall code quality and consistency.

### Production

- Execute `npm run build` to build the application if you are ready to deploy it.
- The build output can be found in the `dist` folder.

## Contact

You may go to my GitHub profile and find my email there.

If you have suggestions and/or improvements about the app, you may open an issue [here](https://github.com/jjmtazcuetajr/ygo-odb/issues).

If you have problems about the card data accuracy, it's YGOPRODeck's fault. They are frequently slow on updating their API probably because very few people work on it. You can either open an issue in their GitHub [issue tracker](https://github.com/AlanOC91/YGOPRODeck) (response not guaranteed) or, much better, contact them in their Discord server.

## Credits

- [YGOPRODeck](https://ygoprodeck.com) for the API for all card data.
- Other deck builders and duel simulators out there that this application take inspiration from.

## License

Please check it [here](https://github.com/jjmtazcuetajr/ygo-odb/blob/main/LICENSE).

## Disclaimer

Yu-Gi-Oh! is a trademark of Shueisha and Konami. This project is not produced by, endorsed by, supported by, or affiliated with Shueisha or Konami.
