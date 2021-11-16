import React, { Component } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PropTypes from "prop-types";
import s from "./ImageGallery.module.css";

import API from "../../services/imageApi";
import ImageGalleryItem from "../../components/ImageGalleryItem";
import Button from "../../components/Button";
import Loader from "react-loader-spinner";
import Modal from "../../components/Modal";
import image from "../../assets/hqdefault.jpg";

const Status = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected"
};

class ImageGallery extends Component {
  state = {
    images: null,
    page: 1,
    error: null,
    status: Status.IDLE,
    modalImageInfo: null
  };

  componentDidUpdate(prevProps, prevState) {
    const prevValue = prevProps.searchValue;
    const nextValue = this.props.searchValue;
    if (prevValue !== nextValue) {
      this.setState({ status: Status.PENDING });

      API.fetchImagesWithQuery(nextValue, this.state.page)
        .then((images) => {
          return this.setState({ images, status: Status.RESOLVED });
        })
        .catch((error) => this.setState({ error, status: Status.REJECTED }));
    }

    if (prevState.page !== this.state.page) {
      API.fetchImagesWithQuery(nextValue, this.state.page)
        .then((images) => {
          this.setState((prevState) => ({
            images: [...prevState.images, ...images],
            status: Status.RESOLVED
          }));

          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
          });
        })
        .catch((error) =>
          this.setState({
            error,
            status: Status.REJECTED
          })
        );
    }
  }
  handleClickBtn = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1
    }));
  };
  toggleModal = (modalImageInfo) => {
    this.setState({ modalImageInfo });
  };

  render() {
    const { images, status, modalImageInfo } = this.state;

    if (status === "idle") {
      return (
        <h1 style={{ color: "darkblue", textAlign: "center" }}>
          Find your image!
        </h1>
      );
    }

    if (status === "pending") {
      return (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000}
        />
      );
    }

    if (status === "rejected") {
      return (
        <>
          <img src={image} alt="try to find something else" className={s.img} />
          <h2 className={s.title}> Try to find something else</h2>
        </>
      );
    }

    if (status === "resolved") {
      return (
        <>
          <ul className={s.gallery}>
            {images.map((image) => (
              <ImageGalleryItem
                onOpenModal={() => this.toggleModal(image)}
                key={image.id}
                image={image.webformatURL}
                descr={image.tags}
              />
            ))}
          </ul>
          <Button onClick={this.handleClickBtn} />
          {modalImageInfo && (
            <Modal onClose={this.toggleModal} imageInfo={modalImageInfo} />
          )}
        </>
      );
    }
  }
}

ImageGallery.propTypes = {
  searchValue: PropTypes.string.isRequired
};

export default ImageGallery;
