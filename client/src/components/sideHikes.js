import React from 'react';
import SideNav from 'react-simple-sidenav';
import {slide as Menu} from 'react-burger-menu';
import Sidebar from 'react-sidebar';
import './sideHikes.css';

export class SideHikes extends React.Component {
  constructor(props){
    super(props);
    this.state = [

    ]
    this.showOnMap = this.showOnMap.bind(this);
  }

    showOnMap(hike){
      this.props.setFromListSelectedMarker(hike);
    }

  render(){
    const all_hikes = this.props.hikes.map((hike) =>
    <div>
      {hike.title&&hike.length ? <a
       onClick={() => this.showOnMap(hike)}
       className="all-hikes-item"
       >{hike.title}</a> :''
     }
     </div>
  );

  //ef ytt er a nibbann
  var disp = 'none';
  if(this.props.show){
    disp = 'block'
  }
  const mainstyle = {
    display:disp,
  };
   var sidebarContent = <b>Sidebar content</b>;

    return(
      <div
       className="sideBar-main"
       style={mainstyle}
       >
       <h4 className="side-title">All Hikes</h4>
      {all_hikes}
      </div>
    )
  }
}

export default SideHikes;
