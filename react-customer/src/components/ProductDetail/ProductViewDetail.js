import React, { Component } from "react";
import { Rating } from 'react-simple-star-rating';
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import store from "../..";
import { actGetProductRequest, actFetchProductsRequest } from "../../redux/actions/products";
import { actAddCartRequest } from "../../redux/actions/cart";
import callApi from "../../utils/apiCaller";
import BeautyStars from "beauty-stars";
import RatingView from "./RatingView"
import "./style.css";
import { is_empty } from "../../utils/validations";
import { result } from "lodash";
import Swal from "sweetalert2";
import { withRouter } from 'react-router-dom';
import { getProductListImageURL, getProductListImage360URL } from "../../firebase/CRUDImage";

import Image360 from "./Image360";
import ProductInfor from "./ProductInfor";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-modal";

toast.configure();

let token;
let id;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "94vw",
    height: "96vw",
    maxHeight: "96vh",
    overflow: "auto",
  }
};

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  // autoplay: true,
  // autoplaySpeed: 5000,
};

class ProductViewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      redirectYourLogin: false,
      cmtContent: '',
      cmtRating: 1,
      ratingState: '',
      checkCommented: false,
      listImageURL: [],
      listImage360URL: [],
      modalIsOpen: false,
      modalState: 1,
    };
  }

  componentDidMount = async () => {

    await this.props.get_product(this.props.id);

    let listImage = await getProductListImageURL(this.props.id);
    // let listImage360 = await getProductListImage360URL(this.props.id);
    this.getListImage360URL();
    this.setState({
      listImageURL: listImage.images,
      // listImage360URL: listImage360.images360,
    });
  }

  componentDidUpdate = () => {
    let { modalState } = this.state;
    setTimeout(() => {
      let modalHeader1 = document.getElementsByClassName('modal-image-header1')[0];
      let modalHeader2 = document.getElementsByClassName('modal-image-header2')[0];
      let modalHeader3 = document.getElementsByClassName('modal-image-header3')[0];

      if (modalState === 1 && modalHeader1) {
        modalHeader1.classList.add('modal-image-header--active');
        modalHeader2.classList.remove('modal-image-header--active');
        modalHeader3.classList.remove('modal-image-header--active');
      }
      else if (modalState === 2 && modalHeader2) {
        modalHeader1.classList.remove('modal-image-header--active');
        modalHeader2.classList.add('modal-image-header--active');
        modalHeader3.classList.remove('modal-image-header--active');
      }
      else if (modalState === 3 && modalHeader3) {
        modalHeader1.classList.remove('modal-image-header--active');
        modalHeader2.classList.remove('modal-image-header--active');
        modalHeader3.classList.add('modal-image-header--active');
      }
    }, 150);
  }

  getListImage360URL = async () => {
    let listImage360 = await getProductListImage360URL(this.props.id);
    this.setState({
      listImage360URL: listImage360.images360,
    });
  }


  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }

  renderMyCMT = () => {
    let { product } = this.props;
    let idAccount = localStorage.getItem('_idaccount');
    let listReviews = product.reviewsResponses.listReviews;

    for (let i = 0; i < product.reviewsResponses.listReviews.length; i++) {
      if (listReviews[i].accountId === parseInt(idAccount)) {
        //t??i kho???n n??y ???? comment
        return (
          <div className="comment-item media border p-3">
            <div className="media-body">
              <h5>
                <span style={{ fontSize: "14px", fontStyle: "italic" }}>
                  {listReviews[i].username}&nbsp;(B???n)
                </span>
                <span style={{ fontSize: "14px", fontStyle: "italic", float: "right" }}>
                  {listReviews[i].reviewsDate}&nbsp;
                </span>
                <div className="mt-10">
                  <Rating
                    initialValue={listReviews[i].rating}
                    readonly={true}
                    size={18}
                  />
                </div>
              </h5>
              <p> {listReviews[i].contents}</p>
            </div>
          </div>
        )
      }
    }

    return null;
  }

  checkCommented = () => {
    let { product } = this.props;
    if (Object.keys(product).length === 0) {
      return false;
    }
    let idAccount = localStorage.getItem('_idaccount');
    let listReviews = product.reviewsResponses.listReviews;

    for (let i = 0; i < product.reviewsResponses.listReviews.length; i++) {
      if (listReviews[i].accountId === parseInt(idAccount)) {
        //t??i kho???n n??y ???? comment
        return true;
      }
    }

    //t??i kho???n n??y ch??a comment
    return false;
  }

  upItem = (quantity) => {
    if (quantity >= 5) {
      toast.error('T???i ??a 5 s???n ph???m')
      return
    }
    this.setState({
      quantity: quantity + 1
    })
  }

  downItem = (quantity) => {
    if (quantity <= 1) {
      toast.error('T???i thi???u 1 s???n ph???m')
      return
    }
    this.setState({
      quantity: quantity - 1
    })
  }

  handleChange = event => {
    let name = event.target.name;
    let value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  };

  addItemToCart = product => {
    const { quantity } = this.state;

    token = localStorage.getItem("_auth");
    id = parseInt(localStorage.getItem("_id"));
    if (!token) {
      Swal.fire({
        returnFocus: false,
        icon: 'error',
        title: 'L???i',
        text: 'B???n c???n ????ng nh???p ????? th???c hi???n ch???c n??ng n??y!',
      })
      this.props.history.push(`/login`);
    }
    else {
      this.setState({
        redirectYourLogin: false
      })
      this.props.addCart(id, product, quantity, token);
    }

  }

  openModal = (modalState) => {
    document.getElementsByTagName('body')[0].classList.add('prevent-scroll-body');
    this.setState({
      modalIsOpen: true,
      modalState: modalState,
    });
  }

  closeModal = () => {
    document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { product, user } = this.props;
    const { quantity, redirectYourLogin, cmtContent, cmtRating, ratingState, checkCommented, listImageURL, listImage360URL } = this.state;
    const { modalIsOpen, modalState } = this.state;
    let listProductInfor;
    if (redirectYourLogin) {
      return <Redirect to="/login"></Redirect>
    }
    const idAccount = parseInt(localStorage.getItem('_idaccount'));
    const commented = this.checkCommented();

    return (
      <div className="content-wraper">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <div className="container-fluid">
            {/* row modal header */}
            <div className="row modal-image-header">
              <div className="col-md-2-auto modal-image-header1">
                <span onClick={() => { this.openModal(1) }}>Th?? vi???n ???nh</span>
              </div>
              <div className="col-md-2-auto modal-image-header2">
                <span onClick={() => { this.openModal(2) }}>???nh 360 ?????</span>
              </div>
              <div className="col-md-2-auto modal-image-header3">
                <span onClick={() => { this.openModal(3) }}>Th??ng s??? k?? thu???t</span>
              </div>
              <span className="btn-close-modal" onClick={() => { this.closeModal() }}><i className="fa-solid fa-xmark"></i></span>
            </div>
            {/* row modal body */}
            <div className="row">
              <div className="col">
                {
                  modalState === 1 ?
                    (
                      <div className="slider-state1">
                        <Slider  {...settings}>
                          {
                            listImageURL.length > 0 ?
                              (
                                listImageURL.map((url, index) => {
                                  return (
                                    <div key={index} className="image-in-slider-modal">
                                      <img src={url} alt="not found" />
                                    </div>
                                  );
                                })
                              )
                              :
                              (
                                <div className="not-upadted">Ch??ng t??i ??ang c???p nh???t m???c n??y</div>
                              )
                          }
                        </Slider>
                      </div>
                    )
                    :
                    (
                      <>
                        {
                          modalState === 2 ?
                            (
                              <div className="slider-state2">
                                <Image360 listImage360URL={listImage360URL}></Image360>
                              </div>
                            )
                            :
                            (
                              <div className="slider-state3">
                                <ProductInfor listImage360URL={listImage360URL}></ProductInfor>
                              </div>
                            )
                        }
                      </>
                    )
                }
              </div>
            </div>
          </div>
        </Modal>
        <div className="container">
          {/* row product-detail-header */}
          <div className="row product-detail-header">
            {/* slider h??nh ???nh s???n ph???m */}
            <div className="col-md-5">
              {/* row slider */}
              <div className="silder-image-product">
                <Slider  {...settings}>
                  {
                    listImageURL.length > 0 ?
                      (
                        listImageURL.map((url, index) => {
                          return (
                            <div key={index} className="image-in-slider">
                              <img src={url} alt="not found" />
                            </div>
                          );
                        })
                      )
                      :
                      (
                        null
                      )
                  }
                </Slider>
              </div>
              {/* row ch???c n??ng */}
              <div className="btn-open-library">
                {/* n??t xem th?? vi???n ???nh */}
                <button type="button" onClick={() => { this.openModal(1) }}>
                  <img src={process.env.PUBLIC_URL + '/icon/icon-image.png'} alt="Not found" />
                  <span className="btn-span">Xem th?? vi???n</span>
                </button>
                {/* n??t xem ???nh 360 */}
                <button type="button" onClick={() => { this.openModal(2) }}>
                  <img src={process.env.PUBLIC_URL + '/icon/icon-360-degrees.png'} alt="Not found" />
                  <span className="btn-span">???nh 360 ?????</span>
                </button>
                {/* n??t xem th??ng tin chi ti???t */}
                <button type="button" onClick={() => { this.openModal(3) }}>
                  <img src={process.env.PUBLIC_URL + '/icon/icon-product-infor.png'} alt="Not found" />
                  <span className="btn-span">Th??ng tin chi ti???t</span>
                </button>
              </div>
            </div>
            {/* TH??ng tin v??? gi??, khuy???n m??i, t???n kho, th??m v??o gi??? */}
            <div className="col-md-7">
              <div className="product-details-view-content sp-normal-content">
                <div className="product-info">
                  <span className="product-name">{product.productName}</span>
                  {/* X??? l?? ng???ng kinh doanh, h???t h??ng, v?? c?? discount */}
                  {
                    product.isDeleted === 'yes' ?
                      (
                        <>
                          <h3>Ng???ng Kinh Doanh! </h3>
                          <h6>Ch??n th??nh xin l???i qu?? kh??ch, ch??ng t??i ???? ng???ng kinh doanh s???n ph???m n??y.</h6>
                        </>
                      )
                      :
                      (
                        product.quantity === 0 ?
                          (
                            <>
                              <h3>T???m H???t H??ng! </h3>
                              <h6>Ch??n th??nh xin l???i qu?? kh??ch, ch??ng t??i s??? mong ch??ng nh???p h??ng ????? ????p ???ng nhu c???u mua s???m c???a b???n.</h6>
                            </>
                          )
                          :
                          (
                            <div className="price-box pt-20">
                              {
                                product.discount > 0 ?
                                  (
                                    <>
                                      <p className="new-price new-price-2" style={{ color: 'black', textDecoration: "line-through" }}>
                                        {product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}  <span>&emsp;-{product.discount}%</span>
                                      </p>
                                      <p className="new-price new-price-2" style={{ color: 'black', textDecoration: "none" }}>
                                        Ch??? c??n: {(product.unitprice * ((100 - product.discount) / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                      </p>
                                    </>
                                  )
                                  :
                                  (
                                    <>
                                      <span className="new-price new-price-2" style={{ color: 'black', textDecoration: "none" }}>
                                        {product && product.unitprice ? product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : null}
                                      </span>
                                    </>
                                  )
                              }
                            </div>
                          )
                      )
                  }

                  {/* M???t c?? th??? ?????t m?? t??? nhanh ??? ????y */}
                  <div className="product-desc">
                    <p>
                      <span dangerouslySetInnerHTML={{ __html: product.descriptionProduct }}></span>
                    </p>
                  </div>

                  {
                    product.quantity === 0 || product.isDelete ?
                      (
                        null
                      )
                      :
                      <div className="single-add-to-cart">
                        <form className="cart-quantity">
                          <div className="quantity">
                            <label>S??? l?????ng&emsp;&emsp;&emsp;<span style={{ fontSize: "15px", fontStyle: "italic", color: "green" }}>(T???n kho:&nbsp;{product.quantity})</span></label>
                            <div className="cart-plus-minus">
                              <input
                                onChange={() => { }}
                                className="cart-plus-minus-box"
                                value={quantity}
                                type="text"
                              />
                              <div onClick={() => this.downItem(quantity)} className="dec qtybutton">
                                <i className="fa fa-angle-down" />
                              </div>
                              <div onClick={() => this.upItem(quantity)} className="inc qtybutton">
                                <i className="fa fa-angle-up" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <span
                              onClick={() => this.addItemToCart(product)}
                              className="add-to-cart button-hover-addcart button"
                            >
                              Th??m v??o gi???
                              <i className="fa fa-shopping-cart"></i>
                            </span>
                          </div>
                        </form>
                      </div>
                  }

                </div>
              </div>
            </div>
          </div>
          {/* row product-detail-body */}
          <div className="row product-detail-body">
            {/* col product description */}
            <div className="col-md-8">
              <div className="product-description-title">
                M?? t??? s???n ph???m
              </div>
              <div className="product-description-content">
                <span dangerouslySetInnerHTML={{ __html: product.description }}></span>
              </div>
            </div>
            {/* col product configuration */}
            <div className="col-md-4">
              <div className="row product-configuration-title">
                <div className="col">Th??ng tin chi ti???t</div>
              </div>
              <div className="row product-configuration-content product-configuration-content--grey">
                <div className="col-4 product-configuration-content__title">CPU:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content">
                <div className="col-4 product-configuration-content__title">RAM:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content product-configuration-content--grey">
                <div className="col-4 product-configuration-content__title">??? c???ng:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content">
                <div className="col-4 product-configuration-content__title">M??n h??nh:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content product-configuration-content--grey">
                <div className="col-4 product-configuration-content__title">H??? ??i???u h??nh:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content">
                <div className="col-4 product-configuration-content__title">Kh???i l?????ng:</div>
                <div className="col product-configuration-content__content">N???i dung</div>
              </div>
              <div className="row product-configuration-content">
                <button className="product-configuration-content__btn" type="button" onClick={() => { this.openModal(3) }}><i className="fa-solid fa-plus"></i> Xem th??m</button>
              </div>
            </div>
          </div>

          {/* row product-detail-rating */}
          <div className="row product-detail-rating">
            {/* ????nh gi?? t???ng qu??t c???a s???n ph???m */}
            <div className="col-12">
              <RatingView
                commented={commented}
                rating={product.reviewsResponses ? product.reviewsResponses.rating : 0}
                listReviews={product.reviewsResponses ? product.reviewsResponses.listReviews : []}></RatingView>
            </div>

            {/* danh s??ch comment */}
            <div className="col-12">
              {
                product.reviewsResponses ?
                  (
                    product.reviewsResponses.listReviews.length > 0 ?
                      (
                        <div className="comment-list">
                          <h5 className="text-muted mt-40">
                            <span className="badge badge-success">{product.reviewsResponses.listReviews.length}</span>
                            {" "}Comment
                          </h5>
                          {/* Render ra comment c???a b???n th??n tr?????c */}
                          {
                            this.renderMyCMT()
                          }
                          {/* Render ra comment c???a nh???ng ng?????i c??n l???i */}
                          {
                            product.reviewsResponses.listReviews.map((cmt, index) => {
                              if (cmt.accountId === idAccount) {
                                return null;
                              }
                              return (
                                <div key={index} className="comment-item media border p-3">
                                  <div className="media-body">
                                    <h5>
                                      <span style={{ fontSize: "14px" }}>
                                        {cmt.username}
                                      </span>
                                      <span style={{ fontSize: "14px", fontStyle: "italic", float: "right" }}>
                                        {cmt.reviewsDate}&nbsp;
                                      </span>
                                      <div className="mt-10">
                                        <Rating
                                          initialValue={cmt.rating}
                                          readonly={true}
                                          size={18}
                                        />
                                      </div>
                                    </h5>
                                    <p> {cmt.contents}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                      :
                      (
                        <div className="comment-list">
                          <h5 className="text-muted mt-40">
                            <span className="badge badge-success">Ch??a C?? Comment</span>
                          </h5>
                        </div>
                      )
                  )
                  :
                  (
                    <h1>kh??ng c?? danh s??ch ????nh gi?? s???n ph???m</h1>
                  )
              }
            </div>
          </div>
        </div>
      </div >
    );
  }
}
const mapStateToProps = state => {
  return {
    product: state.product,
    user: state.auth
  };
};
const mapDispatchToProps = dispatch => {
  return {
    get_product: async (productId) => {
      await dispatch(actGetProductRequest(productId));
    },
    addCart: (idCustomer, product, quantity, token) => {
      dispatch(actAddCartRequest(idCustomer, product, quantity, token));
    }

  }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductViewDetail));
