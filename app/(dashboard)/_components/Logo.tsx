import React from 'react'
import Image from 'next/image'

const Logo = () => {
    return (
        <Image height={200} width={200} className='mt-2 pb-2' alt={"logo"} src={'/mixtechniques.png'} />
    )
}

export default Logo