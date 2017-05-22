![openui5](http://openui5.org/images/OpenUI5_new_big_side.png)

# openui5-worklist-app

> [OpenUI5](https://github.com/SAP/openui5) worklist skeleton app using Grunt & Bower.  The SAPUI5 Worklist Application template implements a typical worklist floorplan, one of the design patterns that is specified by the [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/). It includes generic application functionality and tests that can be easily extended with custom functionality if needed. You can find more documentation on this template [here](https://sapui5.hana.ondemand.com/#docs/guide/a77f2d29299247f8a3e30226507b1765.html).

## Getting started

1. Install node.js (get it from [nodejs.org](http://nodejs.org/)).
  * If working behind a proxy, you need to configure it properly (HTTP_PROXY / HTTPS_PROXY / NO_PROXY environment variables)
2. Install grunt-cli and bower globally

```sh
npm install grunt-cli bower -g
```
3. Clone the repository and navigate into it

```sh
git clone https://github.com/SAP/openui5-worklist-app.git
cd openui5-worklist-app
```

1. Install all npm dependencies

```sh
npm install
```

1. Install all bower dependencies

```sh
bower install
```

5. Run grunt to lint, build and run a local server (have a look into `Gruntfile.js` to see all the tasks).

```sh
grunt
```

6. Open the app in your browser: [http://localhost:8080](http://localhost:8080)
