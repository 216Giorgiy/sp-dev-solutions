export enum NodePropType {
	text,
	dropdown,
	dropdownMS,
	combobox,
	toggle
}

export interface INodeProperty {
	name: string;
	address: string;
	type: NodePropType;
	value: any;
	invalidValue: boolean;
	current: boolean;
	relevant: boolean;
	supportsExpression: boolean;
	valueIsExpression: boolean;
}