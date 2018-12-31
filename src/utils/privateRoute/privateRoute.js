import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import './privateRoute.css'

class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: window.sessionStorage.getItem("userId") ? true: false
        }
    }

    componentWillMount() {
        if(!this.state.isAuthenticated) {
            const {history} = this.props;
            setTimeout(() => {
                history.replace("/login");
            }, 1000)
        }
    }

    render() {
        let { component: Component, ...rest} = this.props;
        return  this.state.isAuthenticated ? 
        (<Route {...rest} render={(props) => ( <Component {...props} /> 
            )}/> ) : (
                <div>
                    <div className="please-login"> <img src={require('./img/Login-Form.svg')}  alt="img1"/> </div>
                    <p className="message">请  登  录</p>
                </div>
            )

    }
}

export default withRouter(PrivateRoute);