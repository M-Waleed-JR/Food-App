import Slider from "./Componants/Slider";
import Menu from "./Componants/Menu";
import AboutUs from "./Componants/AboutUs";
import Orders from "./Componants/WishList";
import { Contact } from "lucide-react";

export default function Home() {
  return (
    <>
      <Slider />
      <AboutUs />
      <Menu />
      <Orders />
      <Contact />
    </>
  );
}
