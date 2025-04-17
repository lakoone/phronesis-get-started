Namaste!

Here you have a list of changes which need to be applied:

The name of the file in widget url should be `great-widget.min.js` instead of `cool-widget.js.`

The <footer /> tag should have an attribute widget-container, because the widget wants to be inserted into the element with this attribute.

All the buttons should have a new attribute checkStat=true, so widget can collect the click statistics.

There is an advanced mode for the widget which allows user to see weather, clicks, and even the current date by Maya calendar. To enable these options customer should insert additional code into the page. Pay attention that the code should be at the bottom of the page right before the closing </body> tag! Also, do not forget to point that there is a block where we catch unexpected advanced mode errors!

Here the code to enable advanced settings:


{% code-snippet 
   prefix="// Example prefix comment\n" 
   file="./migration-guide.html" 
   language="html" 
   from=8
   to=9
   title="hello-world.js" /%}

{% code-snippet 
   prefix="// Example prefix comment\n" 
   file="./migration-guide.html" 
   language="html" 
   after="<!--   after     -->"
   before="<!--   before    -->"
   title="hello-world.js" /%}
   {% code-snippet 
   prefix="// Example prefix comment\n" 
   file="./migration-guide.html" 
   language="html" 
   after=26
   before=34
   title="hello-world.js" /%}

{% code-snippet 
   prefix="// Example prefix comment\n" 
   file="./migration-guide.html" 
   language="html" 
   after="<!--   after     -->"
   before="<!--   before    -->"
   title="hello-world.js" /%}

{% code-snippet 
   prefix="// Example prefix comment\n" 
   file="./migration-guide.html" 
   language="js" 
   after=45
   before=62
   title="hello-world.js" /%}