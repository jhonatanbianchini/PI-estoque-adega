const token = localStorage.getItem("token");

if(!token){
    window.location.href="login.html";
}

async function carregarProdutos(){

    const response = await fetch(`${API}/products`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    const produtos = await response.json();

    const table = document.getElementById("table");

    table.innerHTML="";

    produtos.forEach(produto=>{

        table.innerHTML += `
        
        <div class="row">

            <div>${produto.produto}</div>

            <div>${produto.quantidade}</div>

            <div>${produto.validade}</div>

            <div class="actions">

                <button onclick="editar(${produto.id})">
                Editar
                </button>

                <button onclick="excluir(${produto.id})">
                Excluir
                </button>

            </div>

        </div>
        `;
    });
}

async function excluir(id){

    await fetch(`${API}/products/${id}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    carregarProdutos();
}

async function editar(id){

    const produto = prompt("Novo produto");
    const quantidade = prompt("Nova quantidade");
    const validade = prompt("Nova validade");

    await fetch(`${API}/products/${id}`,{
        method:"PUT",
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

    carregarProdutos();
}

function sair(){

    localStorage.removeItem("token");

    window.location.href="login.html";
}

carregarProdutos();