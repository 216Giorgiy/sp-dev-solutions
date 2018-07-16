import { DefaultButton, IButtonStyles, IconButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { ISelectableOption } from "office-ui-fabric-react/lib/utilities/selectableOption/SelectableOption.Props";
import * as React from "react";

import { ColumnFormattingSchemaURI } from "../../../helpers/ColumnFormattingSchema";
import { ViewFormattingSchemaURI } from "../../../helpers/ViewFormattingSchema";
import { formatterType } from "../../../state/State";
import styles from "../../ColumnFormatter.module.scss";
import { FormatScriptEditorDialog } from "../../FormatScript/FormatScriptEditorDialog";
import { JSONToFormatScript } from "../../FormatScript/FormatScript";
import { INodeProperty, NodePropType } from "./INodeProperty";

export interface INodePropertiesProps {
	propUpdated: (propertyAddress:string, value:any) => void;
	isRoot: boolean;
	node?: any;
	formatType: formatterType;
}

export interface INodePropertiesState {
	propFilter: string;

	formatScriptDialogVisible: boolean;
	formatScriptExpression?: string;
	formatScriptPropertyAddress?: string;
	formatScriptPropertyName?: string;
}

export class NodeProperties extends React.Component<INodePropertiesProps, INodePropertiesState> {

	constructor(props: INodePropertiesProps) {
		super(props);

		this.state = {
			propFilter: "relevant",
			formatScriptDialogVisible: false,
		};
	}

	public render(): React.ReactElement<INodePropertiesProps> {
		const nodeProps = this.buildProps(this.props.node, this.props.isRoot, this.props.formatType).filter(this.filterPropsForView);
		const nodePropsAttributes = this.buildPropsAttributes(this.props.node, this.props.isRoot, this.props.formatType).filter(this.filterPropsForView);

		return (
			<div className={styles.panel + " " + styles.treeProps}>
				<table className={styles.headerTable} cellPadding={0} cellSpacing={0}>
					<tbody>
						<tr>
							<td>
								<span className={styles.panelHeader}>Properties</span>
							</td>
							<td>
								<Dropdown
								 disabled={typeof this.props.node == "undefined"}
								 selectedKey={this.state.propFilter}
								 onChanged={(item:IDropdownOption): void => {this.setState({propFilter:item.key.toString()});}}
								 calloutProps={{className:styles.treeProps}}
								 options={[
									{key:"relevant", text:"Relevant"},
									{key: "current", text:"Current"},
									{key: "all", text:"All"}
								 ]}/>
							</td>
						</tr>
					</tbody>
				</table>
				{(nodeProps.length > 0 || nodePropsAttributes.length > 0) &&
					<table className={styles.propertyTable} cellPadding={0} cellSpacing={0}>
						<tbody>
							{nodeProps.map((nodeProp:INodeProperty) => {
								return (
									<tr key={nodeProp.name}>
										<td className={styles.propertyLabel + (nodeProp.current ? " " + styles.current : "") + (nodeProp.relevant ? " " + styles.relevant : "")}>
											<span>{nodeProp.name}</span>
										</td>
										<td className={styles.propertyValue}>
											{this.renderPropEditor(nodeProp)}
										</td>
									</tr>
								);
							})}
							{nodePropsAttributes.map((nodeProp:INodeProperty) => {
								return (
									<tr key={nodeProp.name}>
										<td className={styles.propertyLabel + (nodeProp.current ? " " + styles.current : "") + (nodeProp.relevant ? " " + styles.relevant : "")  + (nodeProp.invalidValue ? " " + styles.invalid : "")}>
											<span>{nodeProp.name}</span>
										</td>
										<td className={styles.propertyValue}>
											{this.renderPropEditor(nodeProp)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				}
				<FormatScriptEditorDialog
				 initialValue={this.state.formatScriptExpression}
				 visible={this.state.formatScriptDialogVisible}
				 dialogTitle={`Format Script: ${this.state.formatScriptPropertyName}`}
				 onCancel={() => { this.setState({ formatScriptDialogVisible: false }); }}
				 onSave={this.onFormatScriptEditorSave}
				/>
			</div>
		);
	}

	@autobind
	private filterPropsForView(nodeProp:INodeProperty):boolean {
		return this.state.propFilter == "all"
			|| (this.state.propFilter == "current" && nodeProp.current)
			|| (this.state.propFilter == "relevant" && nodeProp.relevant);
	}

	private buildProps(node:any, isRoot:boolean, formatType:formatterType): Array<INodeProperty> {
		const props = new Array<INodeProperty>();

		if(typeof node !== "undefined") {
			const elmType: string = node.hasOwnProperty("elmType") ? node.elmType : this.defaultPropValue("elmType", formatType);

			const addressPrefix = "";

			//ViewFormatting root properties
			if(isRoot && formatType == formatterType.View) {
				return [
					
				];
			}
			
			//ColumnFormatting additional Root Properties
			if(isRoot) {
				props.push(...[
					this.buildProp("$schema",addressPrefix,node,elmType,formatType),
					this.buildProp("debugMode",addressPrefix,node,elmType,formatType)
				]);
			}

			//Column Formatting/RowFormatter properties
			props.push(...[
				this.buildProp("elmType",addressPrefix,node,elmType,formatType),
				this.buildProp("txtContent",addressPrefix,node,elmType,formatType)
			]);
		}

		return props;
	}

	private buildPropsAttributes(node:any, isRoot:boolean, formatType:formatterType): Array<INodeProperty> {
		const props = new Array<INodeProperty>();

		if(typeof node !== "undefined" && !(isRoot && formatType == formatterType.View)) {
			const elmType: string = node.hasOwnProperty("elmType") ? node.elmType : this.defaultPropValue("elmType", formatType);

			const addressPrefix = "attributes.";
			//Column Formatting/RowFormatter element attributes
			props.push(...[
				this.buildProp("class",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("iconName",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("href",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("target",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("src",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("d",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("title",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("role",addressPrefix,node.attributes,elmType,formatType),
				this.buildProp("rel",addressPrefix,node.attributes,elmType,formatType),
			]);
		}

		return props;
	}
	
	private buildProp(propertyName:string, addressPrefix:string, node:any, elmType:string, formatType:formatterType): INodeProperty {
		const isCurrent:boolean = (typeof node !== "undefined" && node.hasOwnProperty(propertyName));
		const doesSupportExpression:boolean = this.supportsExpression(propertyName, formatType);
		let value:any;
		let isInvalidValue:boolean = false;
		let isExpression:boolean = false;
		if(isCurrent) {
			value = node[propertyName];
			if (!(typeof value == "string" || typeof value == "number" || typeof value == "boolean")) {
				if (this.supportsExpression && typeof value == "object") {
					//Convert to FormatScript (and verify)
					//TEMP just declare it is an expression and ignore problems
					value = JSON.stringify(value);
					isExpression = true;
				} else {
					isInvalidValue = true;
				}
			}
		} else {
			value = this.defaultPropValue(propertyName, formatType);
		}

		return {
			name:propertyName,
			address:addressPrefix + propertyName,
			type:this.propType(propertyName, formatType),
			value: value,
			invalidValue: isInvalidValue,
			current: isCurrent,
			relevant:this.isRelevantProp(propertyName, elmType, formatType),
			supportsExpression: doesSupportExpression,
			valueIsExpression: isExpression,
		};
	}

	private propType(propertyName:string, formatType:formatterType): NodePropType {
		switch (propertyName) {
			case "elmType":
			case "target":
				return NodePropType.dropdown;
			case "debugMode":
				return NodePropType.toggle;
			default:
				return NodePropType.text;
		}
	}

	private defaultPropValue(propertyName:string, formatType:formatterType): any {
		switch (propertyName) {
			case "$schema":
				return formatType == formatterType.Column ? ColumnFormattingSchemaURI : ViewFormattingSchemaURI;
			case "debugMode":
				return false;
			case "elmType":
				return "div";
			case "target":
				return "_blank";
			default:
				return "";
		}
	}

	private isRelevantProp(propertyName:string, elmType: string, formatType:formatterType): boolean {
		switch (propertyName) {
			case "$schema":
			case "debugMode":
			case "elmType":
			case "class":
			case "title":
				return true;
			case "txtContent":
				switch(elmType) {
					case "img":
					case "svg":
					case "path":
						return false;
					default:
						return true;
				}
			case "iconName":
				switch(elmType) {
					case "button":
					case "img":
					case "svg":
					case "path":
						return false;
					default:
						return true;
				}
			case "href":
			case "target":
			case "rel":
				return elmType == "a";
			case "src":
				return elmType == "img";
			case "d":
				return elmType == "path";
			case "action":
			case "actionParams":
				return elmType == "button";
		}
		return false;
	}

	private supportsExpression(propertyName:string, formatType:formatterType): boolean {
		switch (propertyName) {
			case "$schema":
			case "debugMode":
			case "elmType":
			case "action":
				return false;
			default:
				return true;
		}
	}


	@autobind
	private renderPropEditor(nodeProp:INodeProperty): JSX.Element {

		//styles for formatscript button
		const propButtonStyles: Partial<IButtonStyles> = {
			root: {
				width: "14px",
				height: "16px",
				padding: "0"
			},
			icon: {
				fontSize: "12px",
				lineHeight: "16px",
			}
		};

		return (
			<div className={styles.propAndButtonBox}>
				<div className={styles.mainBox}>
					{this.renderPropEditorControl(nodeProp)}
				</div>
				
				<div className={styles.buttonBox}>
					{nodeProp.supportsExpression &&
						<IconButton
						 iconProps={{
							 iconName:nodeProp.valueIsExpression ? "TestBeakerSolid" : "TestBeaker",
							className:nodeProp.valueIsExpression ? "ms-fontColor-themeDarkAlt" : "ms-fontColor-neutralPrimaryAlt"}}
						 title="FormatScript"
						 styles={propButtonStyles}
						 onClick={()=>{
							this.setState({
								formatScriptDialogVisible: true,
								formatScriptExpression: JSONToFormatScript(nodeProp.value),
								formatScriptPropertyAddress: nodeProp.address,
								formatScriptPropertyName: nodeProp.name,
							});
						 }}/>
					}
				</div>
			</div>
		);
	}

	private renderPropEditorControl(nodeProp:INodeProperty): JSX.Element {
		switch (nodeProp.type) {
			case NodePropType.dropdown:
				return (
					<Dropdown
					 selectedKey={nodeProp.valueIsExpression ? undefined : nodeProp.value}
					 placeHolder={nodeProp.valueIsExpression ? "Using Expression" : undefined}
					 options={this.getPropOptions(nodeProp)}
					 calloutProps={{className:styles.treeProps}}
					 onChanged={(option:ISelectableOption,index?:number) => {this.props.propUpdated(nodeProp.address,option.key.toString());}}/>
				);
			case NodePropType.text:
				return (
					<TextField
					 value={nodeProp.valueIsExpression ? undefined : nodeProp.value}
					 placeholder={nodeProp.valueIsExpression ? "Using Expression" : undefined}
					 borderless={true}
					 onChanged={(newValue:any) => {this.props.propUpdated(nodeProp.address,newValue);}}/>
				);
			default:
				return (
					<span>{nodeProp.invalidValue ? "INVALID" : nodeProp.value}</span>
				);
		}
	}

	private getPropOptions(nodeProp:INodeProperty): Array<IDropdownOption> {
		switch (nodeProp.name) {
			case "elmType":
				return [
					{key: "div", text: "div"},
					{key: "span", text: "span"},
					{key: "a", text: "a"},
					{key: "img", text: "img"},
					{key: "button", text: "button"},
					{key: "svg", text: "svg"},
					{key: "path", text: "path"},
				];
			case "target":
				return [
					{key: "_blank", text: "_blank"},
					{key: "_self", text: "_self"},
					{key: "_parent", text: "_parent"},
					{key: "_top", text: "_top"},
				];
			default:
				return undefined;
		}
	}

	@autobind
	private onFormatScriptEditorSave(result: any): void {
		this.props.propUpdated(this.state.formatScriptPropertyAddress, result);

		this.setState({
			formatScriptDialogVisible: false,
		});
	}

}