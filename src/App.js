import { useState } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';

import Filter from './Filter';
import ProductModal from './ProductModal';
import './App.scss';

function App() {
  const [cocktails, setCocktails] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenProductView, setIsOpenProductView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

  const onFilter = async (filterBy, value) => {
    try {
      setLoading(true);
      let res;
      switch (filterBy) {
        case 'Alcoholic':
          res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${value}`
          );
          break;
        case 'Category':
          res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${value}`
          );
          break;
        case 'Glass':
          res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${value}`
          );
          break;
        default:
          break;
      }
      const result = await res.json();
      setCocktails(result.drinks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onViewMore = (product) => {
    setIsOpenProductView(true);
    setSelectedProduct(product);
  };

  const onCloseProductView = () => {
    setIsOpenProductView(false);
    setSelectedProduct();
  };

  return (
    <div className='App bg-dark text-light min-vh-100'>
      <Container className='py-4'>
        <div className='mb-4'>
          <Filter onFilter={onFilter} />
        </div>

        {!loading ? (
          <Row>
            {cocktails &&
              cocktails.map((cocktail, i) => (
                <Col xs={6} md={4} key={i} className='text-center mb-2 product'>
                  <div className='product__image'>
                    <img
                      src={cocktail.strDrinkThumb}
                      alt='cocktail'
                      className='img-fluid mb-2'
                    />
                    <Button
                      variant='dark'
                      className='product__image__viewBtn'
                      onClick={() => onViewMore(cocktail)}
                    >
                      View More
                    </Button>
                  </div>

                  <p className='mb-2'>{cocktail.strCategory}</p>
                  <h5>{cocktail.strDrink}</h5>
                </Col>
              ))}
          </Row>
        ) : (
          <div className='text-center my-4'>
            <Spinner animation='border' className='spinner__loading' />
          </div>
        )}
        <ProductModal
          isOpened={isOpenProductView}
          onClose={onCloseProductView}
          selectedProduct={selectedProduct}
        />
      </Container>
    </div>
  );
}

export default App;
