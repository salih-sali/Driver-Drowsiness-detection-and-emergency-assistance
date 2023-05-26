const contactForm = document.getElementById('contact-form');
document.getElementById("cancel-button").addEventListener("click", function(){
    window.location.href = "nav.html";
});

console.log(localStorage.getItem('ear'))
contactForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = contactForm.querySelector("input[name='name']").value;
  const phone = contactForm.querySelector("input[name='phone']").value;
  const relationship = contactForm.querySelector("input[name='relationship']").value;

  const data = {
    contact_name: name,
    contact_num: phone,
    contact_relation: relationship,
    phone: localStorage.getItem("phone")
  };
console.log(data)
  fetch("http://localhost:3001/update-contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if(data.status == "SUCCESS"){
        alert("details updated")
        localStorage.setItem("Contact-num",data.data.contact_num)
        localStorage.setItem("Contact-name",data.data.contact_name)
        localStorage.setItem("Contact-rel",data.data.contact_relation)
        localStorage.setItem('c_up', '1');
        window.location.href = "nav.html";
    }

})
  .catch(error => console.error(error));
});


const cancelButton = document.getElementById('cancel-button');
cancelButton.addEventListener('click', () => {
  // Navigate to the cancel page here
});

