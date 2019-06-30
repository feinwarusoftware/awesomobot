import React, { Component } from "react";

class Langbar extends Component {
  render() {
    return (
      <React.Fragment>
        <lang>
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-12">
                <ul>
                  <li>
                    <a>English</a>
                  </li>
                  <li>
                    <a>Ur Ma</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </lang>
      </React.Fragment>
    );
  }
}

export default Langbar;
