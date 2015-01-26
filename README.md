#glitchbone-starter

Glitchbone Frontend Starter Kit

##Installation

```sh
git clone --depth=1 https://github.com/Glitchbone/starter.git my_project
cd my_project
rm -rf .git
npm install
bower install
```

##Usage

Launch development server:
```sh
grunt serve
```

Build project in dist folder:
```sh
grunt build
```

##SASS structure

├── _modules-list.scss
├── base
│   ├── _colors.scss
│   ├── _fonts.scss
│   ├── _typography.scss
│   └── _variables.scss
├── layout
│   ├── _global.scss
│   └── _grid.scss
├── main.scss
└── modules
    └── _my-module.scss

##Author

**Adrien Glitchbone**

+ [https://twitter.com/glitchbone](https://twitter.com/glitchbone)
+ [http://github.com/Glitchbone](http://github.com/Glitchbone)