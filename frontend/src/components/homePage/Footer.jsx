import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
class Footer extends Component {
    state = {  } 
    render() { 
        return (
            // <div className="row sticky-bottom">
            <div className="row mt-5">
                <div className="col border border-3 rounded-3" style={{height:"100px" }}><h1>Footer</h1></div>
            </div>
            // <div className="row ">
            //     <div className="col">
            //         <div class="row">
            //             <div class="col border">
            //             </div>
            //             <div class="col border">
            //                 <h1 class="">Yoyager</h1>
            //             </div>
            //             <div class="col border">
            //                 <img class="float-end" src={Img} alt="ddd" style={{width:"300px"}}/>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }
}
 
export default Footer;