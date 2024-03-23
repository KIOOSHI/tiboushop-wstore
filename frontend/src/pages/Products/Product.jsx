import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <section className="justify-between place-items-center ">
    <div className="w-[30rem] ml-5 p-3 relative">
      <div className="relative m-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-[30rem] rounded justify-between"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4 m-6">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-pink-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              DZD {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
    </section>
  );
};

export default Product;