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
	operator: string;
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

const fsKeywordToOperator = (keyword:string): string | undefined => {
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
 * @param operator The operator (assumes valid and translated)
 * @param callee The actual calling expression name (only important when multiple expressions equate to the same operator such as with ?)
 */
const callExpressionMinArgCount = (operator:string, callee:string=""): number => {
	switch (operator) {
		case "+":
		case "&&":
		case "||":
			return 2;
		case "?":
			if(callee.toLowerCase() == "switch") {
				return 3;
			} else {
				return 2;
			}
		default:
			return 1;
	}
};

/**
 * Returns the maximum number of arguments for the given operation
 * when used as a callexpression (function)
 * @param operator The operator (assumes valid and translated)
 */
const callExpressionMaxArgCount = (operator:string): number => {
	switch (operator) {
		case "+":
		case "?":
		case "&&":
		case "||":
			return -1; //unlimited
		default:
			return 1;
	}
};

/**
 * Translates a series of parameters to an IFormatOperation to represent a SWITCH
 * @param testParam This is the value that will be checked against each set of value and result
 * @param params These are the remaining parameters. It is assumed there are at least 2:
 *               the first param is the value to check for equality with the testParam
 *               the second param is the value to use when that equality is true
 *               if there are more than 3 parameters, then a recursive switch is used
 *               if there are exactly 3 parameters, the third param is the value to use when the equality is false
 *               if there are only 2 parameters, then the false value is set as an empty string
 *               This has the effect of making the last parameter the "Default" value
 */
const buildSwitchFormat = (testParam:string, params:Array<string>): IFormatOperation => {
	return {
		operator: "?",
		operands: [
			{
				operator: "==",
				operands: [
					testParam,
					params[0],
				],
			},
			params[1],
			params.length > 3 ? buildSwitchFormat(testParam, params.slice(2)) : (params.length == 3 ? params[2] : ""),
		]
	};
};

/**
 * Translates a series of parameters to an IFormatOperation to represent an IF
 * @param params It is assumed there are at least 2 parameters:
 *               the first param is the boolean value to evaluate
 *               the second param is the value to use when the evaluation is true
 *               if there are more than 3 parameters, then a recursive if is used
 *               if there are exactly 3 parameters, the third param is the value to use when the evaluation is false
 *               if there are only 2 parameters, then the false value is set as an empty string
 */
const buildIfFormat = (params:Array<string>): IFormatOperation => {
	return {
		operator: "?",
		operands: [
			params[0],
			params[1],
			params.length > 3 ? buildIfFormat(params.slice(2)) : (params.length == 3 ? params[2] : ""),
		],
	};
};

const parseFormatScript = (expression:any): IFSParseResult => {
	let parseResult: IFSParseResult = {
		errors: new Array<IFSParseError>(),
	};

	try {
		switch (expression.type) {
			case "CallExpression":
				//Figure out the operator
				const ceOperator = fsKeywordToOperator(expression.callee.name);
				if (typeof ceOperator == "undefined") {
					parseResult.errors.push({
						message: "Unknown Function: " + expression.callee.name,
						loc: expression.callee.loc,
					});
					return parseResult;
				}

				//Validate the minimum number of args are supplied
				const minArgs = callExpressionMinArgCount(ceOperator, expression.callee.name);
				const maxArgs = callExpressionMaxArgCount(ceOperator);
				if (minArgs > expression.arguments.length || (maxArgs !== -1 && maxArgs < expression.arguments.length)) {
					parseResult.errors.push({
						message: expression.callee.name + " expects " + (maxArgs == -1 ? "at least " + minArgs + " arguments" : (minArgs==maxArgs ? minArgs + (minArgs == 1 ? " argument" : " arguments") : minArgs + "-" + maxArgs + " arguments")),
						loc: expression.loc,
					});
					return parseResult;
				}

				parseResult.result = {
					operator: ceOperator,
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

				if (expression.callee.name.toLowerCase() == "switch") {
					parseResult.result = buildSwitchFormat(parseResult.result.operands[0], parseResult.result.operands.slice(1));
				}

				if (expression.callee.name.toLowerCase() == "if") {
					parseResult.result = buildIfFormat(parseResult.result.operands);
				}

				break;

			case "BinaryExpression":
				//Figure out the operator
				const beOperator = fsKeywordToOperator(expression.operator);
				if (typeof beOperator == "undefined") {
					parseResult.errors.push({
						message: "Unknown Operator: " + expression.operator,
						loc: expression.loc,
					});
					return parseResult;
				}

				parseResult.result = {
					operator: beOperator,
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
					operator: "?",
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
				if(typeof expression.value == "string") {
					parseResult.result = expression.value.replace(/__CURRENTFIELD__/g, "@currentField").replace(/__ME__/g, "@me").replace(/__NOW__/g, "@now").replace(/__WINDOW__/g, "@window");
				} else {
					parseResult.result = expression.value;
				}
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
	const tokenFS = fs.replace(/@currentField/g, CF).replace(/@me/g, ME).replace(/@now/g, NOW).replace(/@window/g, WINDOW);

	let result: IFSParseResult = {
		errors: new Array<IFSParseError>(),
	};

	try {
		const syntaxTree = esprima.parseScript(tokenFS, { loc: true });
		//console.log(syntaxTree);
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

	/*console.log(result);
	if(result.errors.length == 0) {
		console.log(JSON.stringify(result.result));
		console.log(JSONToFormatScript(JSON.stringify(result.result)));
	}*/
	return result;
};



const operatorIsInline = (operator:string): boolean => {
	switch (operator) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "<":
		case "<=":
		case ">":
		case ">=":
		case "==":
			return true;
		default:
			return false;
	}
};

const operatorMinOperands = (operator:string): number => {
	switch (operator) {
		case "+":
		case "-":
		case "/":
		case "*":
		case "<":
		case "<=":
		case ">":
		case ">=":
		case "==":
		case "&&":
		case "||":
			return 2;
		case "?":
			return 3;
		default:
			return 1;
	}
};

const operatorMaxOperands = (operator:string): number => {
	switch (operator) {
		case "+":
		case "*":
		case "&&":
		case "||":
			return -1;
		case "-":
		case "/":
		case "<":
		case "<=":
		case ">":
		case ">=":
		case "==":
			return 2;
		case "?":
			return 3;
		default:
			return 1;
	}
};

const operandIsOperation = (operand:any):boolean => {
	return (typeof operand == "object" && operand !== null && operand.hasOwnProperty("operator") && operand.hasOwnProperty("operands"));
};

const operationIsSwitch = (operands:Array<any>):boolean => {
	if(operands.length < 3) {
		return false;
	}
	if(!operandIsOperation(operands[0]) || operands[0].operator !== "==") {
		return false;
	}
	return true;
};

const buildSwitchExpression = (operands:Array<string|number|boolean>): string => {
	const condition:string = operands[0].toString();
	const pivotValue:string = condition.substring(0, condition.lastIndexOf("=="));
	const caseValue:string = condition.substring(condition.lastIndexOf("==")+2);
	const consequent:string = operands[1].toString();
	let alternate:string = operands[2].toString();
	
	//Check if there is a nested SWITCH
	if(typeof operands[2] == "string" && alternate.indexOf("SWITCH(") == 0) {
		//Determine if the nested SWITCH needs to be collapsed into this SWITCH
		const subPivotValue:string = alternate.substring(7,alternate.indexOf("__,__"));
		if(subPivotValue == pivotValue) {
			alternate = alternate.substring(alternate.indexOf("__,__")+5,alternate.length-1);
		}
	}

	return `SWITCH(${pivotValue}__,__${caseValue}__,__${consequent}${alternate !== '""' ? "__,__" + alternate : ""})`;
};

const buildIfExpression = (operands:Array<string|number|boolean>): string => {
	const condition:string = operands[0].toString();
	const consequent:string = operands[1].toString();
	let alternate:string = operands[2].toString();

	//Check if there is a nested IF
	if(typeof operands[2] == "string" && alternate.indexOf("IF(") == 0) {
		//Collapse nested IFs
		alternate = alternate.substring(3,alternate.length-1);
	}

	return `IF(${condition}__,__${consequent}${alternate !== '""' ? "__,__" + alternate : ""})`;
};

const formatObjToFormatScript = (formatObj:any, parentOperator:string = ""): string | number | boolean => {
	if(typeof formatObj == "undefined") {
		return "";
	} 
	if(typeof formatObj == "number" || typeof formatObj == "boolean") {
		//numbers and booleans stay as they are
		return formatObj;
	}

	if(typeof formatObj == "string") {
		//If it is a special string, just return it. Otherwise, wrap it in quotes
		switch (formatObj) {
			case "@currentField":
			case "@currentField.email":
			case "@currentField.id":
			case "@currentField.title":
			case "@currentField.sip":
			case "@currentField.picture":
			case "@currentField.lookupId":
			case "@currentField.lookupValue":
			case "@currentField.desc":
			case "@now":
			case "@me":
			case "@window.innerHeight":
			case "@window.innerWidth":
				return formatObj;
			default:
				return `"${formatObj}"`;
		}
	}

	//Process object values that have both operator and operands
	if(operandIsOperation(formatObj)) {
		const operands = new Array<string|number|boolean>();
		const minOperands = operatorMinOperands(formatObj.operator);
		const maxOperands = operatorMaxOperands(formatObj.operator);

		//Don't process if not enough operands
		if(formatObj.operands.length < minOperands) {
			return "";
		}

		//If too many operands, cut them out
		if(maxOperands !== -1 && formatObj.operands.length > maxOperands) {
			formatObj.operands = formatObj.operands.slice(0, maxOperands);
		}

		//Process all the operands
		formatObj.operands.forEach((operand:any) => {
			operands.push(formatObjToFormatScript(operand, formatObj.operator));
		});

		switch (formatObj.operator) {
			case "+":
			case "-":
			case "*":
				if(parentOperator == formatObj.operator || !operatorIsInline(parentOperator)) {
					return operands.join(formatObj.operator);
				} else {
					return `(${operands.join(formatObj.operator)})`;
				}
			case "/":
			case ">":
			case ">=":
			case "<":
			case "<=":
			case "==":
				if(operatorIsInline(parentOperator)) {
					return `(${operands.join(formatObj.operator)})`;
				} else {
					return operands.join(formatObj.operator);
				}
			case "&&":
				return `AND(${operands.join(",")})`;
			case "||":
				return `OR(${operands.join(",")})`;
			case "toString()":
				return `TOSTRING(${operands[0]})`;
			case "Number()":
				return `NUMBER(${operands[0]})`;
			case "Date()":
				return `DATE(${operands[0]})`;
			case "cos":
				return `COS(${operands[0]})`;
			case "sin":
				return `SIN(${operands[0]})`;
			case "toLocaleString()":
				return `TOLOCALESTRING(${operands[0]})`;
			case "toLocaleDateString()":
				return `TOLOCALEDATESTRING(${operands[0]})`;
			case "toLocaleTimeString()":
				return `TOLOCALETIMESTRING(${operands[0]})`;
			case "?":
				if(operationIsSwitch(formatObj.operands)) {
					return buildSwitchExpression(operands);
				} else {
					return buildIfExpression(operands);
				}
			default:
				return "";
		}
	}
	return "";
};

export const JSONToFormatScript = (j:string): string => {
	return formatObjToFormatScript(JSON.parse(j)).toString().replace(/__,__/g, ",");
};