async function cadastrar(){

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const chave = document.getElementById("chave").value;

    const response = await fetch(`${API}/auth/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            usuario,
            senha,
            chave
        })
    });

    const data = await response.json();

    if(response.ok){

        alert("Usuário cadastrado");

        window.location.href="login.html";

    }else{
        alert(data.message);
    }
}