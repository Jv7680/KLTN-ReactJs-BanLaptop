import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import BeautyStars from "beauty-stars";
import { is_empty } from "../../utils/validations";
import { Rating } from 'react-simple-star-rating';
import Modal from "react-modal";
import { actGetProductRequest, actFetchProductsRequest } from "../../redux/actions/products";
import store from "../..";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import callApi from "../../utils/apiCaller";
import { withRouter } from 'react-router-dom';
import { React360Viewer } from "react-360-product-viewer";


class Image360 extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        let { listImage360URL } = this.props;

        setTimeout(() => {
            // Thay thế lần luotj theo thứ tự src hiện tại của component bằng link ảnh
            if (listImage360URL.length > 0) {
                for (let i = 0; i < listImage360URL.length; i++) {
                    document.getElementsByClassName('sc-beySbM hmghSZ')[i].setAttribute('src', listImage360URL[i]);
                    // document.getElementsByClassName('sc-beySbM hmghSZ')[i].removeAttribute('alt');
                }
            }
        }, 500);
    }

    render() {
        const { listImage360URL } = this.props;

        return (
            <>
                {
                    listImage360URL.length > 0 ?
                        (
                            <div className="image-360-area image-in-slider-modal">
                                <React360Viewer
                                    imagesBaseUrl={''}
                                    imagesCount={listImage360URL.length}
                                    imagesFiletype="jpg"
                                    mouseDragSpeed={7}
                                    autoplay={true}
                                    autoplaySpeed={7}
                                // reverse={true}
                                />
                            </div>
                        )
                        :
                        (
                            <div className="not-upadted">Chúng tôi đang cập nhật mục này</div>
                        )
                }
            </>
        )
    }

}

export default withRouter(Image360);
