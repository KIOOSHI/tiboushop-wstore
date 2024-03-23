import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="container ml-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/4 p-3">
          <div className="ml-2 text-xl font-bold h-12">
            All Products ({products.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 lg:w-40 lg:h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between">
                    <div className="flex justify-between mb-2">
                      <h5 className="text-xl font-semibold">
                        {product?.name}
                      </h5>
                      <p className="text-gray-400 text-xs">
                        {moment(product.createdAt).format('MMMM Do YYYY')}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-4">
                      {product?.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                      >
                        Update Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p>DZD {product?.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;