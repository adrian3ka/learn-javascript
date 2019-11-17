import React from 'react';
import PropTypes from 'prop-types'; // ES6


export default class Summary extends React.Component {
    static propTypes = {
        ingredients: PropTypes.number,
        steps: PropTypes.number,
        title: function (props, propName) {
            if (typeof props[propName] !== 'string') {
                return new Error("A title must be a string");
            }

            if (props[propName].length > 20) {
                return new Error("title is over 20 characters");
            }
        }
    }

    static defaultProps = {
        ingredients: 5,
        steps: 5,
        title: "[recipe]"
    }

    render() {
        const {ingredients, steps, title} = this.props
        return (
            <div className="summary">
                <h1>{title}</h1>
                <p>
                    <span>{ingredients} Ingredients</span> |
                    <span>{steps} Steps</span>
                </p>
            </div>
        )
    }
}
