# DECISIONS.md

## 1. API Fetch Mechanism

Didn't want to write fetch calls directly inside components because if the same data was needed somewhere else I'd have to copy paste the whole thing. So I made two hooks — `useProducts` for the listing page and `useProduct(id)` for the detail page. Components just call the hook and get status + data back, they don't need to know anything about the API. also if the API URL changes or i move to a real backend later, only the hook needs to be updated, nothing else breaks.

---

## 2. Global Styles

There's a `global.scss` file where colors, fonts and some utility classes like `.page-wrapper` and `.skeleton` are defined. So instead of writing the same color values in every component file, define them once as CSS variables and use them everywhere.
If the primary color needs to change, it's a one line change. Component scss files only have layout stuff specific to that component.

---

## 3. How Data Persists

There are basically three things keeping data alive in this app —

React state keeps things in memory while you're on the page. Context lifts that state up so multiple components can access it without passing props everywhere. This is used for the cart so the navbar, product cards and the drawer all stay in sync.And localStorage handles the cart between sessions.Every time cart items change it writes to localStorage, and when the app loads it reads it back. with URL Params to we have added the values like size and color so on refresh we can get same data.

---

## What I'd Do Differently

Retry on API failure: right now if the fetch fails it shows an error straight away. we should try 2-3 times before throwing error

Cart in two tabs are not synced: if the app is open in two tabs and something is added in one, the other tab won't update.I need to listen to localStorage change events to fix this.

Adding granular elemnts: currently i have different componets like card and skeleton and all but we can build it in a manner like atom-> molecule->body. like we can have buttons,font style, swatches then we can build some thing like a card or a navbar with them and then we can also build some common pages like error handling or succes page using all these things at one place.

Also Did not implement proper error handling we can work on adding error boundary and display errors.


adding better web accessibility