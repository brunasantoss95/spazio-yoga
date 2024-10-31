const adminLoginForm = document.querySelector(
  '[data-element="adminLoginForm"]'
);

const handleAdminLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch("http://localhost:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) window.location.href = "/admin/dash.html";
  } catch (error) {
    console.log(error);
    alert("Login falhou");
  }
};

adminLoginForm.addEventListener("submit", handleAdminLogin);
