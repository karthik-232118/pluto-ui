
import "./index.css";
import PropTypes from "prop-types";

const Thumbnails = ({ images, active, setActive }) => {
  return (
    <div className="thumbnails_thumbnail">
      {images.map((image, index) => (
        <img
          className={`thumbnails__scroll ${
            active === index && "thumbnail__active"
          }`}
          key={index}
          src={image}
          alt="pdf"
          id={`${index}`}
          onClick={() => setActive(index)}
        />
      ))}
    </div>
  );
};

export default Thumbnails;

Thumbnails.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.number.isRequired,
  setActive: PropTypes.func.isRequired,
};