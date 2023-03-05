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
    overflow: "hidden",
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

const settings360 = {
  dots: false,
  infinite: true,
  speed: 10,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 300,
  fade: true,
  swipe: false,
  arrows: false,
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

  componentWillMount = async () => {

    await this.props.get_product(this.props.id);

    let listImage = await getProductListImageURL(this.props.id);
    let listImage360 = await getProductListImage360URL(this.props.id);
    this.setState({
      listImageURL: listImage.images,
      listImage360URL: listImage360.images360,
    });
  }

  // componentDidMount = () => {
  //   this.props.get_product(this.props.id);
  // }

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
        //tài khoản này đã comment
        return (
          <div class="comment-item media border p-3">
            <div className="media-body">
              <h5>
                <span style={{ fontSize: "14px", fontStyle: "italic" }}>
                  {listReviews[i].username}&nbsp;(Bạn)
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
    let idAccount = localStorage.getItem('_idaccount');
    let listReviews = product.reviewsResponses.listReviews;

    for (let i = 0; i < product.reviewsResponses.listReviews.length; i++) {
      if (listReviews[i].accountId === parseInt(idAccount)) {
        //tài khoản này đã comment
        return true;
      }
    }

    //tài khoản này chưa comment
    return false;
  }

  upItem = (quantity) => {
    if (quantity >= 5) {
      toast.error('Tối đa 5 sản phẩm')
      return
    }
    this.setState({
      quantity: quantity + 1
    })
  }

  downItem = (quantity) => {
    if (quantity <= 1) {
      toast.error('Tối thiểu 1 sản phẩm')
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
      this.setState({
        redirectYourLogin: true
      })
    }
    else {
      this.setState({
        redirectYourLogin: false
      })
      this.props.addCart(id, product, quantity, token);
    }

  }

  openModalViewImage = () => {
    this.setState({
      modalIsOpen: true,
      modalState: 1,
    });

    setTimeout(() => {
      let modalHeader1 = document.getElementsByClassName('modal-image-header1')[0];
      modalHeader1.classList.add('modal-image-header--active');

      let sliderState1 = document.getElementsByClassName('slider-state1')[0];
      sliderState1.style.opacity = '1';
      sliderState1.style.display = 'block';
      let sliderState2 = document.getElementsByClassName('slider-state2')[0];
      sliderState2.style.opacity = '0';
      sliderState2.style.display = 'none';
    }, 200);
  }

  openModalViewImage360 = () => {
    this.setState({
      modalIsOpen: true,
      modalState: 2,
    });

    setTimeout(() => {
      let modalHeader2 = document.getElementsByClassName('modal-image-header2')[0];
      modalHeader2.classList.add('modal-image-header--active');

      let sliderState1 = document.getElementsByClassName('slider-state1')[0];
      sliderState1.style.opacity = '0';
      sliderState1.style.display = 'none';
      let sliderState2 = document.getElementsByClassName('slider-state2')[0];
      sliderState2.style.opacity = '1';
      sliderState2.style.display = 'block';
    }, 200);
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  handleOnClickSpan1 = () => {
    let sliderState1 = document.getElementsByClassName('slider-state1')[0];
    sliderState1.style.opacity = '1';
    sliderState1.style.display = 'block';
    let sliderState2 = document.getElementsByClassName('slider-state2')[0];
    sliderState2.style.opacity = '0';
    sliderState2.style.display = 'none';

    let modalHeader1 = document.getElementsByClassName('modal-image-header1')[0];
    let modalHeader2 = document.getElementsByClassName('modal-image-header2')[0];

    modalHeader1.classList.add('modal-image-header--active');
    modalHeader2.classList.remove('modal-image-header--active');

    // this.setState({
    //   modalState: 1,
    // });
  }

  handleOnClickSpan2 = () => {
    let sliderState1 = document.getElementsByClassName('slider-state1')[0];
    sliderState1.style.opacity = '0';
    sliderState1.style.display = 'none';
    let sliderState2 = document.getElementsByClassName('slider-state2')[0];
    sliderState2.style.opacity = '1';
    sliderState2.style.display = 'block';

    let modalHeader1 = document.getElementsByClassName('modal-image-header1')[0];
    let modalHeader2 = document.getElementsByClassName('modal-image-header2')[0];

    modalHeader1.classList.remove('modal-image-header--active');
    modalHeader2.classList.add('modal-image-header--active');

    // this.setState({
    //   modalState: 2,
    // });
  }

  render() {
    const { product, user } = this.props;
    const { quantity, redirectYourLogin, cmtContent, cmtRating, ratingState, checkCommented, listImageURL, listImage360URL } = this.state;
    const { modalIsOpen, modalState } = this.state;
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
                <span onClick={() => { this.handleOnClickSpan1() }}>Thư viện ảnh</span>
              </div>
              <div className="col-md-2-auto modal-image-header2">
                <span onClick={() => { this.handleOnClickSpan2() }}>Ảnh 360 độ</span>
              </div>
              <span className="btn-close-modal" onClick={() => { this.closeModal() }}><i class="fa-solid fa-xmark"></i></span>
            </div>
            {/* row modal body */}
            <div className="row">
              <div className="col">
                {
                  <>
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
                              <div className="not-upadted">Chúng tôi đang cập nhật mục này</div>
                            )
                        }
                      </Slider>
                    </div>
                    <div className="slider-state2">
                      <Slider  {...settings360}>
                        {
                          listImage360URL.length > 0 ?
                            (
                              listImage360URL.map((url, index) => {
                                return (
                                  <div key={index} className="image-in-slider-modal">
                                    <img src={url} alt="not found" />
                                  </div>
                                );
                              })
                            )
                            :
                            (
                              <div className="not-upadted">Chúng tôi đang cập nhật mục này</div>
                            )
                        }
                      </Slider>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>

        </Modal>
        <div className="container">
          {/* row product-detail-header */}
          <div className="row product-detail-header">
            {/* slider hình ảnh sản phẩm */}
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
              {/* row chức năng */}
              <div className="btn-open-library">
                {/* nút xem thư viện ảnh */}
                <button type="button" onClick={() => { this.openModalViewImage() }}>
                  <img src={process.env.PUBLIC_URL + '/icon/icon-image.png'} alt="Not found" />
                  <span className="btn-span">Xem thư viện</span>
                </button>
                {/* nút xem ảnh 360 */}
                <button type="button" onClick={() => { this.openModalViewImage360() }}>
                  <img src={process.env.PUBLIC_URL + '/icon/icon-360-degrees.png'} alt="Not found" />
                  <span className="btn-span">Ảnh 360 độ</span>
                </button>
              </div>
            </div>
            {/* THông tin về giá, khuyến mãi, tồn kho, thêm vào giỏ */}
            <div className="col-md-7">
              <div className="product-details-view-content sp-normal-content">
                <div className="product-info">
                  <span className="product-name">{product.productName}</span>
                  {/* Xử lý ngừng kinh doanh, hết hàng, và có discount */}
                  {
                    product.isDeleted === 'yes' ?
                      (
                        <>
                          <h3>Ngừng Kinh Doanh! </h3>
                          <h6>Chân thành xin lỗi quý khách, chúng tôi đã ngừng kinh doanh sản phẩm này.</h6>
                        </>
                      )
                      :
                      (
                        product.quantity === 0 ?
                          (
                            <>
                              <h3>Tạm Hết Hàng! </h3>
                              <h6>Chân thành xin lỗi quý khách, chúng tôi sẽ mong chóng nhập hàng để đáp ứng nhu cầu mua sắm của bạn.</h6>
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
                                        Chỉ còn: {(product.unitprice * ((100 - product.discount) / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
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

                  {/* Mốt có thể đặt mô tả nhanh ở đây */}
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
                            <label>Số lượng&emsp;&emsp;&emsp;<span style={{ fontSize: "15px", fontStyle: "italic", color: "green" }}>(Tồn kho:&nbsp;{product.quantity})</span></label>
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
                            <Link
                              onClick={() => this.addItemToCart(product)}
                              className="add-to-cart button-hover-addcart button"
                            >
                              Thêm vào giỏ
                              <i class="fa fa-shopping-cart"></i>
                            </Link>
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
            <div className="col-md-9">
              <div className="product-description-title">
                Mô tả sản phẩm
              </div>
              <div className="product-description-content">
                <span dangerouslySetInnerHTML={{ __html: product.description }}></span>
              </div>
            </div>
            {/* col product configuration */}
            <div className="col-md-3">
              <div className="product-configuration-title">
                Thông tin chi tiết
              </div>
              <div className="product-configuration-content">
                <span> RAM ROM CPU...</span>
              </div>
            </div>
          </div>

          {/* row product-detail-rating */}
          <div className="row product-detail-rating">
            {/* đánh giá tổng quát của sản phẩm */}
            <div className="col-12">
              <RatingView commented={commented} rating={product.reviewsResponses.rating} listReviews={product.reviewsResponses.listReviews}></RatingView>
            </div>

            {/* danh sách comment */}
            <div className="col-12">
              {
                product.reviewsResponses.listReviews ?
                  (
                    product.reviewsResponses.listReviews.length > 0 ?
                      (
                        <div className="comment-list">
                          <h5 className="text-muted mt-40">
                            <span className="badge badge-success">{product.reviewsResponses.listReviews.length}</span>
                            {" "}Comment
                          </h5>
                          {/* Render ra comment của bản thân trước */}
                          {
                            this.renderMyCMT()
                          }
                          {/* Render ra comment của những người còn lại */}
                          {
                            product.reviewsResponses.listReviews.map((cmt, index) => {
                              if (cmt.accountId === idAccount) {
                                return null;
                              }
                              return (
                                <div key={index} class="comment-item media border p-3">
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
                            <span className="badge badge-success">Chưa Có Comment</span>
                          </h5>
                        </div>
                      )
                  )
                  :
                  (
                    <h1>không có danh sách đánh giá sản phẩm</h1>
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
