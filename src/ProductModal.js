import { useEffect, useState } from 'react';
import { Button, Modal, Carousel, Spinner } from 'react-bootstrap';

const ProductModal = ({ isOpened, onClose, selectedProduct }) => {
  const [productDetail, setProductDetail] = useState();
  const [ingredients, setIngredients] = useState();
  const [loading, setLoading] = useState(false);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${selectedProduct.idDrink}`
      );
      const result = await res.json();
      setProductDetail(result.drinks[0]);

      //get ingredients
      let arr = [];
      for (const property in result.drinks[0]) {
        if (property.includes('strIngredient')) {
          if (result.drinks[0][property]) {
            arr = [...arr, result.drinks[0][property]];
          }
        }
      }
      setIngredients(arr);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      getProductDetails(selectedProduct);
    }
  }, [selectedProduct]);

  const onCloseModal = () => {
    setProductDetail();
    setIngredients();
    onClose();
  };

  return (
    <Modal show={isOpened} onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct && selectedProduct.strDrink}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className='text-center my-4'>
            <Spinner animation='border' className='spinner__loading' />
          </div>
        ) : (
          <div>
            {productDetail && (
              <div>
                <img
                  src={productDetail.strDrinkThumb}
                  alt='cocktail'
                  className='img-fluid mb-4'
                />
                <div className='mb-4'>
                  <h3 className='mb-4'>Details:</h3>
                  <p className='mb-2'>
                    Alcoholic: {productDetail.strAlcoholic}
                  </p>
                  <p className='mb-2'>Category: {productDetail.strCategory}</p>
                  <p className='mb-2'>Glass: {productDetail.strGlass}</p>
                  <p className='mb-2'>
                    Instructions: {productDetail.strInstructions}
                  </p>
                </div>
              </div>
            )}

            {ingredients && (
              <>
                <h3 className='mb-4'>Ingredients:</h3>
                <Carousel className='bg-dark carousel__ingredients'>
                  {ingredients.map((ingredient, i) => (
                    <Carousel.Item key={i}>
                      <img
                        className='d-block w-100'
                        src={`https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`}
                        alt={ingredient}
                      />
                      <Carousel.Caption>
                        <h3>{ingredient}</h3>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
