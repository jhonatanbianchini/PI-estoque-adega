const token = localStorage.getItem("token");

if(!token){
    window.location.href="login.html";
}

async function criarProduto(){

    const produto = document.getElementById("produto").value;
    const quantidade = document.getElementById("quantidade").value;
    const validade = document.getElementById("validade").value;

    const response = await fetch(`${API}/products`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            produto,
            quantidade,
            validade
        })
    });

    if(response.ok){

        alert("Produto criado");

        window.location.href="estoque.html";
    }
}