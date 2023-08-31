import React, { ElementType } from 'react'
import './sidebarOption.styles.css'

type Props = {
    Icon?: ElementType;
    title: string;
}

function SidebarOption({ title, Icon }: Props) {
    return (
        <div className='sidebarOption'>
            {Icon && <Icon className='sidebarOption_icon' />}
            {Icon? <h4>{title}</h4> : <p>{title}</p>}
        </div>
    )
}

export default SidebarOption
