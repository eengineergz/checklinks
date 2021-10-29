const inBrowser = typeof exports === 'undefined';
const parseAndModify = (inBrowser ? window.falafel : require("./lib/falafel").falafel);

(inBrowser ? window : exports).blanket = (() => {
    const linesToAddTracking = [
        "ExpressionStatement",
        "LabeledStatement"   ,
        "BreakStatement"   ,
        "ContinueStatement" ,
        "VariableDeclaration",
        "ReturnStatement"   ,
        "ThrowStatement"   ,
        "TryStatement"     ,
        "FunctionDeclaration"    ,
        "IfStatement"       ,
        "WhileStatement"    ,
        "DoWhileStatement"      ,
        "ForStatement"   ,
        "ForInStatement"  ,
        "SwitchStatement"  ,
        "WithStatement"
    ];

    const linesToAddBrackets = [
        "IfStatement"       ,
        "WhileStatement"    ,
        "DoWhileStatement"      ,
        "ForStatement"   ,
        "ForInStatement"  ,
        "WithStatement"
    ];

    const covVar = (inBrowser ?   "window._$blanket" : "_$jscoverage" );
    let __blanket;
    const copynumber = Math.floor(Math.random()*1000);
    const coverageInfo = {};

    const options = {
        reporter: null,
        adapter:null,
        filter: null,
        orderedLoading: true,
        loader: null,
        ignoreScriptError: false,
        existingRequireJS:false,
        autoStart: false
    };

    if (inBrowser && typeof window.blanket !== 'undefined'){
        __blanket = window.blanket.noConflict();
    }

    _blanket = {
        noConflict() {
            if (__blanket){
                return __blanket;
            }
            return _blanket;
        },
        _getCopyNumber() {
            //internal method
            //for differentiating between instances
            return copynumber;
        },
        extend(obj) {
            //borrowed from underscore
            _blanket._extend(_blanket,obj);
        },
        _extend(dest, source) {
          if (source) {
            for (const prop in source) {
              if ( dest[prop] instanceof Object && typeof dest[prop] !== "function"){
                _blanket._extend(dest[prop],source[prop]);
              }else{
                  dest[prop] = source[prop];
              }
            }
          }
        },
        options(key, value) {
            if (typeof key !== "string"){
                _blanket._extend(options,key);
            }else if (typeof value === 'undefined'){
                return options[key];
            }else{
                options[key]=value;
            }
        },
        instrument({inputFile, inputFileName}, next) {
            const inFile = inputFile;
            const inFileName = inputFileName;
            const sourceArray = _blanket._prepareSource(inFile);
            _blanket._trackingArraySetup=[];
            let instrumented =  parseAndModify(inFile,{loc:true,comment:true}, _blanket._addTracking,inFileName);
            instrumented = _blanket._trackingSetup(inFileName,sourceArray)+instrumented;
            next(instrumented);
        },
        _trackingArraySetup: [],
        _prepareSource(source) {
            return source.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/(\r\n|\n|\r)/gm,"\n").split('\n');
        },
        _trackingSetup(filename, sourceArray) {
            
            const sourceString = sourceArray.join("',\n'");
            let intro = `if (typeof ${covVar} === 'undefined') ${covVar} = {};\n`;
            intro += `if (typeof ${covVar}['${filename}'] === 'undefined'){`;
            
            intro += `${covVar}['${filename}']=[];\n`;
            intro += `${covVar}['${filename}'].source=['${sourceString}'];\n`;
            //initialize array values
            _blanket._trackingArraySetup.sort((a, b) => parseInt(a,10) > parseInt(b,10)).forEach(item => {
                intro += `${covVar}['${filename}'][${item}]=0;\n`;
            });

            intro += "}";
            return intro;
        },
        _blockifyIf({type, consequent, body, alternate}) {
            
            if (linesToAddBrackets.includes(type)){
                const bracketsExistObject = consequent || body;
                const bracketsExistAlt = alternate;
                if( bracketsExistAlt && bracketsExistAlt.type !== "BlockStatement") {
                    bracketsExistAlt.update(`{\n${bracketsExistAlt.source()}}\n`);
                }
                if( bracketsExistObject && bracketsExistObject.type !== "BlockStatement") {
                    bracketsExistObject.update(`{\n${bracketsExistObject.source()}}\n`);
                }
            }
        },
        _addTracking(node, filename) {
            _blanket._blockifyIf(node);
            if (linesToAddTracking.includes(node.type)){
                if (node.type === "VariableDeclaration" &&
                    (node.parent.type === "ForStatement" || node.parent.type === "ForInStatement")){
                    return;
                }
                if (node.loc && node.loc.start){
                    node.update(`${covVar}['${filename}'][${node.loc.start.line}]++;\n${node.source()}`);
                    _blanket._trackingArraySetup.push(node.loc.start.line);
                }else{
                    //I don't think we can handle a node with no location
                    throw new Error(`The instrumenter encountered a node with no location: ${Object.keys(node)}`);
                }
            }
        },
        setupCoverage() {
            coverageInfo.instrumentation = "blanket";
            coverageInfo.stats = {
                "suites": 0,
                "tests": 0,
                "passes": 0,
                "pending": 0,
                "failures": 0,
                "start": new Date()
            };
        },
        _checkIfSetup() {
            if (!coverageInfo.stats){
                throw new Error("You must call blanket.setupCoverage() first.");
            }
        },
        onTestStart() {
            this._checkIfSetup();
            coverageInfo.stats.tests++;
            coverageInfo.stats.pending++;
        },
        onTestDone(total, passed) {
            this._checkIfSetup();
            if(passed === total){
                coverageInfo.stats.passes++;
            }else{
                coverageInfo.stats.failures++;
            }
            coverageInfo.stats.pending--;
        },
        onModuleStart() {
            this._checkIfSetup();
            coverageInfo.stats.suites++;
        },
        onTestsDone() {
            this._checkIfSetup();
            coverageInfo.stats.end = new Date();
            if (typeof exports === 'undefined'){
                this.report(coverageInfo);
            }else{
                this.options("reporter").call(this,coverageInfo);
            }
        }
    };
    return _blanket;
})();
