import * as React from 'react';
import { css, Label, PrimaryButton, CommandButton, DocumentCard, DocumentCardActivity, DocumentCardPreview, IDocumentCardPreviewProps, ImageFit,DocumentCardTitle } from 'office-ui-fabric-react';
import IInventoryItemCardProps from './IInventoryItemCardProps';
import style from './InventoryItemCard.module.scss';


export default class InventoryItemCard extends React.Component<IInventoryItemCardProps, any> {
  constructor(props: IInventoryItemCardProps) {
    super(props);
    this.state = {
     item:props.item
    };
    this._handleChange = this._handleChange.bind(this);
  }

    public componentWillReceiveProps(props: IInventoryItemCardProps) {
    
        this.setState({
            item:props.item
        });
        
    }

    private _handleChange(id, isMyCheckoutItemClicked) {        
        this.setState({ activeId: id , isMyCheckoutItemClicked:isMyCheckoutItemClicked});
        this.props.onClickEvent(id);
    }

     public render(): JSX.Element {
        if (this.state == null || this.state.item == null) {
            return <div></div>;
        }
      
        return (
            <span className={ style.inventoryitemcard } onClick={() => this._handleChange(this.state.item.id, true)} >
                <div className={ style.imageArea }>
                    { this.state.item.title == "foo"?
                        <div>
                        </div> :
                        <div className={style.placeHolder}>
                            <i className={ "ms-Icon ms-Icon--ProHockey "} aria-hidden="true"></i>
                        </div>
                    }
                </div>
                <div className={ style.titleArea }>{this.state.item.title}</div>                
            </span>
        );
    }
}