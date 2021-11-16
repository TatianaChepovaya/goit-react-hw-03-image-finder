import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";

import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";

class App extends Component {
  state = {
    searchValue: ""
  };

  handleFormSubmit = (searchValue) => {
    this.setState({ searchValue });
  };

  render() {
    const { searchValue } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery searchValue={searchValue} />
        <ToastContainer />
      </div>
    );
  }
}

export default App;
