import React from 'react';

const About = () => {
  return (
      <div style={{maxWidth: "800px", margin: "0 auto", padding: "40px 20px"}}>
        <h1 style={{textAlign: "center", marginBottom: "40px"}}>About Our Project</h1>

        <p>This project is built by a dedicated team of three members. Our aim is to improve and revolutionize the online shopping experience, with a focus on quality and service.</p>

        <div style={{display: "flex", justifyContent: "space-between", marginTop: "50px"}}>
          {["Member 1", "Member 2", "Member 3"].map((member, index) =>
              <div style={{flex: "1 0 21%", textAlign: "center", padding: "20px", boxSizing: "border-box"}}>
                <img src="https://via.placeholder.com/150" alt={`team member ${index + 1}`}
                     style={{width: "100%", borderRadius: "50%"}}
                />
                <h2 style={{marginTop: "15px"}}>{member}</h2>
                <p>Role in the Project</p>
              </div>
          )}
        </div>
      </div>
  );
}

export default About;