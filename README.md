# polymer-component-seed
This is a polymer component seed which you can use to build your polymer component.  

This comes with a few grunt task to enable easier development and distrubtion/release.  

Some Features:  
- demo page is setup with the polybuild output
- unit testing support
- development environment is setup to allow module/class based coding  
- Files are watched and polybuild will merge them together
- The grunt server has livereload  to automatically refresh the page
- master branch is a orphan branch to only contain the final distribution files and demo page.

#Prerequites
- Node
- Bower
- Grunt
- Polybuild (https://github.com/PolymerLabs/polybuild)
- GIT (optional)

#Setup  
1. Clone repo or download the zip
2. run `npm install`
3. run `bower install`
4. (optional) If you wish to rename the component from `seed-component` to your desired name you can run the following grunt task.  This will replace all instances of `seed-component` in every file.
```
grunt rename --name=my-component
```
This will replace all instances of `seed-component` name in the project folder.

# Folder Structure

`demo/` : This is where you create your demo. The index page is linked to `dist` folder files.  
`test/` : This is where you create your unit tests. 
`src/` : This is where your development code goes.   
`--js/` : This is for your script files   
`--style`/ : This is for yout component css files. In the component html file I have added a style include which doesnt exist '-theme'. This is to all for custom theming.    
`dist/` : This is where grunt will create the distribution files  

# Component Development 

Run `grunt develop` and your browser should open localhost with your project. Navigate to `demo/` and make changes to the files in `src/` to see livereload working.

# Releasing Component

Once you want to push the files to the master branch ensure your develop branch is committed and run `grunt release` this will push only the distribution files and the demo page to master with the correct linkage to allow the demo page to work.

#Grunt Tasks  

`grunt develop` : to run a server, file watching, livereload and distribution creation as files change  
`grunt serve` : this will spin up a server  
`grunt dist` : this will create the distribution files  
`grunt release` : release the component to the master branch  

#Usage  

Check out the demo page to see the usage.   
Below is a few examples:

##Example

```html
<polymer-component-seed></polymer-component-seed>
```

###Attributes

| name  | values | description  |  
|---|---|---|  
|`tracking-tag`| String| This will be the tracking tag for the link|   
|`title`| String| This will be the title string for the component|  
|`description`| String| This will be the body copy for the component|  
|`link-title`| String| This will be the link text for the component|  
|`link`| String| This will be the link for the component|  
