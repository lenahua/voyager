import { useEffect } from 'react';
import CLOUDS from 'vanta/src/vanta.clouds';
import '../../css/welcomePage/cloud.css';
function App() {
    useEffect( () =>{
        CLOUDS({
            el: '#background',
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00
        })
    }, [])
    return(
        <div id="background"></div>
    )
}
export default App;