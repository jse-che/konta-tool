import { iconsImgs } from '../../utils/images'
import './Cards.css'

const Cards = () => {
  return (
    <div className='grid-one-item grid-common grid-c1'>
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Cards</h3>
            <button className="grid-c-title-icon">
                <img src={iconsImgs.plus}/>
            </button>
        </div>
        <div className="grid-c1-content">
            <p>Balance</p>
            <div className="lg-value">$22</div>
        </div>
    </div>
  )
}

export default Cards