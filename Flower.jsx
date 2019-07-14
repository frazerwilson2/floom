import React from 'react';

class Flower extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render() {
        const {title, description, price, currency, image_urls:[image]} = this.props.details;
        return (
        <div className="floom--product">
            <img className="floom--product--img" src={`images/${title.toLowerCase()}_1.jpg`} alt={title}/>
            <div className="floom--product--title">
                <div>
                    <h2 className="floom--product--name">{title}</h2>
                    <h3 className="floom--product--merchant">{this.props.merchant}</h3>
                </div>
                <span className="floom--product--price">{currency == 'GBP' ? '£':''}{price}</span>
            </div>
            <div className="floom--product--description">
                <p>{description}</p>
                <button className="button-xlarge pure-button floom--product--button" onClick={this.props.buy}>BUY</button>
            </div>
        </div>);
    }
}

export default Flower;