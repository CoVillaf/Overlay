import React from "react";

import "./PathBar.css";

const PathBar = ({
    onSelectElement,
    path,
}) => {
    const elements = [];
    for (let i = 0; i <= path.length; ++i) {
        if (i > 0) {
            elements.push(
                <span key={`separator-${i}`} className="PathBar-separator">{">"}</span>
            );
        }
        const element = (
            (i === 0)
            ? "(root)"
            : path[i - 1]
        );
        if (i === path.length) {
            elements.push(
                <span key={`end-${i}-${element}`}>
                    {element}
                </span>
            );
        } else {
            elements.push(
                <button
                    key={`button-${i}-${element}`}
                    type="button"
                    onClick={() => onSelectElement(i)}
                >
                    {element}
                </button>
            );
        }
    }
    return (
        <div className="PathBar">
            <span className="PathBar-label">Path:</span>
            {elements}
        </div>
    );
}

export default PathBar;

