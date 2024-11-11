const adminLoginForm = document.querySelector(
  '[data-element="adminLoginForm"]'
);

const handleAdminLogin = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const data = { email, password };

  try {
    const response = await fetch("http://localhost:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      localStorage.setItem("adminToken", data.email);
      window.location.href = "/src/dash.html";
    }
  } catch (error) {
    console.log(error);
    alert("Login falhou!");
  }

  e.target.reset();
};

adminLoginForm.addEventListener("submit", handleAdminLogin);
