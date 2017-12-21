This is a fork of the official
Prismic toolbar, with my pull requests on the official repository merged.

# Prismic toolbar
The prismic toolbar is integrated to your website for:
 - Preview unpublished changes (drafts and releases)
 - Edit button: easy access to the corresponding document in the Prismic Backend.
 - A/B testing (experiments)

## How to use it?
- Integrated in a client-side application:
```npm install @tremby/prismic-toolbar --save-dev```

If you need to support [browsers which don't implement the `fetch` API](https://caniuse.com/#feat=fetch)
you will probably also want to include a [polyfill](https://github.com/github/fetch).
