import * as React from "react";
import lodash from "lodash";
import Modal, { Props } from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "./components/button";
import ProductList from "./components/product-list-components";
import { Form } from "./components/form";
import logo from "./images/droppe-logo.png";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import styles from "./shopApp.module.css";
import { useState, useEffect } from "react";

const ShopApp = () => {
  const [products, setProducts] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isShowingMessage, setIsShowingMessage] = useState<Boolean>(false);
  const [message, setMessage] = useState<String>("");
  const [numFavorites, setNumFavorites] = useState<number>(0);
  const [prodCount, setProdCount] = useState<number>(0);

  useEffect(() => {
    document.title = "Droppe refactor app";
    fetch("https://fakestoreapi.com/products").then((response) => {
      let jsonResponse = response.json();

      jsonResponse.then((rawData) => {
        let data = [];

        for (let i = 0; i < rawData.length; i++) {
          let updatedProd = rawData[i];
          data.push(updatedProd);
        }
        setProducts(data);
        setProdCount(data.length);
      });
    });
  }, []);

  const onSubmit = (payload: {
    title: string;
    description: string;
    price: string;
  }) => {
    const updated = lodash.clone(products);
    updated.push({
      title: payload.title,
      description: payload.description,
      price: payload.price,
    });
    setProducts(updated);
    setProdCount(lodash.size(products) + 1);
    setIsOpen((prevNum) => !prevNum);
    setIsShowingMessage(true);
    setMessage("Adding product...");

    // **this POST request doesn't actually post anything to any database**
    fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify({
        title: payload.title,
        price: payload.price,
        description: payload.description,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setTimeout(() => {
          setIsShowingMessage(false);
          setMessage("");
        }, 2000);
      });
  };

  const favClick = (title: string) => {
    const prods = [...products];
    const idx = lodash.findIndex(prods, { title: title });
    let currentFavs = numFavorites;
    let totalFavs: any;

    if (prods[idx].isFavorite) {
      prods[idx].isFavorite = false;
      totalFavs = --currentFavs;
    } else {
      totalFavs = ++currentFavs;
      prods[idx].isFavorite = true;
    }

    setProducts(prods);
    setNumFavorites(totalFavs);
  };
  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={["container", styles.headerImageWrapper].join(" ")}>
          <img src={logo} className={styles.headerImage} />
        </div>
      </div>

      <>
        <span
          className={["container", styles.main].join(" ")}
          style={{
            margin: "50px inherit",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <img src={img1} style={{ maxHeight: "15em", display: "block" }} />
          <img src={img2} style={{ maxHeight: "15rem", display: "block" }} />
        </span>
      </>

      <div
        className={["container", styles.main].join(" ")}
        style={{ paddingTop: 0 }}
      >
        <div className={styles.buttonWrapper}>
          <span role="button">
            <Button onClick={() => setIsOpen(true)}>
              Send product proposal
            </Button>
          </span>
          {isShowingMessage && (
            <div className={styles.messageContainer}>
              <i>{message}</i>
            </div>
          )}
        </div>

        <div className={styles.statsContainer}>
          <span>Total products: {prodCount}</span>
          {" - "}
          <span>Number of favorites: {numFavorites}</span>
        </div>

        {products && !!products.length ? (
          <ProductList products={products} onFav={favClick} />
        ) : (
          <div></div>
        )}
      </div>

      <>
        <Modal
          isOpen={isOpen}
          className={styles.reactModalContent}
          overlayClassName={styles.reactModalOverlay}
        >
          <div className={styles.modalContentHelper}>
            <div
              className={styles.modalClose}
              onClick={function (this: any) {
                this.setState({
                  isOpen: false,
                });
              }.bind(this)}
            >
              <FaTimes />
            </div>

            <Form on-submit={onSubmit} />
          </div>
        </Modal>
      </>
    </React.Fragment>
  );
};

export default ShopApp;
