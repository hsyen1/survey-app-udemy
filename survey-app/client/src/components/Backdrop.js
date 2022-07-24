import "../styles/Backdrop.css";
function Backdrop(props) {
  return <div className="background" onClick={props.onCancel}></div>;
}

export default Backdrop;
