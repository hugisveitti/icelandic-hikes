import React from 'react';
import './sideHikes.css';
// import FaIconPack from 'react-icons/lib/fa'
import  FaSearch  from 'react-icons/lib/fa/search';



export class SideHikes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      search:'',
    }
    this.showOnMap = this.showOnMap.bind(this);
  }

    showOnMap(hike){
      this.props.setFromListSelectedMarker(hike);
    }

  updateSearch(event){
    this.setState({search: event.target.value})
  }

  //fyrir sort
  compare(a,b){
    if(a.title < b.title){
      return -1;
    } else if(a.title > b.title){
      return 1;
    } else {
      return 0;
    }
  }

  render(){




  var left = this.props.left;
  const mainstyle = {
    left:left+"px",
    transition: "left 0.3s",
  };


  const nibbastyle = {
    left: (left+9)+"px",
    transition: "left 0.3s",
  }


//setja i searchHikes allt sem passar vid leitarstrenginn
// TODO laga css fyrir searchBAr
//TODO láta íslenska stafi ekki skipta máli í search
   var searchHikes = [];
   //passa ad laga -3 ef add marker breytist
   for(var i=0; i<this.props.hikes.length-3; i++){
     if(this.props.hikes[i].title.toLowerCase().indexOf(this.state.search) !== -1){
       searchHikes.push(this.props.hikes[i]);
     }
   }

   //sort alphabetical
   searchHikes.sort(this.compare);

   const all_hikes = searchHikes.map((hike,index) =>
     <div key={index}>
       {hike.title ? <a
        onClick={() => this.showOnMap(hike)}
        className="all-hikes-item"
        >{hike.title}</a> :''
      }
      </div>
    );

const searchStyle = {
  width:"80%",
  padding:"5px 0",
  display:"inline",
  clear:"both",
  float:"right"
}



    const searchIcon = (
      <div className="search-icon">
        <FaSearch />
      </div>
    )

    return(
      <div
      className="sideBar-main"
       style={mainstyle}
       >
       <div
         className="side-nav-nibbi nibbi-loka"
         onClick={this.props.toggleSideNav}
         style={nibbastyle}>
       </div>
       <h4 className="side-title">All Hikes</h4>
       <div className="side-bar-search" style={searchStyle}>

         {searchIcon}
         <input
          style={searchStyle}
          placeholder={"Search"}
          value={this.state.seach}
          onChange={this.updateSearch.bind(this)}
         />

       </div>
      {all_hikes}
      <br />
      <br />
      </div>
    )
  }
}

export default SideHikes;
