"use client";

const SignupFooter = () => {
    const icons = [
        "https://res.cloudinary.com/zapier-media/image/upload/q_auto/v1685631505/Company%20logos/dropbox_bfeqf0.svg",
        "https://res.cloudinary.com/zapier-media/image/upload/q_auto/v1685631782/Company%20logos/lyft_xb3vqy.svg",
        "https://res.cloudinary.com/zapier-media/image/upload/q_auto/v1685631507/Company%20logos/hello-fresh_spytbw.svg",
        "https://res.cloudinary.com/zapier-media/image/upload/q_auto/v1685631505/Company%20logos/asana_sgibbb.svg",
        "https://res.cloudinary.com/zapier-media/image/upload/q_auto/v1685631509/Company%20logos/zendesk_g4uhso.svg"
    ];

    return (
        <div>
            <p className='text-center mb-5'>Trusted By Companies</p>
            <div className='flex gap-x-40'>
            {icons.map((src, index) => (
                
                <img 
                    key={index} 
                    className="css-1qgv5r7-Img" 
                    alt={
                    "/"
                    } 
                    loading="lazy" 
                    src={src} 
                    style={{ borderRadius: "0px" }}
                />
            ))}
            </div>
        </div>
    );
}

export default SignupFooter;