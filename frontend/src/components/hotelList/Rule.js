import React from 'react'
import { Slide } from "react-awesome-reveal";

import '../../css/rule.css'

const Rule = () => {
  return (
    <div className='ruleContainer' id='policy'>
        <div className='ruleWrapper'>
            <Slide>
              <h1>住宿規定</h1>
            </Slide>
            
            <ul className='rules'>
                <li>在不加床的情況下，1名12歲以下兒童可免費入住（不附早餐）。</li>
                <li>不提供加床服務。</li>
                <li>所有「特殊需求」均須視現場實際情況而定，並可能須要向您酌收額外費用。</li>
                <li>辦理入住時，需出示照片證件和信用卡。</li>
                <li>辦理入住時，需繳交每晚TWD 1,000的押金，住宿期間若無額外消費或損壞設備的情況，可於退房時一併退還。</li>
                <li>所有特殊需求都必須經過住宿確認。</li>
                <li>若有緊急特殊需求，請直接聯絡住宿。</li>
                <li>游泳池因天候或季節因素，每年一、二月將不開放使用，開放時間請依飯店公告為準。</li>
                <li>為控制新冠疫情，飯店可能要求客人出示其他文件，以證明其身份、行程安排，以及其他相關資訊。請聯絡住宿以瞭解詳情。</li>
                <li>飯店保留權利對客人提供的信用卡進行預授權以作擔保。</li>
                <li>請注意：若單筆預訂超過五間客房，可能會需要遵守其他相關規定以及符合額外的要求。</li>
            </ul>
      </div>
    </div>
  )
}

export default Rule
