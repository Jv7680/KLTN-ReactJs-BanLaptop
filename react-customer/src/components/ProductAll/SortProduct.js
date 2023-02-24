import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import BeautyStars from 'beauty-stars';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import './style.css'

class SortProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromPriceRange: 0,
            toPriceRange: 100000000,
            sz116: false,
            sz13: false,
            sz133: false,
            sz134: false,
            sz135: false,
            sz14: false,
            sz145: false,
            sz156: false,
            sz16: false,
            sz161: false,
            sz17: false,
            sz173: false,
            sz18: false,
            pAcer: false,
            pAsus: false,
            pAvita: false,
            pDell: false,
            pGigabyte: false,
            pHP: false,
            pHuawei: false,
            pLG: false,
            pLenovo: false,
            pMSI: false,
            celeron: false,
            pentium: false,
            snapdragon: false,
            coreI3: false,
            coreI5: false,
            coreI7: false,
            coreI9: false,
            ryzen3: false,
            ryzen5: false,
            ryzen7: false,
            ryzen9: false,
            ram4: false,
            ram8: false,
            ram16: false,
            ram32: false,
            ssd1: false,
            ssd512: false,
            ssd256: false,
            ssd128: false,
        }
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleOnClickSortItem = (event) => {
        let name = event.target.attributes.name.nodeValue;
        let listSortItem = document.getElementsByClassName('sort-item');

        for (let i = 0; i <= 2; i++) {
            listSortItem[i].classList.remove('sort-item--active');
        }

        listSortItem[name].classList.add('sort-item--active');
    }

    render() {
        //price range
        const { fromPriceRange, toPriceRange, disablePriceRange } = this.state;
        return (
            <div className="row sort-area">
                <div className='col-auto'>
                    <span className='sort-title'>Sắp xếp theo</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='pricesGoUp'>Giá tăng dần</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='pricesGoDown'>Giá giảm dần</span>
                </div>
                <div className='col-auto'>
                    <span className='sort-item' onClick={(event) => { this.handleOnClickSortItem(event) }} name='mostSold'>Bán chạy</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        getProduct: state.product
    }
}

export default withRouter(SortProduct)
