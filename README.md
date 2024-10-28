# Codename Engine Website

**To contribute to this wiki's pages**, please go to ``./src/pages/wiki/``, and change the .md files (if you add a new one make sure to add it in ``./src/pages/wiki.json``.)

**To update the API Docs**, please go to ``./src/pages/api-docs/``, and paste the results from the ``art/generateDocs.bat`` (From the main repo) script.

**To make tools work**, please go to ``./src/pages/tools/`` and make your page there, and when you're done, add it to the list in ``tools.build.js`` and ``./src/pages/tools/index.html``, then after you're done, make a PR.

## Compiling the docs

To compile the docs, you need to have [nodejs](https://nodejs.org/en/) installed.

Then, run the following commands:

```bash
npm install
npm run build
```

This will compile the docs and place them in the ``export`` folder.


https://www.timestamp-converter.com/ Use this to get the time in ISO 8601 format.