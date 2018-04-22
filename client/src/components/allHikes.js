import React from 'react';
import './allHikes.css'



export class AllHikes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hikes: [],
      lastHike:[],
      show:[]
    }
    this.showHike = this.showHike.bind(this);
  }

  showHike(hike, event){
    //fela seinasta hike
    var lastHike = this.state.lastHike;
    lastHike['showHike'] = false;
    this.setState({lastHike});
    //ef ytt er a sama hike tha fer thad, ef ekki
    if(hike === this.state.lastHike){
      hike['showHike'] = false;
      //ef ytt er a sama hike thrisvar i rod
      this.setState({lastHike:[]});
    } else { //ef ytt er a nytt hike
      //syna thetta hike
      hike['showHike'] = true;
      this.setState({lastHike: hike});
    }

    this.props.setFromListSelectedMarker(hike);
  }


  render(){
    //infoid sem kemur thar manneskja ytir a hike

    var id = 0;
    var k = 0
    const titles = this.props.hikes.map((hike) =>
    <div key={k++} className="allhikes-li">
      {hike.title && hike.length?<li
         key={id}
         id={id++}
         onClick={(e) => this.showHike(hike, e)}>
         <div>
          <h4 className="all-hikes-title">{hike.title}</h4>
         </div>
         {hike.showHike?
           <div>
              <ul>
                <li className="description">{hike.description}</li>
                <li>Difficulty is {hike.difficulty}</li>
                <li>Length is {hike.length} meters</li>
                <li>Duration is {hike.duration}</li>
                <li>Elevation is {hike.elevation} meters</li>

                  {hike.isLoop?<li>The hike is a loop</li>:
                   <div>
                    <li>The hike is not a loop</li>
                     <li>
                     {( hike.hasSameStartFinish)?'The hike has the same start and finish point':
                      'The hike does not have the same start and finish point'}
                      </li>
                   </div>
                   }
             </ul>
           </div>: ''}
         </li>:''}
    </div>
    );

    //TODO sort eftir stafrofsrod

    return(
      <div className="all-hikes">
        <ul>
          {titles}

        </ul>
      </div>
    )
  }
}

export default AllHikes;
