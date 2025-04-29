import React, { Component } from 'react';
import { SyncLoader } from "react-spinners";
//https://www.davidhu.io/react-spinners/
class Loader extends Component {
    render() {
        return (
            <SyncLoader
                color="#6a6a6b"
                loading={this.props.loading}
                size={8}
                speedMultiplier={0.7}
            />
        );
    }
}
export default Loader;