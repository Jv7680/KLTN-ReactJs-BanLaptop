import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { actGetProductRequest } from '../../../../redux/actions/products';
import { startLoading, doneLoading } from '../../../../utils/loading'
import { actAddCartRequest } from "../../../../redux/actions/cart"
import { actAddWishListRequest } from '../../../../redux/actions/wishlist'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import BeautyStars from 'beauty-stars';
import Swal from 'sweetalert2';
import './style.css'
toast.configure()
let token, id;
id = parseInt(localStorage.getItem("_id"));

class InputSliderTwoThumb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            quantity: 1
        }
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }


    render() {
        const { product } = this.props;
        const { quantity } = this.state;

        return (
            <div className="range-slide">
                <div className="slide">
                    <div className="line" id="line" style="left: 0%; right: 0%;"></div>
                    <span className="thumb" id="thumbMin" style="left: 0%;"></span>
                    <span className="thumb" id="thumbMax" style="left: 100%;"></span>
                </div>
                <div>
                    <input id="rangeMin" type="range" max="100" min="10" step="5" value="0" />
                    <input id="rangeMax" type="range" max="100" min="10" step="5" value="100" />
                </div>
                <div className="display">
                    <span id="min">10</span>
                    <span id="max">100</span>
                </div>
            </div>
        )
    }
}

export default withRouter(InputSliderTwoThumb)
