
import Navbar from "../../components/Header/Navbar";
import Logo from "../Logo";
import { homeClasses } from "./homeClasses";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;

  return (
    <>
    <Navbar/>
      <div className={container}>
       {/* <Logo/> */}
       welcome Sush
      </div>
    </>
  );
};

export default Home;
