import React from 'react';
import axios from 'axios';
import MyModal from './myModal.jsx';
import '../../css/viewPage.css';


//Header原件
function Nav(prop){
    return <nav className="text-center fs-2 bg-secondary"><h1>Voyager</h1></nav>;
}


//左側地區篩選欄
function FilterBar(prop){
   
    let [isClikedLocation, setLocation] = React.useState("所有");
    let [keyWord,setKeyWord] = React.useState("");

    let locationData = [
        {area:'北部地區',
        location:['台北市','新北市','桃園市','基隆市','新竹市','新竹縣']},
        {area:'中部地區',
        location:['台中市','苗栗市','彰化市','南投市','雲林市']},
        {area:'南部地區',
         location:['高雄市','台南市','嘉義市','嘉義縣','屏東縣']},
        {area:'東部地區',
         location:['宜蘭縣','花蓮縣','台東縣']}
    ]
    
    //取得各地區內的縣市名稱
    const getlocationName = (locationAry) => {
        let newAry = locationAry.map(locationName => (
            <li key={locationName} 
                onClick={()=>{locationClick(locationName)}}
                style={locationName===isClikedLocation?{backgroundColor:"rgb(201, 213, 223)"}:{}}>
            {locationName}</li>
        ))
        return newAry;
    };
    const locationClick = async(locationName)=>{
        let result = await axios.get(`http://localhost:8000/viewPage/locationFilter?lname=${locationName}`);
        setLocation(locationName)   ;               
        prop.handleFilterBar(result);
    }
    return(
        <div className="filterBar col-2 d-none d-lg-block position-sticky sticky-top vh-">
            <div className="locationTitle mb-1 border-bottom border-3 d-flex align-items-center w-75">
                <h4 className="mb-0 mt-0 position-absolute">地區{isClikedLocation}</h4>
            </div>
            <div>
            {
            locationData.map(locationObj =>{
                return(
                    <React.Fragment>
                        <h5 >{locationObj.area}</h5>
                        <ul className="nav flex-column w-75">
                            {getlocationName(locationObj.location)}
                        </ul>
                    </React.Fragment>
                )
            })
            } 
            </div>     
        </div>
    );
}
    
//圖牆內容+搜尋排序
class Content extends React.Component{
    
    
    render(){
        return(
            <div className="content row col-12 col-lg-10 g-3">
                <div className=" col-12 d-flex align-items-center justify-content-between">
                    
                    <div className="searchBox mb-1 ps-3 border border-3 rounded-pill d-flex align-items-center">
                        <input className="inline-block h-100 border-0" type="text" placeholder="請輸入關鍵字:" />
                        <button className="btn ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </button>
                    </div>    

                    <div className="sortBox d-flex justify-content-between">
                        <button className="badge border-0 text-dark" style={{ fontSize: '20px', padding: '10px 16px' }}>最新</button>
                        <button className="badge border-0 text-dark" style={{ fontSize: '20px', padding: '10px 16px' }}>熱門</button>
                    </div>
                </div>      
                {this.props.dataAry.map(post=>
                    <div className="col-4 col-md-4 postbox" id={post.postid}
                         onClick={()=>{this.changeModalContent(post.postid)}}
                    >
                        
                        <img src={`data:image/jpeg;base64,${post.img}`} alt="img"/>
                       <h2>{post.postid}</h2>
                    </div>
                    
                )}                
            </div>
        );
    }

    changeModalContent = (postid)=>{
        this.props.handleModal(postid);
    }
}

//網站內容容器
class Container extends React.Component{
    state = {
        dataAry:[{img:""}],
        modalInfoAry:[],
        postTagAry:[],
        postCommentAry:[],
        commentCounter:[],
        userAccount:[],
        commentAccount:[],
        likeCounter:0,
        likeState:0,
        savingState:0,
        loginUid:this.props.loginUid,
        modalIsOpen:false
         
    }
    render(){
        return(  
            <div className="container max-width: 100% mt-3 d-flex gx-5 align-items-start">
                <MyModal  info={this.state.modalInfoAry} 
                        tag={this.state.postTagAry} 
                        comment = {this.state.postCommentAry}
                        commentCounter = {this.state.commentCounter}                   
                        commentAccount = {this.state.commentAccount}      
                        likeState = {this.state.likeState}
                        savingState = {this.state.savingState}
                        loginUid = {this.state.loginUid}
                        likeCounter= {this.state.likeCounter}
                        handleModal = {this.handleModal}
                        handleLikeState = {this.handleLikeState} 
                        handleSavingState = {this.handleSavingState}
                        modalIsOpen = {this.state.modalIsOpen}
                        modalIsClose = {this.handleModalColse}
                        />
                <FilterBar handleFilterBar={this.handleFilterBar}/>
                <Content dataAry={this.state.dataAry} handleModal={this.handleModal}/>
            </div>
        );
    }
    handleModalColse = ()=>{
        let newState = {...this.state};
        newState.modalIsOpen = false;
        console.log("modal close!");
        this.setState(newState);
    }
    componentDidMount = async() =>{
        let result = await axios.get("http://localhost:8000/viewPage/imgList");
        let newState = {...this.state};
        newState.dataAry = result.data;
        console.log("************************");
        console.log(this.state);
        this.setState(newState);
    }
    handleFilterBar = (result) =>{
        let newState = {...this.state};
        newState.dataAry = result.data;
        console.log("newState:",newState);
        this.setState(newState);
    }  
    handleModal = async(postid)=>{
        console.log("***************************");
        const [postContent, postTag,postComment,
              commentCounter,commentAccount,likeCounter,likeState,savingState] = await Promise.all([

            axios.get(`http://localhost:8000/viewPage/getModal?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getTag?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getComment?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getCommentCouner?postid=${postid}`),        
            axios.get(`http://localhost:8000/viewPage/getCommentAccount?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getLikeCounter?postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getLikeState?uid=${this.state.loginUid}&postid=${postid}`),
            axios.get(`http://localhost:8000/viewPage/getSavingState?uid=${this.state.loginUid}&postid=${postid}`)       
        ]);

        let newState = {...this.state};

        newState.modalInfoAry = postContent.data;   
        newState.postTagAry = postTag.data;     
        newState.postCommentAry = postComment.data;
        newState.commentCounter = commentCounter.data ; 
        newState.commentAccount = commentAccount.data;
        newState.likeCounter = likeCounter.data[0].likeCounter;
        newState.likeState = likeState.data[0].state;
        newState.savingState = savingState.data[0].state;
        newState.modalIsOpen = true ; 
        console.log("change to newState:",newState);
        
        this.setState(newState);
    }
    handleLikeState = (state)=>{  
        let newState = {...this.state};
        newState.likeState = state ;     
        (state) ? newState.likeCounter+=1:newState.likeCounter-=1;        
        this.setState(newState);
    }
    handleSavingState = (state)=>{   
        let newState = {...this.state};
        newState.savingState = state ;      
        this.setState(newState);
    }
    hafle
}

//整頁viewPage
class viewPage extends React.Component{
    state = {};
    
    render(){ 
        return(
            <React.Fragment>
                <h1>{this.props.userId}</h1>
                <Container loginUid={this.props.userId}/>  
            </React.Fragment>
        );
    }   
}


export default viewPage;