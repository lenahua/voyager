import React, { Component, useState } from 'react';
import 'bootstrap/dist/js/bootstrap';
import bootstrap from 'bootstrap/dist/js/bootstrap';

function ControllerButton () {
    const [ modelShow , setModelShow ] = useState(false);

    return (
        <div>
            <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#showDiv" onClick={() => setModelShow(true)}>新增貼文</button>
            { modelShow &&  <ShowUploadDiv />}
        </div>
    )
}
function ShowUploadDiv () {
    return (
        <div className='modal fade' id="showDiv" data-bs-backdrop="true">
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h3>上傳照片</h3>
                        <button type="button" className='btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className='modal-body'>
                        <h4>Upload image:</h4>
                        <form action="">
                            <input className="form-control" type="file" id='uploadImg' multiple/>
                        </form>
                    </div>
                    <div className='modal-header border-top'>
                        <h3>貼文說明</h3>
                    </div>
                    <div className='modal-body'>
                        <form>
                            <textarea className="form-control" id="textBox" rows="5"></textarea>
                        </form>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-outline-success'>確認上傳貼文</button>
                    </div>
                </div>
            </div>
        </div>
    
    )
}
 
export default ControllerButton;




// doUpload = (event) => {
//     const [file] = document.getElementById('imgInp').files;
//     if (file) {
//         document.getElementById('blas').src = URL.createObjectURL(file)
//         console.log(event.target.files);
//     }    
// }