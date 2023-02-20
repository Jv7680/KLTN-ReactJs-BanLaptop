import React, { Component } from 'react'
import HeaderTop from './HeaderTop'
import HeaderMiddle from './HeaderMiddle'
import HeaderBottom from './HeaderBottom'
import HeaderMobile from './HeaderMobile'

import './header-top.css';
import './header-middle.css';
import './header-bottom.css';

export default class Header extends Component {
  reRenderHeader = () => {
    console.log('vào reRenderHeader');
    this.setState(this.state);
  }

  render() {
    return (
      <header>
        {/* Begin Header Top Area */}
        <HeaderTop reRenderHeader={this.reRenderHeader}></HeaderTop>
        {/* End Header Top Area */}

        {/* Begin Header Middle Area */}
        <HeaderMiddle reRenderHeader={this.reRenderHeader}></HeaderMiddle>
        {/* End Header Middle Area */}

        {/* Begin Header Bottom Menu Area */}
        <HeaderBottom></HeaderBottom>
        {/* End Header Bottom Menu Area */}

        {/* Begin Header Mobile Menu Area */}
        {/* <HeaderMobile></HeaderMobile> */}
        {/* End Header Mobile Menu Area */}

      </header>
    )
  }
}
