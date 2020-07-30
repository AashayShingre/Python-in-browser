# Python in browser
Run multiple python compiler in html webpage using [Ace editor](https://ace.c9.io/) with [Skulpt](https://skulpt.org/).

### How to
1. Import [jQuery](https://cdnjs.com/libraries/jquery), [Skulpt](https://www.jsdelivr.com/package/npm/@s524797336/skulpt), and [Ace](https://cdnjs.com/libraries/ace).
 2. Create one `<div class="editor"></div>` and another `<div class="output"></div>`
3.  Create two `button` - one with `class="run-button" onclick=runit(<reference to .editor>, <reference to .output>)`  and another with `class="stop-button"  onclick="stopit()"  style="display: none;"`
 ( refer `example.html` for single editor-console and `example-multiple.html`  for multiple editor-console )
 4. Add the `skulpt-compiler.js` script.
 5. Done!

### External Resources.
1. Customise editor or put values from ace editor [docs](https://ace.c9.io/#nav=api&api=selection).
 
 `example.html` window -
 
![example.html](https://drive.google.com/uc?export=view&id=1todB-w9rlI5LlJjXEEcHtJ2qbZTQnZKe)
