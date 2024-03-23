import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loder";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="container mx-auto px-4 justify-center ml-20 ">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full">
          <ProductCarousel />
        </div>
        <div className="hidden xl:block w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
