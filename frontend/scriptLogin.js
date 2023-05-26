//const loginForm = document.querySelector("form.login");
const signupForm = document.querySelector("form.signup");


loginForm.addEventListener("submit", function(event) {
 
  event.preventDefault();

 
  const phone = loginForm.querySelector("input[type='tel']").value;
  const password = loginForm.querySelector("input[type='password']").value;

  
  console.log("Login form submitted");
  console.log("Phone number: " + phone);
  console.log("Password: " + password);

  fetch("http://localhost:3001/signin", {
      method: "POST",
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if(data.status == "SUCCESS"){
          
          
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            localStorage.setItem('phone', data.phone);
            localStorage.setItem('EAR', data.ear);
            localStorage.setItem('c_up', data.c_up);
            localStorage.setItem('m_up', data.m_up);

  window.location.href = 'nav.html';
        }
        else if (data.status == "FAILED") {
          alert("wrong pass")
          window.location.href = "index1.html"
        }
        
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });


  
});

signupForm.addEventListener("submit", function(event) {
    
  
    const name = signupForm.querySelector("input[type='text']").value;
    const phone = signupForm.querySelector("input[type='tel']").value;
    const password = signupForm.querySelector("input[type='password']").value;
    // const confirmPassword = signupForm.querySelector("input[type='password'][placeholder='Confirm password']").value;
  
    // if (password !== confirmPassword) {
    //   alert("Passwords do not match!");
    //   window.location.href = "index1.html";
    // }
  
    console.log("Signup form submitted");
    console.log("Name: " + name);
    console.log("Phone number: " + phone);
    console.log("Password: " + password);
   
  
   
    fetch("http://localhost:3001/signup", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        phone: phone,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if(data.status == "SUCCESS"){
            alert("sign in success")
            //loginBtn.click();
           
            window.location.href = "contact.html";
        }
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });
  });
  