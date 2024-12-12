import React from 'react'

const HeroVideo = () => {
  return (
    <div>
        <video autoPlay={true} muted controlsList="nodownload noplaybackrate" data-testid="video" poster="https://res.cloudinary.com/zapier-media/image/upload/q_auto/f_auto/v1706049878/Homepage%20ZAP%20Jan%2024/poster-image_hero-1_jat3ne.png" preload="auto" src="https://res.cloudinary.com/zapier-media/video/upload/f_auto,q_auto/v1706042175/Homepage%20ZAP%20Jan%2024/012324_Homepage_Hero1_1920x1080_pwkvu4.mp4" title="Tame the chaos with Zapier" className="css-x794wr-Video__video">
        <track kind="captions" label="English" src="blob:https://zapier.com/1eb4c4fa-0530-44e7-96ea-06db697069a9" srcLang="" />
        </video>
    </div>
  )
}

export default HeroVideo