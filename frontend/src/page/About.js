import React from 'react';
import Member1Image from '../assest/maryam.jpeg';
import Member2Image from '../assest/partner.jpeg';

const About = () => {

    const members = [
        { name: "Maryam Ashrafi", image: Member1Image, role: "Frontend" },
        { name: "Umaid Attar", image: Member2Image, role: "Backend" }
    ];

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#333", textTransform: "uppercase", fontSize: "28px" }}>About Our Project</h1>

            <p style={{ fontSize: "20px", lineHeight: "1.5", color: "#555" }}>
                This project is built by a dedicated team of two members. Our aim is to improve and revolutionize the online shopping experience, with a focus on quality and service.
            </p>

            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
                {members.map((member, index) =>
                    <div key={index} style={{ flex: "1 0 21%", textAlign: "center", padding: "20px", boxSizing: "border-box", height: "300px" }}>
                        <img src={member.image} alt={`team member ${index + 1}`}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <h2 style={{ marginTop: "15px", color: "#333", fontSize: "24px" }}>{member.name}</h2>
                        <p style={{ color: "#777", fontSize: "18px" }}>{member.role}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default About;
