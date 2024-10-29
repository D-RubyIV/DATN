import React from 'react'

function Header() {
  return (
    <header className="main-header">
      {/* Header Lower */}
      <div className="header-lower">
        <div className="auto-container">
          <div className="inner-container d-flex justify-content-between align-items-center">
            <div className="logo-box d-flex align-items-center">
              <div className="nav-toggle-btn a-nav-toggle navSidebar-button">
                <span className="hamburger">
                  <span className="top-bun"></span>
                  <span className="meat"></span>
                  <span className="bottom-bun"></span>
                </span>
              </div>
              {/* Logo */}
              <div className="logo">
                <a href="index.html">
                  <img src="images/logo.png" alt="" title="" />
                </a>
              </div>
            </div>
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <nav className="main-menu show navbar-expand-md">
                <div className="navbar-header">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>
                <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                  <ul className="navigation clearfix">
                    <li className="dropdown">
                      <a href="#">Home</a>
                      <ul>
                        <li><a href="index.html">Homepage One</a></li>
                        <li><a href="index-2.html">Homepage Two</a></li>
                        <li><a href="index-3.html">Homepage Three</a></li>
                        <li className="dropdown">
                          <a href="#">Header Styles</a>
                          <ul>
                            <li><a href="index.html">Header Style One</a></li>
                            <li><a href="index-2.html">Header Style Two</a></li>
                            <li><a href="index-3.html">Header Style Three</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href="about.html">About</a></li>
                    <li className="dropdown">
                      <a href="#">Shop</a>
                      <ul>
                        <li><a href="shop.html">Our Products</a></li>
                        <li><a href="shop-detail.html">Product Single</a></li>
                        <li><a href="cart.html">Shopping Cart</a></li>
                        <li><a href="checkout.html">Checkout</a></li>
                        <li><a href="register.html">Register</a></li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a href="#">Blog</a>
                      <ul>
                        <li><a href="blog.html">Our Blog</a></li>
                        <li><a href="blog-detail.html">Blog Single</a></li>
                        <li><a href="not-found.html">Not Found</a></li>
                      </ul>
                    </li>
                    <li><a href="contact.html">Contact us</a></li>
                  </ul>
                </div>
              </nav>
              {/* Main Menu End */}
            </div>
            {/* Outer Box */}
            <div className="outer-box d-flex align-items-center">
              {/* Options Box */}
              <div className="options-box d-flex align-items-center">
                {/* Search Box */}
                <div className="search-box-outer">
                  <div className="search-box-btn">
                    <span className="flaticon-search-1"></span>
                  </div>
                </div>
                {/* User Box */}
                <a className="user-box flaticon-user-3" href="contact.html"></a>
                {/* Like Box */}
                <div className="like-box">
                  <a className="user-box flaticon-heart" href="contact.html"></a>
                  <span className="total-like">0</span>
                </div>
              </div>
              {/* Cart Box */}
              <div className="cart-box">
                <div className="box-inner">
                  <a href="shop-detail.html" className="icon-box">
                    <span className="icon flaticon-bag"></span>
                    <i className="total-cart">0</i>
                  </a>
                  Phone<br />
                  <a className="phone" href="tel:88-1900-6789-56">88 1900 6789 56</a>
                </div>
              </div>
              {/* Mobile Navigation Toggler */}
              <div className="mobile-nav-toggler">
                <span className="icon flaticon-menu"></span>
              </div>
            </div>
            {/* End Outer Box */}
          </div>
        </div>
      </div>
      {/* End Header Lower */}

      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="auto-container">
          <div className="inner-container d-flex justify-content-between align-items-center">
            {/* Logo Box */}
            <div className="logo-box d-flex align-items-center">
              {/* Logo */}
              <div className="logo">
                <a href="index.html" title="">
                  <img src="images/logo-small.png" alt="" title="" />
                </a>
              </div>
            </div>
            {/* Nav Outer */}
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <nav className="main-menu">
                {/* Leave empty / Menu loaded via Javascript */}
              </nav>
            </div>
            {/* Outer Box */}
            <div className="outer-box d-flex align-items-center">
              {/* Options Box */}
              <div className="options-box d-flex align-items-center">
                {/* Search Box */}
                <div className="search-box-outer">
                  <div className="search-box-btn">
                    <span className="flaticon-search-1"></span>
                  </div>
                </div>
                {/* User Box */}
                <a className="user-box flaticon-user-3" href="login.html"></a>
                {/* Like Box */}
                <div className="like-box">
                  <a className="user-box flaticon-heart" href="contact.html"></a>
                  <span className="total-like">0</span>
                </div>
              </div>
              {/* Cart Box */}
              <div className="cart-box">
                <div className="box-inner">
                  <a href="shop-detail.html" className="icon-box">
                    <span className="icon flaticon-bag"></span>
                    <i className="total-cart">0</i>
                  </a>
                  Phone<br />
                  <a className="phone" href="tel:+31-633-02-71-32">+31 633 02 71 32</a>
                </div>
              </div>
              {/* Mobile Navigation Toggler */}
              <div className="mobile-nav-toggler">
                <span className="icon flaticon-menu"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Sticky Menu */}

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <div className="menu-backdrop"></div>
        <div className="close-btn">
          <span className="icon flaticon-multiply"></span>
        </div>
        <nav className="menu-box">
          <div className="nav-logo">
            <a href="index.html">
              <img src="images/mobile-logo.png" alt="" title="" />
            </a>
          </div>
          {/* Search */}
          <div className="search-box">
            <form method="post" action="contact.html">
              <div className="form-group">
                <input
                  type="search"
                  name="search-field"
                  placeholder="SEARCH HERE"
                  required
                />
                <button type="submit">
                  <span className="icon flaticon-search-1"></span>
                </button>
              </div>
            </form>
          </div>
          <div className="menu-outer">
            {/* Menu loaded via Javascript / Same as in Header */}
          </div>
        </nav>
      </div>
      {/* End Mobile Menu */}
    </header>
  )
}

export default Header