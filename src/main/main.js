import React from 'react';

class Main extends React.Component {  
    constructor(props, context) {  
        super(props, context);  
    }  
    render() {  
        return (  
            <div>  
                <h1>收到以下信息</h1>
                {this.props.location.state}  
            </div>  
        );  
    }  
} 

export default Main;