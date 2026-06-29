import Banner from "@/components/home/Banner";
import FeaturedClasses from "@/components/home/FeaturedClasses";
import LatestPosts from "@/components/home/LatestPosts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedClasses />
      <LatestPosts />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}