import React, {Component} from 'react';

class displayData extends Component {

constructor(props) {
        super(props);
   
        this.state = {
            items: null,
            DataisLoaded: false
        };
    }
   
   componentDidMount() { 


    fetch("/locations", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }

    }).then(
      response => response.json()
  ).then (

  json=> {

    this.setState({
        DataisLoaded : true,
        items : json,
    })
  }

  )  
    }

    render() {

    var {items, DataisLoaded} = this.state;
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;
        return (

            <div>
            <h1>Hello There</h1>
                {items.map((item, index) =>(
                <h1 key={index}>{item.location}</h1>
        )
      ) }
            </div>

        )
    }

}

export default displayData;