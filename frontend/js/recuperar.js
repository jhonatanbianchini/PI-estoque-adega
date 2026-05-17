async function alterarSenha(){

    const usuario = document.getElementById("usuario").value;
    const chave = document.getElementById("chave").value;
    const novaSenha = document.getElementById("novaSenha").value;

    const response = await fetch(`${API}/auth/reset-password`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            usuario,
            chave,
            novaSenha
        })
    });

    const data = await response.json();

    if(response.ok){

        alert("Senha alterada");

        window.location.href="login.html";

    }else{
        alert(data.message);
    }
}