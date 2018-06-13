var esprima = require("esprima");

/**
 * Id used for the FormatScript language in the monaco editor
 */
export const formatScriptId: string = "FormatScript";

/**
 * Provides the rules for Syntax Highlighting for FormatScript
 */
export const formatScriptTokens = ():any => {
	return {
		defaultToken: "invalid",

		keywords: [
			'SWITCH', 'Switch', 'CONCATENATE', 'Concatenate', 'CONCAT', 'Concat',
			'AND', 'And', 'OR', 'Or', 'IF', 'If', 'TOSTRING', 'ToString', 'toString',
			'NUMBER', 'Number', 'DATE', 'Date', 'COS', 'Cos', 'cos', 'SIN', 'Sin', 'sin',
			'TOLOCALESTRING', 'ToLocaleString', 'toLocaleString',
			'TOLOCALEDATESTRING', 'ToLocaleDateString', 'toLocaleDateString',
			'TOLOCALETIMESTRING', 'ToLocaleTimeString', 'toLocaleTimeString',
			'true', 'false',
		],

		operators: [
			'>', '<', '?', ':', '==', '<=', '>=', '!=',
			'&&', '||', '+', '-', '*', '/', '&',
		],

		brackets: [
			['(', ')', 'bracket.parenthesis'],
		],

		// common regular expressions
		symbols: /[~!@#%\^&*-+=|\\:`<>.?\/]+/,
		escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
		exponent: /[eE][\-+]?[0-9]+/,

		tokenizer: {
			root: [
				// identifiers and keywords
				[/([a-zA-Z_\$][\w\$]*)(\s*)(:?)/, {
					cases: {
						'$1@keywords': ['keyword', 'white', 'delimiter'],
						'$3': ['key.identifier', 'white', 'delimiter'],   // followed by :
						/*'@default': ['identifier','white','delimiter']*/
					}
				}],

				// Special String values
				['(?<![\w"])[@]currentField(\.email|\.id|\.title|\.sip|\.picture|\.lookupId|\.lookupValue|\.desc)*(?![\w"])', "magic"],
				['(?<![\w"])[@](now|me)(?![\w"])', "magic"],
				['(?<![\w"])[@]window(\.innerHeight|\.innerWidth)(?![\w"])', "magic"],

				// whitespace
				{ include: '@whitespace' },

				// delimiters and operators
				[/[()]/, '@brackets'],
				[/[,.]/, 'delimiter'],
				[/@symbols/, {
					cases: {
						'@operators': 'operator',
						'@default': ''
					}
				}],

				// numbers
				[/\d+\.\d*(@exponent)?/, 'number.float'],
				[/\.\d+(@exponent)?/, 'number.float'],
				[/\d+@exponent/, 'number.float'],
				[/0[xX][\da-fA-F]+/, 'number.hex'],
				[/0[0-7]+/, 'number.octal'],
				[/\d+/, 'number'],

				// strings: recover on non-terminated strings
				[/".*?"".*?"/, 'string.invalid'],
				[/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
				[/"sp-field-(severity--(good|low|warning|severeWarning|blocked)|dataBars|customFormatBackground|trending--(up|down)|quickAction)"/, 'specialclass'],
				[/"/, 'string', '@string."'],

			],

			whitespace: [
				[/[ \t\r\n]+/, 'white'],
			],

			string: [
				[/[^\\"']+/, 'string'],
				[/@escapes/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/["']/, {
					cases: {
						'$#==$S2': { token: 'string', next: '@pop' },
						'@default': 'string'
					}
				}]
			],

		},
	};
};

/**
 * Provides the colors for Syntax Highlighting for FormatScript
 */
export const formatScriptTheme = (useDark:boolean):any => {
	const background:string = useDark ? '212121' : 'FFFFFF';
	const foreground:string = useDark ? 'FFFFFF' : '212121';
	return {
		base: 'vs',
		inherit: false,
		rules: [
			{
				background: background,
				foreground: foreground,
			},
			{
				token: 'invalid',
				foreground: 'e81123', //red
				fontStyle: 'italic',
			},
			{
				token: 'string.invalid',
				foreground: 'e81123', //red
				fontStyle: 'italic',
			},
			{
				token: 'keyword',
				foreground: '0078d4', //blue
				fontStyle: 'bold',
			},
			{
				token: 'string',
				foreground: foreground,
			},
			{
				token: 'number',
				foreground: 'ff8c00', //orangeLighter
			},
			{
				token: 'operator',
				foreground: '0078d4', //blue
				fontStyle: 'bold',
			},
			{
				token: 'delimiter',
				foreground: useDark ? 'f4f4f4' : '333333', //neutralLighter or neutralPrimary
			},
			{
				token: 'bracket',
				foreground: foreground,
				fontStyle: 'bold',
			},
			{
				token: 'specialclass',
				foreground: useDark ? '00B294' : '008272', //tealLight or teal
				fontStyle: 'bold',
			},
			{
				token: 'magic',
				foreground: 'e3008c', //magentaLight
				fontStyle: 'bold',
			},
		],
		colors: {
			"editor.background": "#" + background,
			"editor.foreground": "#" + foreground,
			"editorCursor.foreground": "#00bcf2", //blueLight
			"editor.lineHighlightBorder": useDark ? "#666666" : "#f4f4f4", //neutralSecondary or neutralLighter
			"editor.lineHighlightBackground": "#" + background,
			"editor.selectionBackground": useDark ? "#666666" : "#eaeaea", //neutralSecondary or neutralLight
			"editor.selectionHighlightBackground": useDark ? "#3c3c3c" : "#f4f4f4", //neutralPrimaryAlt or neutralLighter
			"editorBracketMatch.background": useDark ? "#5c2d91" : "#b4a0ff", //purple or purpleLight
			"editorBracketMatch.border": "#" + background,
			"editorHoverWidget.background": useDark ? "#666666" : "#f4f4f4", //neutralSecondary or neutralLighter
			"list.focusBackground": useDark ? "#666666" : "#f4f4f4", //neutralSecondary or neutralLighter
			"list.highlightForeground": "#00bcf2", //blueLight
			"list.hoverBackground": useDark ? "#a6a6a6" : "#dadada", //neutralTertiary or neutralQuaternaryAlt
			"editorWidget.background": useDark ? "#3c3c3c" : "#eaeaea", //neutralPrimaryAlt or neutralLight
			"editorWidget.border": useDark ? "#a6a6a6" : "#dadada", //neutralTertiary or neutralQuaternaryAlt
		}
	};
};

/**
 * Provides the language configuration for FormatScript
 */
export const formatScriptConfig = ():any => {
	return {
		autoClosingPairs: [
			{
				open: "(",
				close: ")",
			},
			{
				open: '"',
				close: '"',
			},
			{
				open: '[',
				close: ']',
			},
		],
		surroundingPairs: [
			{
				open: "(",
				close: ")",
			},
			{
				open: '"',
				close: '"',
			},
			{
				open: '[',
				close: ']',
			},
		],
		brackets: [["(", ")"]],
	};
};

export const formatScriptCompletionProvider = ():any => {
	return {
		//triggerCharacters: ["."],
		provideCompletionItems: () => {
			return [
				{
					label: 'CONCATENATE',
					kind: 1, //method
					insertText: {
						value: 'CONCATENATE(${1:@currentField},${2:"%"})'
					},
					documentation: "Add 2 or more strings together",
				},
				{
					label: 'COS',
					kind: 1, //method
					insertText: {
						value: 'COS(${1:@currentField})',
					},
				},
				{
					label: 'SIN',
					kind: 1, //method
					insertText: {
						value: 'SIN(${1:@currentField})',
					},
				},
				{
					label: 'TOSTRING',
					kind: 1, //method
					insertText: {
						value: 'TOSTRING(${1:@currentField})',
					},
				},
				{
					label: 'NUMBER',
					kind: 1, //method
					insertText: {
						value: 'NUMBER(${1:@currentField})',
					},
				},
				{
					label: 'DATE',
					kind: 1, //method
					insertText: {
						value: 'DATE(${1:@currentField})',
					},
				},
				{
					label: 'TOLOCALESTRING',
					kind: 1, //method
					insertText: {
						value: 'TOLOCALESTRING(${1:@currentField})',
					},
				},
				{
					label: 'TOLOCALEDATESTRING',
					kind: 1, //method
					insertText: {
						value: 'TOLOCALEDATESTRING(${1:@currentField})',
					},
				},
				{
					label: 'TOLOCALETIMESTRING',
					kind: 1, //method
					insertText: {
						value: 'TOLOCALETIMESTRING(${1:@currentField})',
					},
				},
				{
					label: 'OR',
					kind: 1, //method
					insertText: {
						value: 'OR(${1:@currentField},${2:true})',
					},
				},
				{
					label: 'AND',
					kind: 1, //method
					insertText: {
						value: 'AND(${1:@currentField},${2:true})',
					},
				},
				{
					label: 'IF',
					kind: 1, //method
					insertText: {
						value: 'IF(${1:@currentField},${2:true},${3:false})'
					}
				},
				{
					label: 'SWITCH',
					kind: 1, //method
					insertText: {
						value: 'SWITCH(${1:@currentField},${2:"case1"},${3:"result1"},${4:"case2"},${5:"result2"},${6:"default"})',
					},
				},
				{
					label: '@now',
					kind: 4, //field
					filterText: 'now',
				},
				{
					label: '@me',
					kind: 4, //field
					filterText: 'me',
				},
				{
					label: '@currentField',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: '@currentField.desc',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'desc',
					kind: 9, //property
				},
				{
					label: '@currentField.id',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'id',
					kind: 9, //property
				},
				{
					label: '@currentField.title',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'title',
					kind: 9, //property
				},
				{
					label: '@currentField.email',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'email',
					kind: 9, //property
				},
				{
					label: '@currentField.picture',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'picture',
					kind: 9, //property
				},
				{
					label: '@currentField.sip',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'sip',
					kind: 9, //property
				},
				{
					label: '@currentField.lookupValue',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'lookupValue',
					kind: 9, //property
				},
				{
					label: '@currentField.lookupId',
					kind: 4, //field
					filterText: 'currentField',
				},
				{
					label: 'lookupId',
					kind: 9, //property
				},
				{
					label: '@window.innerHeight',
					kind: 4, //field
					filterText: 'window',
				},
				{
					label: 'innerHeight',
					kind: 9, //property
				},
				{
					label: '@window.innerWidth',
					kind: 4, //field
					filterText: 'window',
				},
				{
					label: 'innerWidth',
					kind: 9, //property
				},
				{
					label: 'sp-field-severity--good',
					kind: 15, //color
					insertText: '"sp-field-severity--good"',
				},
				{
					label: 'sp-field-severity--low',
					kind: 15, //color
					insertText: '"sp-field-severity--low"',
				},
				{
					label: 'sp-field-severity--warning',
					kind: 15, //color
					insertText: '"sp-field-severity--warning"',
				},
				{
					label: 'sp-field-severity--severeWarning',
					kind: 15, //color
					insertText: '"sp-field-severity--severeWarning"',
				},
				{
					label: 'sp-field-severity--blocked',
					kind: 15, //color
					insertText: '"sp-field-severity--blocked"',
				},
				{
					label: 'sp-field-dataBars',
					kind: 15, //color
					insertText: '"sp-field-dataBars"',
				},
				{
					label: 'sp-field-trending--up',
					kind: 15, //color
					insertText: '"sp-field-trending--up"',
				},
				{
					label: 'sp-field-trending--down',
					kind: 15, //color
					insertText: '"sp-field-trending--down"',
				},
				{
					label: 'sp-field-quickAction',
					kind: 15, //color
					insertText: '"sp-field-quickAction"',
				},
				{
					label: 'sp-field-customFormatBackground',
					kind: 15, //color
					insertText: '"sp-field-customFormatBackground"',
				},
			];
		}
	};
};


export interface IFormatOperation {
	operation: string;
	operands: Array<string|any|boolean|number>;
}

export interface IFSParseError {
	message: string;
	loc?: {
		start: {
			line: number;
			column: number;
		},
		end: {
			line: number;
			column: number;
		}
	};
}

export interface IFSParseResult {
	result?: IFormatOperation | any;
	errors: Array<IFSParseError>;
}

const CF:string = "__CURRENTFIELD__";
const ME:string = "__ME__";
const NOW:string = "__NOW__";
const WINDOW:string = "__WINDOW__";

const fsKeywordToOperation = (keyword:string): string | undefined => {
	switch (keyword.toLowerCase()) {
		case "concatenate":
		case "concat":
		case "&":
		case "+":
			return "+";
		case "and":
		case "&&":
			return "&&";
		case "or":
		case "||":
			return "||";
		case "if":
		case "switch":
		case "?":
			return "?";
		case "tostring":
			return "toString()";
		case "number":
			return "Number()";
		case "date":
			return "Date()";
		case "tolocalestring":
			return "toLocaleString()";
		case "tolocaledatestring":
			return "toLocaleDateString()";
		case "tolocaletimestring":
			return "toLocaleTimeString()";
		case "-":
		case "/":
		case "*":
		case "<":
		case "<=":
		case ">":
		case ">=":
		case "==":
		case "!=":
		case "cos":
		case "sin":
			return keyword;
		default:
			return undefined;
	}
};

/**
 * Returns the minimum number of arguments for the given operation
 * when used as a callexpression (function)
 * @param operation The operation (assumes valid and translated)
 */
const callExpressionMinArgCount = (operation:string): number => {
	switch (operation) {
		case "+":
		case "?":
		case "&&":
		case "||":
			return 2;
		default:
			return 1;
	}
};

/**
 * Returns the maximum number of arguments for the given operation
 * when used as a callexpression (function)
 * @param operation The operation (assumes valid and translated)
 */
const callExpressionMaxArgCount = (operation:string): number => {
	switch (operation) {
		case "+":
		case "?":
		case "&&":
		case "||":
			return -1; //unlimited
		default:
			return 1;
	}
};

const parseFormatScript = (expression:any): IFSParseResult => {
	let parseResult: IFSParseResult = {
		errors: new Array<IFSParseError>(),
	};

	try {
		switch (expression.type) {
			case "CallExpression":
				//Figure out the operation
				const ceOperation = fsKeywordToOperation(expression.callee.name);
				if (typeof ceOperation == "undefined") {
					parseResult.errors.push({
						message: "Unknown Function: " + expression.callee.name,
						loc: expression.callee.loc,
					});
					return parseResult;
				}

				//Validate the minimum number of args are supplied
				const minArgs = callExpressionMinArgCount(ceOperation);
				const maxArgs = callExpressionMaxArgCount(ceOperation);
				if (minArgs > expression.arguments.length || (maxArgs !== -1 && maxArgs < expression.arguments.length)) {
					parseResult.errors.push({
						message: expression.callee.name + " expects " + (maxArgs == -1 ? "at least " + minArgs + " arguments" : (minArgs==maxArgs ? minArgs + (minArgs == 1 ? " argument" : " arguments") : minArgs + "-" + maxArgs + " arguments")),
						loc: expression.loc,
					});
					return parseResult;
				}

				parseResult.result = {
					operation: ceOperation,
					operands: new Array<string|any|boolean|number>(),
				};

				//Process each operand
				expression.arguments.forEach((arg:any) => {
					const operandResult = parseFormatScript(arg);
					if(typeof operandResult.result !== "undefined") {
						parseResult.result.operands.push(operandResult.result);
					}
					if(operandResult.errors.length > 0) {
						parseResult.errors.push(...operandResult.errors);
					}
				});

				break;

			case "BinaryExpression":
				//Figure out the operation
				const beOperation = fsKeywordToOperation(expression.operator);
				if (typeof beOperation == "undefined") {
					parseResult.errors.push({
						message: "Unknown Operator: " + expression.operator,
						loc: expression.loc,
					});
					return parseResult;
				}

				parseResult.result = {
					operation: beOperation,
					operands: new Array<string|any|boolean|number>(),
				};

				//Process the left operand
				const leftResult = parseFormatScript(expression.left);
				if(typeof leftResult.result !== "undefined") {
					parseResult.result.operands.push(leftResult.result);
				}
				if(leftResult.errors.length > 0) {
					parseResult.errors.push(...leftResult.errors);
				}

				//Process the right operand
				const rightResult = parseFormatScript(expression.right);
				if(typeof rightResult.result !== "undefined") {
					parseResult.result.operands.push(rightResult.result);
				}
				if(rightResult.errors.length > 0) {
					parseResult.errors.push(...rightResult.errors);
				}

				break;

			case "ConditionalExpression":

				parseResult.result = {
					operation: "?",
					operands: new Array<string|any|boolean|number>(),
				};

				//Process the Test
				const testResult = parseFormatScript(expression.test);
				if(typeof testResult.result !== "undefined") {
					parseResult.result.operands.push(testResult.result);
				}
				if(testResult.errors.length > 0) {
					parseResult.errors.push(...testResult.errors);
				}

				const consequentResult = parseFormatScript(expression.consequent);
				if(typeof consequentResult.result !== "undefined") {
					parseResult.result.operands.push(consequentResult.result);
				}
				if(consequentResult.errors.length > 0) {
					parseResult.errors.push(...consequentResult.errors);
				}

				const alternateResult = parseFormatScript(expression.alternate);
				if(typeof alternateResult.result !== "undefined") {
					parseResult.result.operands.push(alternateResult.result);
				}
				if(alternateResult.errors.length > 0) {
					parseResult.errors.push(...alternateResult.errors);
				}

				break;

			case "Identifier":
				switch(expression.name) {
					case ME:
						parseResult.result = "@me";
						break;
					case NOW:
						parseResult.result = "@now";
						break;
					case CF:
						parseResult.result = "@currentField";
						break;
					default:
						parseResult.errors.push({
							message: "Unknown Identifier: " + expression.name,
							loc: expression.loc,
						});
				}

				break;

			case "MemberExpression":
			//TODO: add support for field refs
				switch(expression.object.name) {
					case CF:
						switch(expression.property.name) {
							case "desc":
								parseResult.result = "@currentField.desc";
								break;
							case "id":
								parseResult.result = "@currentField.id";
								break;
							case "email":
								parseResult.result = "@currentField.email";
								break;
							case "title":
								parseResult.result = "@currentField.title";
								break;
							case "picture":
								parseResult.result = "@currentField.picture";
								break;
							case "sip":
								parseResult.result = "@currentField.sip";
								break;
							case "lookupValue":
								parseResult.result = "@currentField.lookupValue";
								break;
							case "lookupId":
								parseResult.result = "@currentField.lookupId";
								break;
							default:
								parseResult.errors.push({
									message: "Unknown Property: " + expression.property.name,
									loc: expression.loc,
								});
						}
						break;
						
					case WINDOW:
						switch(expression.property.name) {
							case "innerHeight":
								parseResult.result = "@window.innerHeight";
								break;
							case "innerWidth":
								parseResult.result = "@window.innerWidth";
								break;
							default:
								parseResult.errors.push({
									message: "Unknown Property: " + expression.property.name,
									loc: expression.loc,
								});
						}
						break;

					default:
						parseResult.errors.push({
							message: "Unknown Identifier: " + expression.object.name,
							loc: expression.object.loc,
						});
				}
				
				break;

			case "Literal":
				parseResult.result = expression.value;
				break;

			default:
				parseResult.errors.push({
					message: "Unknown Syntax",
					loc: expression.loc,
				});
		}
	} catch (error) {
		parseResult.errors.push({
			message: error,
			loc: expression.loc,
		});
	}

	return parseResult;
};

export const formatScriptToJSON = (fs:string): IFSParseResult => {
	//preprocess FormatScript to remove @ keywords (esprima will error out otherwise)
	const tokenFS = fs.replace("@currentField", CF).replace("@me", ME).replace("@now", NOW).replace("@window", WINDOW);

	let result: IFSParseResult = {
		errors: new Array<IFSParseError>(),
	};

	try {
		const syntaxTree = esprima.parseScript(tokenFS, { loc: true });
		console.log(syntaxTree);
		if (syntaxTree.body.length > 1) {
			result.errors.push({
				message: "You can only have 1 top level function! (feel free to nest them though)",
				loc: syntaxTree.body[1].expression.loc,
			});
		} else {
			result = parseFormatScript(syntaxTree.body[0].expression);
		}
	} catch (error) {
		result.errors.push({
			message: error,
		});
	}

	console.log(result);
	if(result.errors.length == 0) {
		console.log(JSON.stringify(result.result));
	}
	return result;
};