import React, { Component } from 'react'
import PulseLoader from 'react-spinners/PulseLoader';

import './loading.css';

class Loading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { loadingActive, loadingCSS } = this.props;

        let displayStyle = "flex";
        if (loadingActive === true) {
            displayStyle = "flex";
            document.getElementsByTagName('body')[0].classList.add('show-scrollbar');
            window.onscroll = function () { window.scrollTo(0, 0); };
        }
        else {
            displayStyle = "none";
            document.getElementsByTagName('body')[0].classList.remove('show-scrollbar');
            window.onscroll = function () { };
        }

        return (
            <div
                className='sweet-loading'
                style={{ display: displayStyle }}>
                <PulseLoader
                    css={loadingCSS}
                    sizeUnit={"px"}
                    size={20}
                    color={'rgba(71, 74, 240, 0.8)'}
                    loading={true}
                />
            </div>
        )
    }
}

export default (Loading)
