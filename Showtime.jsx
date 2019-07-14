import React from 'react';
import Flower from './Flower';

class Showtime extends React.Component {
    constructor(props){
        super(props);
        this.merchants = [];
        this.products = [];
        this.tags = [];
        this.state = {
            merchantsLoaded: false,
            productsLoaded: false,
            lat:0,
            lon:0,
            tagSet: null,
            filteredList: []
        }
        this.changeLatLon = this.changeLatLon.bind(this);
        this.buyFlower = this.buyFlower.bind(this);
    }
    componentDidMount() {
        fetch(`http://localhost:8888/merchants`)
          .then(res => res.json())
          .then(json => {this.merchants = json; this.setState({merchantsLoaded:true})});
        fetch(`http://localhost:8888/products`)
          .then(res => res.json())
          .then(json => {
              this.products = json; 
              // build tags list
              this.products.forEach(prod=>{
                  prod.tags.forEach(tag=>{
                      if(this.tags.indexOf(tag) == -1){this.tags.push(tag);}
                  })
              })
              this.setState({filteredList: this.products.map(p=>p.id),productsLoaded:true})
            });
      }
      getDistance(lat1,lon1,lat2,lon2) {
          console.log({lat1,lon1,lat2,lon2});
          
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2-lat1) * Math.PI / 180;
        var dLon = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        if (d>1) return Math.round(d);
        else if (d<=1) return Math.round(d*1000);
        return d;
      }
      changeLatLon(e){
        if(e.key && e.key !== 'Enter'){return}
        const [lat=0,lon=0] = e.target.value.split(',');
        this.setState({lat,lon}, ()=>{this.filterProducts()});
      }
      changeTag(e){
        let tagSet = e.target.value;
        if(tagSet == 'Tags'){console.log('here');tagSet=null}        
        this.setState({tagSet}, ()=>{this.filterProducts()});
      }
      listProducts(){
          if(!this.state.filteredList.length){return 'No results!'}
          let filteredProducts = [];
          this.products.forEach(prod=>{
              if(this.state.filteredList.includes(prod.id)){
                  filteredProducts.push(<Flower key={prod.id} details={prod} merchant={this.findMerchant(prod.merchant_id).title} buy={this.buyFlower} />);
              }
          });
          return filteredProducts;
      }
      findMerchant(id){
        return this.merchants.find(m=>{return m.id == id});
      }
      inRange(prod){
        const prodMerchant = this.findMerchant(prod.merchant_id);
        const rangeDistance = this.getDistance(this.state.lat, this.state.lon, prodMerchant.location[0], prodMerchant.location[1]);
        return rangeDistance < prodMerchant.radius_meters;
      }
      buyFlower(){ // 🤔
        const flowers = ['🌸','🌺','🌼','🌻','💐','🌹','🌷'];
        const flowerPower = document.createElement('div');
        flowerPower.classList.add('flower-power');
        flowerPower.innerHTML = flowers[Math.round(Math.random()*6)];
        flowerPower.style = `top: ${Math.round(Math.random()*window.innerHeight)}px;left: ${Math.round(Math.random()*window.innerWidth)}px;font-size: ${Math.round(Math.random()*10)+5}em;transform: rotate(${Math.round(Math.random()*180)}deg);`
        document.body.appendChild(flowerPower)
      }
      filterProducts(){
          if(!this.state.tagSet && !this.state.lat && !this.state.lon){
              // no filters set - show all
              this.setState({filteredList: this.products.map(p=>p.id)})
              return;
          }
          const filteredList = [];
          this.products.forEach(prod=>{
            let invalid = 0;                        
            if(this.state.tagSet && !prod.tags.includes(this.state.tagSet)){invalid++}
            if((this.state.lat || this.state.lon) && !this.inRange(prod)){invalid++}            
            if(invalid == 0){filteredList.push(prod.id);}
          });
          this.setState({filteredList});
      }
    render() {
        if(!this.state.productsLoaded || !this.state.merchantsLoaded){
            return <div>Loading...</div>
        }
        
        return (
        <div className="container">
            <img src="./logo.svg" alt="" className="logo"/>
            <div className="pure-form floom--filter">
                <input title="latlon" placeholder="Search" onBlur={this.changeLatLon} onKeyDown={this.changeLatLon} />
                <select onChange={this.changeTag.bind(this)}>
                    <option>Tags</option>
                    {this.tags.map((tag,i)=><option key={i}>{tag}</option>)}
                </select>
            </div>
            {this.listProducts()}
        </div>);
    }
}

export default Showtime;