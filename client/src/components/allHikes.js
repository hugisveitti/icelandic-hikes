import React from 'react';
import './allHikes.css'
//
// const AboutHike = (
//
//     <div>hyejo</div>
//
// )

export class AllHikes extends React.Component {
  constructor(){
    super();
    this.state = {
      hikes: [],
      hikeclicked: false,
      hike:[]
    }
    this.showHike = this.showHike.bind(this);
    this.oneHikeInfo = this.oneHikeInfo.bind(this);
  }

  showHike(hike, event){
    console.log(event.target.parent)
    //ef ytt er a sama hike eda annad
    if(hike === this.state.hike){
      this.setState({hikeclicked:false})
    } else {
      this.setState({hikeclicked:true})
    }
    console.log(hike);
    this.setState({hike})
  }

  oneHikeInfo(hike){
    console.log('one hike')
    return(
      <div>
        YOOOOOOO
      </div>
    )
  }


  render(){

    //infoid sem kemur thar manneskja ytir a hike
    const oneHikeInfo = this.state.hikeclicked ? (
      <div>info</div>
    ) : (
      <a />
    )

    //TODO sort eftir stafrofsrod

//passa ad syna ekki tomu markerana
    const titles = this.props.hikes.map((hike) =>
      <div className="allhikes-li">
        {hike.title?<li
           onClick={(e) => this.showHike(hike, e)}>
           {hike.title}
           {hike.showInfo?{oneHikeInfo}: ''}
           {oneHikeInfo}
          
           </li>:''}
      </div>
    )

    console.log('allhikes render', this.state.hikes);
    return(
      <div>
        <ul>
          {titles}
        </ul>
      </div>
    )
  }
}

export default AllHikes;
