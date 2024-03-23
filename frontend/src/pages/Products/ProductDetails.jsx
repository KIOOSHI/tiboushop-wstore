import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loder";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="container mx-auto ml-25">
        <div className="mr-5">
          <Link to="/" className="text-purple-500 font-semibold hover:underline">
            Go Back
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            <div className="flex flex-col md:flex-row mt-20">
              <div className="md:w-1/2 ml-11">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full"
                />

                <HeartIcon product={product} />
              </div>

              <div className="md:w-1/2 md:pl-5 mt-5 ml-11">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="my-4 text-gray-600">{product.description}</p>
                <p className="text-5xl my-4 font-extrabold">DZ{product.price}</p>

                <div className="flex items-center justify-between ml-7">
                  <div>
                    <p className="flex items-center mb-3">
                      <FaStore className="mr-2" /> Brand: {product.brand}
                    </p>
                    <p className="flex items-center mb-3">
                      <FaClock className="mr-2" /> Added: {moment(product.createAt).fromNow()}
                    </p>
                    <p className="flex items-center mb-3">
                      <FaStar className="mr-2" /> Reviews: {product.numReviews}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center mb-3 ml-11">
                      <FaStar className="mr-2" /> Ratings: {rating}
                    </p>
                    <p className="flex items-center mb-3">
                      <FaShoppingCart className="mr-2" /> Quantity: {product.quantity}
                    </p>
                    <p className="flex items-center mb-3">
                      <FaBox className="mr-2" /> In Stock: {product.countInStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between ml-11">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                  {product.countInStock > 0 && (
                    <div>
                      <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="p-2 rounded-lg text-black"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="bg-purple-500 hover:bg-purple-900 text-white py-2 px-4 rounded-lg"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 ml-11">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
