import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import BeautyStars from 'beauty-stars';
import Slider from 'react-input-slider';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import './style.css'

const sliderStyleFrom = {
    track: {
        backgroundColor: '#474af0',
        width: '78%',
        height: 2,
    },
    active: {
        backgroundColor: '#acaedd'
    },
    thumb: {
        width: 10,
        height: 10,
        border: '1px solid #8183d8'
    },
    disabled: {
        opacity: 0.5
    }
};

const sliderStyleTo = {
    track: {
        backgroundColor: '#acaedd',
        width: '78%',
        height: 2,
    },
    active: {
        backgroundColor: '#474af0'
    },
    thumb: {
        width: 10,
        height: 10,
        border: '1px solid #8183d8'
    },
    disabled: {
        opacity: 0.5
    }
};

class FilterProduct extends Component {
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

    checkPriceRange = () => {
        let { fromPriceRange, toPriceRange } = this.state;
        let different = toPriceRange - fromPriceRange;
        console.log('check', different)
        if (different <= 10000000) {
            console.log('vào if')
            this.setState({
                fromPriceRange: (toPriceRange - 10000000),
                toPriceRange: (fromPriceRange + 10000000)
            });
        }
    }

    render() {
        //price range
        const { fromPriceRange, toPriceRange } = this.state;
        //screen size
        const { sz116, sz13, sz133, sz134, sz135, sz14, sz145, sz156, sz16, sz161, sz17, sz173, sz18 } = this.state;
        //producer
        const { pAcer, pAsus, pAvita, pDell, pGigabyte, pHP, pHuawei, pLG, pLenovo, pMSI } = this.state;
        //CPU
        const { celeron, pentium, snapdragon, coreI3, coreI5, coreI7, coreI9, ryzen3, ryzen5, ryzen7, ryzen9 } = this.state;
        //ram
        const { ram4, ram8, ram16, ram32 } = this.state;
        //ssd
        const { ssd1, ssd512, ssd256, ssd128 } = this.state;

        return (
            <div className="col-2 filter-area">
                <span className="filter-tittle"><i class="fa fa-filter"></i> Bộ lọc tìm kiếm</span>
                {/* Phần filter giá */}
                <div className="row no-gutters price-range-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Khoảng giá</span>
                    </div>
                    <div className="col from-price-range text-center">
                        <span className="input-range">{fromPriceRange}</span>
                        <Slider
                            styles={sliderStyleFrom}
                            axis="x"
                            xmin={0}
                            xmax={90000000}
                            xstep={500000}
                            x={fromPriceRange}
                            onChange={({ x }) => { this.checkPriceRange(); this.setState({ fromPriceRange: x }); }}
                        />
                    </div>
                    <div className="col to-price-range text-center">
                        <span className="input-range">{toPriceRange}</span>
                        <Slider
                            styles={sliderStyleTo}
                            axis="x"
                            xmin={10000000}
                            xmax={100000000}
                            xstep={500000}
                            x={toPriceRange}
                            onChange={({ x }) => { this.checkPriceRange(); this.setState({ toPriceRange: x }) }}
                        />
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter hãng sản xuất */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Hãng sản xuất</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAcer' checked={pAcer} onChange={(event) => { this.handleChange(event) }} />
                        <span>Acer</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAsus' checked={pAsus} onChange={(event) => { this.handleChange(event) }} />
                        <span>Asus</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pAvita' checked={pAvita} onChange={(event) => { this.handleChange(event) }} />
                        <span>Avita</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pDell' checked={pDell} onChange={(event) => { this.handleChange(event) }} />
                        <span>Dell</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pGigabyte' checked={pGigabyte} onChange={(event) => { this.handleChange(event) }} />
                        <span>Gigabyte</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pHP' checked={pHP} onChange={(event) => { this.handleChange(event) }} />
                        <span>HP</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pHuawei' checked={pHuawei} onChange={(event) => { this.handleChange(event) }} />
                        <span>Huawei</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pLG' checked={pLG} onChange={(event) => { this.handleChange(event) }} />
                        <span>LG</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pLenovo' checked={pLenovo} onChange={(event) => { this.handleChange(event) }} />
                        <span>Lenovo</span>
                    </div>
                    <div className="col-6 producer-item">
                        <input className="input-checkbox" type="checkbox" name='pMSI' checked={pMSI} onChange={(event) => { this.handleChange(event) }} />
                        <span>MSI</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter CPU */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">CPU</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='celeron' checked={celeron} onChange={(event) => { this.handleChange(event) }} />
                        <span>Celeron</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='pentium' checked={pentium} onChange={(event) => { this.handleChange(event) }} />
                        <span>Pentium</span>
                    </div>
                    <div className="col-12 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='snapdragon' checked={snapdragon} onChange={(event) => { this.handleChange(event) }} />
                        <span>Snapdragon</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI3' checked={coreI3} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i3</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI5' checked={coreI5} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i5</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI7' checked={coreI7} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i7</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='coreI9' checked={coreI9} onChange={(event) => { this.handleChange(event) }} />
                        <span>Core i9</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen3' checked={ryzen3} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 3</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen5' checked={ryzen5} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 5</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen7' checked={ryzen7} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 7</span>
                    </div>
                    <div className="col-6 CPU-item">
                        <input className="input-checkbox" type="checkbox" name='ryzen9' checked={ryzen9} onChange={(event) => { this.handleChange(event) }} />
                        <span>Ryzen 9</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter RAM */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">RAM</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram4' checked={ram4} onChange={(event) => { this.handleChange(event) }} />
                        <span>4 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram8' checked={ram8} onChange={(event) => { this.handleChange(event) }} />
                        <span>8 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram16' checked={ram16} onChange={(event) => { this.handleChange(event) }} />
                        <span>16 GB</span>
                    </div>
                    <div className="col-6 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ram32' checked={ram32} onChange={(event) => { this.handleChange(event) }} />
                        <span>32 GB</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter Ổ cứng */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Ổ cứng</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd1' checked={ssd1} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 1 TB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd512' checked={ssd512} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 512 GB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd256' checked={ssd256} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 256 GB</span>
                    </div>
                    <div className="col-12 ram-item">
                        <input className="input-checkbox" type="checkbox" name='ssd128' checked={ssd128} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 128 GB</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter Card đồ họa */}
                <div className="row no-gutters producer-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Card đồ họa</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='ssd1' checked={ssd1} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 1 TB</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='ssd512' checked={ssd512} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 512 GB</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='ssd256' checked={ssd256} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 256 GB</span>
                    </div>
                    <div className="col-12 graphics-card-item">
                        <input className="input-checkbox" type="checkbox" name='ssd128' checked={ssd128} onChange={(event) => { this.handleChange(event) }} />
                        <span>SSD 128 GB</span>
                    </div>
                </div>

                {/* Phân cách giữa các phần */}
                <div className='row no-gutters divider'></div>

                {/* Phần filter kích thước màn hình */}
                <div className="row no-gutters screen-size-area">
                    <div className="col-12">
                        <span className="filter-area-tittle">Kích thước màn hình</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz116' checked={sz116} onChange={(event) => { this.handleChange(event) }} />
                        <span>11.6"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz13' checked={sz13} onChange={(event) => { this.handleChange(event) }} />
                        <span>13"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz133' checked={sz133} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.3"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz134' checked={sz134} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.4"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz135' checked={sz135} onChange={(event) => { this.handleChange(event) }} />
                        <span>13.5"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz14' checked={sz14} onChange={(event) => { this.handleChange(event) }} />
                        <span>14"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz145' checked={sz145} onChange={(event) => { this.handleChange(event) }} />
                        <span>14.5"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz156' checked={sz156} onChange={(event) => { this.handleChange(event) }} />
                        <span>15.6"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz16' checked={sz16} onChange={(event) => { this.handleChange(event) }} />
                        <span>16"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz161' checked={sz161} onChange={(event) => { this.handleChange(event) }} />
                        <span>16.1"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz17' checked={sz17} onChange={(event) => { this.handleChange(event) }} />
                        <span>17"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz173' checked={sz173} onChange={(event) => { this.handleChange(event) }} />
                        <span>17.3"</span>
                    </div>
                    <div className="col-6 screen-size-item">
                        <input className="input-checkbox" type="checkbox" name='sz18' checked={sz18} onChange={(event) => { this.handleChange(event) }} />
                        <span>18"</span>
                    </div>
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

export default withRouter(FilterProduct)
