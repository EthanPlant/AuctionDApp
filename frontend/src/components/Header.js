import "./Header.scss";
import propTypes from "prop-types";
import react from "react";
const gavel = require("../images/gavel.png");
export const Header = ({ title }) => {
	return (
		<div className="header">
			<h1>
				{title}{" "}
				<span role="img" aria-label="gavel">
					💎
				</span>
			</h1>
		</div>
	);
};
Header.defaultProps = { title: "TemplateTitle" };
Header.propTypes = { title: propTypes.string.isRequired };
